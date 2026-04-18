import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Lazy init — env vars not available at build time
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}
function getSupabase() {
  return createClient('https://mykvcojasfftliexypnm.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY)
}

const APP_URL = 'https://thebuildspec.com'

export async function POST(request) {
  const stripe = getStripe()
  const supabase = getSupabase()

  const PRICE_IDS = {
    member: process.env.STRIPE_MEMBER_PRICE_ID,
    pro:    process.env.STRIPE_PRO_PRICE_ID,
  }
  // Verify the user's Supabase JWT from Authorization header
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { plan } = body
  if (!['member', 'pro'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan. Must be "member" or "pro".' }, { status: 400 })
  }

  const priceId = PRICE_IDS[plan]
  if (!priceId) {
    return NextResponse.json({ error: `Price ID for plan "${plan}" is not configured.` }, { status: 500 })
  }

  // Get or create Stripe customer, linked to this user
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, subscription_tier')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    })
    customerId = customer.id
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  // Check if they already have an active subscription — if so, create a portal session instead
  if (profile?.subscription_tier !== 'free' && profile?.subscription_tier != null) {
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${APP_URL}/pricing`,
      })
      return NextResponse.json({ url: portalSession.url, portal: true })
    } catch {
      // Billing portal not configured — fall through to new checkout
    }
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${APP_URL}/pricing?success=1&plan=${plan}`,
    cancel_url: `${APP_URL}/pricing?canceled=1`,
    metadata: { user_id: user.id, plan },
    subscription_data: {
      metadata: { user_id: user.id, plan },
    },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
