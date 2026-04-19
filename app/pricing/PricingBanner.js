"use client"
import { useSearchParams } from 'next/navigation'

const C = { g:'#2EC4B6', acc:'#E63946' }

export default function PricingBanner() {
  const params = useSearchParams()
  const success  = params.get('success')
  const canceled = params.get('canceled')
  const plan     = params.get('plan')

  if (success) {
    return (
      <div style={{
        background: `${C.g}18`, border: `1px solid ${C.g}50`,
        borderRadius: 10, padding: '0.85rem 1.1rem',
        marginBottom: '1.5rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>🎉</div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: C.g }}>
          You're on {plan === 'pro' ? 'Pro' : 'Member'}!
        </div>
        <div style={{ fontSize: '0.65rem', color: '#9999AA', marginTop: 3 }}>
          Your subscription is active. Welcome to the full BuildSpec experience.
        </div>
      </div>
    )
  }

  if (canceled) {
    return (
      <div style={{
        background: `${C.acc}12`, border: `1px solid ${C.acc}40`,
        borderRadius: 10, padding: '0.85rem 1.1rem',
        marginBottom: '1.5rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#9999AA' }}>
          Checkout canceled — no charge was made.
        </div>
      </div>
    )
  }

  return null
}
