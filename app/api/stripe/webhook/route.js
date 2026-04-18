import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}
function getSupabase() {
  return createClient('https://mykvcojasfftliexypnm.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Must read raw body to verify Stripe signature — do not parse as JSON first
export async function POST(request) {
  const stripe = getStripe()
  const supabase = getSupabase()

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  try {
    await handleEvent(event, supabase)
  } catch (err) {
    console.error(`Error handling Stripe event ${event.type}:`, err)
    // Return 200 so Stripe doesn't retry — log the failure internally
    return NextResponse.json({ error: 'Handler failed', type: event.type }, { status: 200 })
  }

  return NextResponse.json({ received: true })
}

async function handleEvent(event, supabase) {
  switch (event.type) {

    // ── Successful checkout → activate subscription ──────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.metadata?.user_id
      const plan   = session.metadata?.plan
      if (!userId || !plan) break

      await supabase.from('profiles').update({
        subscription_tier:      plan,
        subscription_status:    'active',
        stripe_customer_id:     session.customer,
        stripe_subscription_id: session.subscription,
      }).eq('id', userId)
      break
    }

    // ── Subscription updated (upgrade, downgrade, renewal) ───────────────────
    case 'customer.subscription.updated': {
      const sub    = event.data.object
      const userId = sub.metadata?.user_id
      if (userId) {
        await syncSubscription(userId, sub, supabase)
      } else {
        await syncByCustomer(sub, supabase)
      }
      break
    }

    // ── Subscription canceled or expired ────────────────────────────────────
    case 'customer.subscription.deleted': {
      const sub    = event.data.object
      const userId = sub.metadata?.user_id
      if (userId) {
        await supabase.from('profiles').update({
          subscription_tier:       'free',
          subscription_status:     'canceled',
          stripe_subscription_id:  null,
          subscription_expires_at: new Date(sub.current_period_end * 1000).toISOString(),
        }).eq('id', userId)
      } else {
        await downgradeByCustomer(sub.customer, supabase)
      }
      break
    }

    // ── Payment failed → mark past_due, access continues until period ends ───
    case 'invoice.payment_failed': {
      const invoice = event.data.object
      await updateStatusByCustomer(invoice.customer, 'past_due', supabase)
      break
    }

    // ── Renewal succeeded → ensure status stays active ───────────────────────
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object
      if (invoice.billing_reason === 'subscription_cycle') {
        await updateStatusByCustomer(invoice.customer, 'active', supabase)
      }
      break
    }

    default:
      break
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function planFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_MEMBER_PRICE_ID) return 'member'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID)    return 'pro'
  return null
}

function stripeStatusToInternal(stripeStatus) {
  if (stripeStatus === 'active')    return 'active'
  if (stripeStatus === 'past_due')  return 'past_due'
  if (stripeStatus === 'canceled')  return 'canceled'
  return 'inactive'
}

async function syncSubscription(userId, sub, supabase) {
  const priceId  = sub.items?.data?.[0]?.price?.id
  const plan     = sub.metadata?.plan || planFromPriceId(priceId) || 'free'
  const status   = stripeStatusToInternal(sub.status)
  const isActive = sub.status === 'active' || sub.status === 'trialing'

  await supabase.from('profiles').update({
    subscription_tier:       isActive ? plan : 'free',
    subscription_status:     status,
    stripe_subscription_id:  sub.id,
    subscription_expires_at: new Date(sub.current_period_end * 1000).toISOString(),
  }).eq('id', userId)
}

async function syncByCustomer(sub, supabase) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', sub.customer)
    .single()
  if (profile?.id) await syncSubscription(profile.id, sub, supabase)
}

async function downgradeByCustomer(customerId, supabase) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()
  if (profile?.id) {
    await supabase.from('profiles').update({
      subscription_tier:      'free',
      subscription_status:    'canceled',
      stripe_subscription_id: null,
    }).eq('id', profile.id)
  }
}

async function updateStatusByCustomer(customerId, status, supabase) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()
  if (profile?.id) {
    await supabase.from('profiles').update({ subscription_status: status }).eq('id', profile.id)
  }
}
