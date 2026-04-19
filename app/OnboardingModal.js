"use client"
import { useState } from 'react'
import { useAuth } from '@/lib/auth'

const C = { bg:'#08080B', s1:'#12121A', s2:'#1A1A25', s3:'#20202E', bdr:'#2A2A3A', t:'#EEEEF2', tm:'#9999AA', td:'#666677', acc:'#E63946', g:'#2EC4B6', y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const MAKES = [
  'Acura','BMW','Buick','Chevrolet','Dodge','Ford','Honda','Mazda',
  'Mercury','Mitsubishi','Nissan','Pontiac','Saturn','Subaru',
  'Toyota','Volkswagen','Volvo','Other',
]

const SKILL_LEVELS = [
  { value:'beginner',     label:'Beginner',     desc:'Still learning — looking for guidance',       icon:'🔰' },
  { value:'intermediate', label:'Intermediate',  desc:'Comfortable with basic mods and maintenance', icon:'🔧' },
  { value:'advanced',     label:'Advanced',      desc:'Tuning, suspension, engine work',             icon:'⚡' },
  { value:'shop_tech',    label:'Shop Tech',     desc:'Professional service background',             icon:'🛠️' },
  { value:'builder',      label:'Builder',       desc:'Full builds, swaps, fabrication',             icon:'🏆' },
]

const INTERESTS = [
  { value:'junkyard swaps',  label:'Junkyard Swaps',  icon:'🏴‍☠️' },
  { value:'budget builds',   label:'Budget Builds',   icon:'💸' },
  { value:'drift',           label:'Drift',           icon:'💨' },
  { value:'track',           label:'Track',           icon:'🏁' },
  { value:'overlanding',     label:'Overlanding',     icon:'⛺' },
  { value:'daily driver',    label:'Daily Driver',    icon:'🚗' },
  { value:'sleeper',         label:'Sleeper',         icon:'😴' },
]

const STEPS = ['Make', 'Skill', 'Garage', 'Interests']

export default function OnboardingModal() {
  const { profile, updateProfile } = useAuth()
  const [step, setStep] = useState(0)
  const [make, setMake] = useState('')
  const [skill, setSkill] = useState('')
  const [carInput, setCarInput] = useState('')
  const [garage, setGarage] = useState([])
  const [interests, setInterests] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function addCar() {
    const v = carInput.trim()
    if (!v || garage.includes(v)) return
    setGarage(g => [...g, v])
    setCarInput('')
  }

  function removeCar(car) {
    setGarage(g => g.filter(c => c !== car))
  }

  function toggleInterest(val) {
    setInterests(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    )
  }

  function canAdvance() {
    if (step === 0) return !!make
    if (step === 1) return !!skill
    return true
  }

  async function handleFinish() {
    setSaving(true)
    setError('')
    const { error: err } = await updateProfile({
      favorite_make: make || null,
      skill_level: skill || null,
      garage: garage.length ? garage : null,
      interests: interests.length ? interests : null,
      onboarding_complete: true,
    })
    setSaving(false)
    if (err) setError('Something went wrong. Please try again.')
    // On success the profile state updates in AuthProvider,
    // which causes AuthWrapper to unmount this modal.
  }

  const username = profile?.display_name || profile?.username || 'there'

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(0,0,0,0.85)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:16, fontFamily:fs,
    }}>
      <div style={{
        background:C.s1, borderRadius:20,
        border:`1px solid ${C.bdr}`, width:'100%', maxWidth:460,
        overflow:'hidden', animation:'fadeUp 0.25s ease-out',
      }}>
        {/* Top accent */}
        <div style={{height:3, background:`linear-gradient(90deg,${C.acc},${C.g},${C.y})`}}/>

        <div style={{padding:'1.75rem 1.75rem 1.5rem'}}>

          {/* Header */}
          <div style={{marginBottom:'1.25rem'}}>
            <div style={{fontSize:'0.55rem', fontWeight:700, color:C.acc, fontFamily:fm, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6}}>
              Welcome to BuildSpec
            </div>
            <h2 style={{fontSize:'1.3rem', fontWeight:900, margin:0, lineHeight:1.2}}>
              Hey {username} 👋
            </h2>
            <p style={{fontSize:'0.72rem', color:C.tm, marginTop:6, lineHeight:1.5}}>
              Quick setup — takes 30 seconds.
            </p>
          </div>

          {/* Progress */}
          <div style={{display:'flex', gap:4, marginBottom:'1.5rem'}}>
            {STEPS.map((s, i) => (
              <div key={s} style={{flex:1}}>
                <div style={{
                  height:3, borderRadius:2,
                  background: i <= step ? C.acc : C.bdr,
                  transition:'background 0.2s',
                }}/>
                <div style={{fontSize:'0.45rem', color: i === step ? C.acc : C.td, marginTop:3, textAlign:'center', fontWeight: i === step ? 700 : 400}}>
                  {s}
                </div>
              </div>
            ))}
          </div>

          {/* ── Step 0: Favorite Make ── */}
          {step === 0 && (
            <div style={{animation:'fadeIn 0.2s ease-out'}}>
              <label style={{fontSize:'0.7rem', fontWeight:700, color:C.t, display:'block', marginBottom:'0.6rem'}}>
                What's your favorite manufacturer?
              </label>
              <select
                value={make}
                onChange={e => setMake(e.target.value)}
                style={{
                  width:'100%', padding:'10px 12px', borderRadius:8,
                  background:C.s2, border:`1px solid ${make ? C.acc : C.bdr}`,
                  color: make ? C.t : C.td, fontSize:'0.78rem',
                  fontFamily:fs, outline:'none', cursor:'pointer',
                  appearance:'none', WebkitAppearance:'none',
                }}
              >
                <option value="">Select a make...</option>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}

          {/* ── Step 1: Skill Level ── */}
          {step === 1 && (
            <div style={{animation:'fadeIn 0.2s ease-out'}}>
              <label style={{fontSize:'0.7rem', fontWeight:700, color:C.t, display:'block', marginBottom:'0.6rem'}}>
                What's your skill level?
              </label>
              <div style={{display:'flex', flexDirection:'column', gap:6}}>
                {SKILL_LEVELS.map(sl => (
                  <button
                    key={sl.value}
                    onClick={() => setSkill(sl.value)}
                    style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'10px 14px', borderRadius:10,
                      background: skill === sl.value ? `${C.acc}18` : C.s2,
                      border:`1px solid ${skill === sl.value ? C.acc : C.bdr}`,
                      color:C.t, cursor:'pointer', textAlign:'left',
                      transition:'all 0.15s', minHeight:44,
                    }}
                  >
                    <span style={{fontSize:'1.1rem', flexShrink:0}}>{sl.icon}</span>
                    <div>
                      <div style={{fontSize:'0.75rem', fontWeight:700}}>{sl.label}</div>
                      <div style={{fontSize:'0.58rem', color:C.td, marginTop:1}}>{sl.desc}</div>
                    </div>
                    {skill === sl.value && (
                      <span style={{marginLeft:'auto', color:C.acc, fontSize:'0.8rem'}}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Garage ── */}
          {step === 2 && (
            <div style={{animation:'fadeIn 0.2s ease-out'}}>
              <label style={{fontSize:'0.7rem', fontWeight:700, color:C.t, display:'block', marginBottom:'0.6rem'}}>
                What cars do you own? <span style={{color:C.td, fontWeight:400}}>(optional)</span>
              </label>
              <div style={{display:'flex', gap:6, marginBottom:'0.75rem'}}>
                <input
                  type="text"
                  value={carInput}
                  onChange={e => setCarInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCar() }}}
                  placeholder="e.g. 2003 Honda Civic EG"
                  style={{
                    flex:1, padding:'9px 12px', borderRadius:8,
                    background:C.s2, border:`1px solid ${C.bdr}`,
                    color:C.t, fontSize:'0.75rem', fontFamily:fs,
                    outline:'none',
                  }}
                />
                <button
                  onClick={addCar}
                  disabled={!carInput.trim()}
                  style={{
                    padding:'9px 14px', borderRadius:8,
                    background: carInput.trim() ? C.acc : C.bdr,
                    border:'none', color:carInput.trim() ? '#fff' : C.td,
                    fontSize:'0.75rem', fontWeight:700,
                    cursor: carInput.trim() ? 'pointer' : 'default',
                    transition:'background 0.15s', minHeight:44, flexShrink:0,
                  }}
                >
                  Add
                </button>
              </div>
              {garage.length > 0 ? (
                <div style={{display:'flex', flexDirection:'column', gap:5}}>
                  {garage.map(car => (
                    <div key={car} style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'7px 12px', borderRadius:8,
                      background:C.s3, border:`1px solid ${C.bdr}`,
                    }}>
                      <span style={{fontSize:'0.72rem', color:C.t}}>🚙 {car}</span>
                      <button
                        onClick={() => removeCar(car)}
                        style={{background:'none', border:'none', color:C.td, cursor:'pointer', fontSize:'0.75rem', padding:'0 2px', minHeight:24}}
                      >✕</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{fontSize:'0.62rem', color:C.td, textAlign:'center', padding:'1rem 0'}}>
                  Type a car above and hit Add — or skip this step.
                </p>
              )}
            </div>
          )}

          {/* ── Step 3: Interests ── */}
          {step === 3 && (
            <div style={{animation:'fadeIn 0.2s ease-out'}}>
              <label style={{fontSize:'0.7rem', fontWeight:700, color:C.t, display:'block', marginBottom:'0.6rem'}}>
                What are you into? <span style={{color:C.td, fontWeight:400}}>(pick any)</span>
              </label>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6}}>
                {INTERESTS.map(interest => {
                  const active = interests.includes(interest.value)
                  return (
                    <button
                      key={interest.value}
                      onClick={() => toggleInterest(interest.value)}
                      style={{
                        display:'flex', alignItems:'center', gap:8,
                        padding:'9px 12px', borderRadius:10,
                        background: active ? `${C.g}18` : C.s2,
                        border:`1px solid ${active ? C.g : C.bdr}`,
                        color: active ? C.g : C.tm,
                        cursor:'pointer', textAlign:'left',
                        transition:'all 0.15s', minHeight:44,
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      <span style={{fontSize:'1rem', flexShrink:0}}>{interest.icon}</span>
                      <span style={{fontSize:'0.68rem'}}>{interest.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p style={{fontSize:'0.65rem', color:C.acc, marginTop:'0.75rem', textAlign:'center'}}>{error}</p>
          )}

          {/* Actions */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1.5rem', gap:8}}>
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  padding:'9px 16px', borderRadius:8, background:'none',
                  border:`1px solid ${C.bdr}`, color:C.tm,
                  fontSize:'0.72rem', cursor:'pointer', minHeight:40,
                }}
              >
                ← Back
              </button>
            ) : (
              <div/>
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canAdvance()}
                style={{
                  padding:'10px 24px', borderRadius:8,
                  background: canAdvance() ? C.acc : C.bdr,
                  border:'none', color: canAdvance() ? '#fff' : C.td,
                  fontSize:'0.78rem', fontWeight:700,
                  cursor: canAdvance() ? 'pointer' : 'default',
                  transition:'background 0.15s', minHeight:44,
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                style={{
                  padding:'10px 24px', borderRadius:8,
                  background: saving ? C.bdr : C.g,
                  border:'none', color: saving ? C.td : '#08080B',
                  fontSize:'0.78rem', fontWeight:800,
                  cursor: saving ? 'default' : 'pointer',
                  transition:'background 0.15s', minHeight:44,
                }}
              >
                {saving ? 'Saving...' : "Let's Go 🚀"}
              </button>
            )}
          </div>

          {/* Skip */}
          {step < STEPS.length - 1 ? (
            <p style={{textAlign:'center', marginTop:'0.75rem'}}>
              <button
                onClick={() => setStep(s => s + 1)}
                style={{background:'none', border:'none', color:C.td, fontSize:'0.6rem', cursor:'pointer', padding:0}}
              >
                Skip this step
              </button>
            </p>
          ) : (
            <p style={{textAlign:'center', marginTop:'0.75rem'}}>
              <button
                onClick={handleFinish}
                disabled={saving}
                style={{background:'none', border:'none', color:C.td, fontSize:'0.6rem', cursor:'pointer', padding:0}}
              >
                Skip and finish
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  )
}
