"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CheckoutButton({ plan, cta, highlight, color }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function handleClick() {
    setErr('')
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // Not logged in — send to main app where they can sign up/in
        window.location.href = '/?auth=1'
        return
      }
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setErr(data.error || 'Something went wrong. Try again.')
        setLoading(false)
      }
    } catch (e) {
      setErr('Network error. Try again.')
      setLoading(false)
    }
  }

  const base = {
    display: 'block',
    textAlign: 'center',
    padding: '10px 0',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: '0.78rem',
    cursor: loading ? 'wait' : 'pointer',
    border: `1px solid ${highlight ? '' : color + '60'}`,
    background: loading ? color + '80' : highlight ? color : 'transparent',
    color: highlight ? '#08080B' : color,
    width: '100%',
    fontFamily: "'Inter',system-ui,sans-serif",
    transition: 'opacity 0.15s',
    minHeight: 40,
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading} style={base}>
        {loading ? 'Redirecting...' : cta}
      </button>
      {err && (
        <p style={{ fontSize: '0.6rem', color: '#E63946', marginTop: 6, textAlign: 'center' }}>
          {err}
        </p>
      )}
    </div>
  )
}
