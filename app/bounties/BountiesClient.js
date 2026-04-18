"use client"
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = 'https://mykvcojasfftliexypnm.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3Zjb2phc2ZmdGxpZXh5cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTA1OTEsImV4cCI6MjA4OTYyNjU5MX0.jDGPr6c0DgmOzqbODnyLpVN7nlpbljk5knvq6cz720I'

const supabase = createClient(SUPA_URL, SUPA_KEY)

const C = { bg:'#08080B', s1:'#12121A', s2:'#1A1A25', bdr:'#2A2A3A', t:'#EEEEF2', tm:'#9999AA', td:'#666677', acc:'#E63946', g:'#2EC4B6', y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const CONDITION_CFG = {
  new:         { label:'New',          color:C.g,       bg:`${C.g}15`,       border:`${C.g}40`       },
  used:        { label:'Used',         color:C.y,       bg:`${C.y}15`,       border:`${C.y}40`       },
  oem:         { label:'OEM',          color:'#A8D5BA', bg:'#A8D5BA15',      border:'#A8D5BA40'      },
  aftermarket: { label:'Aftermarket',  color:'#B69CF5', bg:'#B69CF515',      border:'#B69CF540'      },
  junkyard:    { label:'Junkyard',     color:'#FB8500', bg:'#FB850015',      border:'#FB850040'      },
  any:         { label:'Any Condition',color:C.tm,      bg:`${C.bdr}`,       border:C.bdr            },
}

function timeRemaining(expiresAt) {
  if (!expiresAt) return null
  const diff = new Date(expiresAt) - Date.now()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (diff < 0) return { label:'Expired', color:C.acc, urgent:true }
  if (days === 0) return { label:`${hours}h left`, color:C.acc, urgent:true }
  if (days <= 3) return { label:`${days}d left`, color:C.y, urgent:true }
  return { label:`${days}d left`, color:C.td, urgent:false }
}

function formatBudget(lo, hi) {
  const fmt = n => n >= 1000 ? `$${(n/1000).toFixed(n%1000===0?0:1)}k` : `$${n}`
  if (!lo && hi) return `Up to ${fmt(hi)}`
  if (lo && !hi) return `${fmt(lo)}+`
  if (!lo && !hi) return 'Open budget'
  return `${fmt(lo)}–${fmt(hi)}`
}

function platformLabel(platformId) {
  if (!platformId) return null
  return platformId.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase())
}

function BountyCard({ b }) {
  const cond = CONDITION_CFG[b.condition] || CONDITION_CFG.any
  const time = timeRemaining(b.expires_at)
  const poster = b.poster

  return (
    <div style={{
      background:C.s1,
      borderRadius:14,
      border:`1px solid ${C.bdr}`,
      overflow:'hidden',
      display:'flex',
      flexDirection:'column',
      transition:'border-color 0.15s',
    }}
    onMouseEnter={e=>e.currentTarget.style.borderColor=C.g+'60'}
    onMouseLeave={e=>e.currentTarget.style.borderColor=C.bdr}
    >
      {/* top accent */}
      <div style={{height:2,background:`linear-gradient(90deg,${C.g},${C.g}40,transparent)`}}/>

      <div style={{padding:'1rem',flex:1,display:'flex',flexDirection:'column',gap:'0.7rem'}}>

        {/* header row */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:'0.85rem',fontWeight:800,color:C.t,lineHeight:1.25,marginBottom:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.title}</div>
            {platformLabel(b.platform_id) && (
              <div style={{display:'inline-block',fontSize:'0.5rem',fontWeight:700,padding:'2px 7px',borderRadius:10,background:`${C.g}15`,color:C.g,fontFamily:fm,letterSpacing:'0.06em',border:`1px solid ${C.g}30`}}>
                {platformLabel(b.platform_id)}
              </div>
            )}
            {!b.platform_id && b.make_id && (
              <div style={{display:'inline-block',fontSize:'0.5rem',fontWeight:700,padding:'2px 7px',borderRadius:10,background:`${C.tm}10`,color:C.tm,fontFamily:fm,letterSpacing:'0.06em',border:`1px solid ${C.bdr}`}}>
                {b.make_id.toUpperCase()}
              </div>
            )}
          </div>
          <div style={{flexShrink:0,textAlign:'right',display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}}>
            <div style={{fontSize:'1.1rem',fontWeight:900,color:C.y,fontFamily:fm,lineHeight:1}}>{formatBudget(b.budget_low,b.budget_high)}</div>
            <div style={{fontSize:'0.48rem',color:C.td}}>budget</div>
          </div>
        </div>

        {/* description */}
        {b.description && (
          <p style={{fontSize:'0.65rem',color:C.tm,lineHeight:1.55,margin:0,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
            {b.description}
          </p>
        )}

        {/* condition + time row */}
        <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:'0.52rem',fontWeight:700,padding:'2px 8px',borderRadius:10,background:cond.bg,color:cond.color,fontFamily:fm,border:`1px solid ${cond.border}`}}>
            {cond.label}
          </span>
          {time && (
            <span style={{fontSize:'0.52rem',fontWeight:time.urgent?700:400,color:time.color,fontFamily:fm}}>
              ⏱ {time.label}
            </span>
          )}
        </div>

        {/* footer row */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'auto',paddingTop:'0.25rem',borderTop:`1px solid ${C.bdr}`}}>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <div style={{width:18,height:18,borderRadius:'50%',background:`${C.g}20`,border:`1px solid ${C.g}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.5rem',color:C.g,fontFamily:fm,fontWeight:700}}>
              {(poster?.username||poster?.display_name||'?')[0].toUpperCase()}
            </div>
            <div>
              <div style={{fontSize:'0.55rem',color:C.tm,fontWeight:600}}>
                {poster?.username || poster?.display_name || 'Anonymous'}
                {poster?.is_verified_seller && <span style={{marginLeft:4,fontSize:'0.45rem',color:C.y}}>✓ Verified</span>}
              </div>
              {(poster?.location_city || poster?.location_state) && (
                <div style={{fontSize:'0.48rem',color:C.td}}>
                  📍 {[poster.location_city,poster.location_state].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            {b.response_count > 0 && (
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'0.75rem',fontWeight:800,color:C.g,fontFamily:fm,lineHeight:1}}>{b.response_count}</div>
                <div style={{fontSize:'0.42rem',color:C.td}}>response{b.response_count!==1?'s':''}</div>
              </div>
            )}
            {b.response_count === 0 && (
              <div style={{fontSize:'0.48rem',color:C.td}}>No responses yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PostModal({ user, profile, onClose, onPosted }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [platformId, setPlatformId] = useState('')
  const [makeId, setMakeId] = useState('')
  const [condition, setCondition] = useState('any')
  const [budgetLow, setBudgetLow] = useState('')
  const [budgetHigh, setBudgetHigh] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required.'); return }
    if (!budgetHigh) { setError('Budget is required.'); return }
    setSubmitting(true)
    setError(null)

    const { data: { session } } = await supabase.auth.getSession()
    const client = session
      ? createClient(SUPA_URL, SUPA_KEY, { global: { headers: { Authorization: `Bearer ${session.access_token}` } } })
      : supabase

    const { error: insertError } = await client.from('bounties').insert({
      poster_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      platform_id: platformId.trim().toLowerCase().replace(/\s+/g,'_') || null,
      make_id: makeId.trim().toLowerCase() || null,
      condition,
      budget_low: budgetLow ? parseInt(budgetLow) : null,
      budget_high: parseInt(budgetHigh),
    })

    setSubmitting(false)
    if (insertError) {
      setError(insertError.message || 'Failed to post bounty.')
    } else {
      onPosted()
    }
  }

  const inputStyle = {
    width:'100%',padding:'8px 12px',borderRadius:8,border:`1px solid ${C.bdr}`,
    background:C.s2,color:C.t,fontSize:'0.75rem',fontFamily:fs,outline:'none',
    boxSizing:'border-box',
  }
  const labelStyle = { fontSize:'0.6rem',color:C.td,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:4 }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}}>
      <div style={{background:C.s1,borderRadius:16,border:`1px solid ${C.bdr}`,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto'}}>
        {/* modal header */}
        <div style={{padding:'1.25rem 1.5rem',borderBottom:`1px solid ${C.bdr}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:'0.55rem',fontWeight:700,color:C.g,fontFamily:fm,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:2}}>New Bounty</div>
            <div style={{fontSize:'1rem',fontWeight:900,color:C.t}}>Post a Build Bounty</div>
          </div>
          <button onClick={onClose} style={{background:'transparent',border:'none',color:C.td,cursor:'pointer',fontSize:'1.2rem',lineHeight:1,padding:4}}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div>
            <label style={labelStyle}>What are you looking for? *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. K-series swap for my EG Civic, Portland area" style={inputStyle} maxLength={120}/>
          </div>

          <div>
            <label style={labelStyle}>Details (optional)</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Any specific requirements, mileage, color, notes for builders..." rows={3} style={{...inputStyle,resize:'vertical',lineHeight:1.5}}/>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div>
              <label style={labelStyle}>Platform (optional)</label>
              <input value={platformId} onChange={e=>setPlatformId(e.target.value)} placeholder="e.g. eg_civic, s2000" style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Make (optional)</label>
              <input value={makeId} onChange={e=>setMakeId(e.target.value)} placeholder="e.g. honda, toyota" style={inputStyle}/>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Condition wanted</label>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {Object.entries(CONDITION_CFG).map(([key,cfg]) => (
                <button key={key} type="button" onClick={()=>setCondition(key)} style={{
                  padding:'4px 12px',borderRadius:20,fontSize:'0.62rem',cursor:'pointer',fontFamily:fs,fontWeight:condition===key?700:400,
                  border:`1px solid ${condition===key?cfg.color:C.bdr}`,
                  background:condition===key?cfg.bg:'transparent',
                  color:condition===key?cfg.color:C.tm,
                  transition:'all 0.15s',
                }}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Budget</label>
            <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:8,alignItems:'center'}}>
              <input value={budgetLow} onChange={e=>setBudgetLow(e.target.value)} placeholder="Min (optional)" type="number" min="0" style={inputStyle}/>
              <span style={{fontSize:'0.65rem',color:C.td}}>to</span>
              <input value={budgetHigh} onChange={e=>setBudgetHigh(e.target.value)} placeholder="Max *" type="number" min="1" style={inputStyle}/>
            </div>
          </div>

          {error && (
            <div style={{fontSize:'0.65rem',color:C.acc,background:`${C.acc}10`,border:`1px solid ${C.acc}30`,borderRadius:8,padding:'8px 12px'}}>
              {error}
            </div>
          )}

          <div style={{display:'flex',gap:8,justifyContent:'flex-end',paddingTop:'0.25rem'}}>
            <button type="button" onClick={onClose} style={{padding:'8px 20px',borderRadius:8,border:`1px solid ${C.bdr}`,background:'transparent',color:C.tm,fontSize:'0.75rem',cursor:'pointer',fontFamily:fs}}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={{padding:'8px 24px',borderRadius:8,border:'none',background:C.g,color:'#08080B',fontSize:'0.75rem',fontWeight:700,cursor:submitting?'wait':'pointer',fontFamily:fs,opacity:submitting?0.7:1}}>
              {submitting ? 'Posting…' : 'Post Bounty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function BountiesClient({ initialBounties }) {
  const [bounties, setBounties] = useState(initialBounties)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [condFilter, setCondFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(data)
      }
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(data)
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const canPost = profile?.subscription_tier === 'member' || profile?.subscription_tier === 'pro'

  async function refreshBounties() {
    const { data } = await supabase
      .from('bounties')
      .select('*, poster:profiles!poster_id(username, display_name, location_city, location_state, is_verified_seller, reputation, completed_bounties)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
    if (data) setBounties(data)
  }

  const filtered = useMemo(() => {
    let list = bounties
    if (condFilter !== 'all') list = list.filter(b => b.condition === condFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        (b.description||'').toLowerCase().includes(q) ||
        (b.platform_id||'').toLowerCase().includes(q) ||
        (b.make_id||'').toLowerCase().includes(q)
      )
    }
    if (sort === 'newest') list = [...list].sort((a,b) => new Date(b.created_at)-new Date(a.created_at))
    if (sort === 'expiring') list = [...list].sort((a,b) => new Date(a.expires_at)-new Date(b.expires_at))
    if (sort === 'budget') list = [...list].sort((a,b) => (b.budget_high||0)-(a.budget_high||0))
    if (sort === 'responses') list = [...list].sort((a,b) => (b.response_count||0)-(a.response_count||0))
    return list
  }, [bounties, condFilter, search, sort])

  const totalBudget = bounties.reduce((s,b) => s+(b.budget_high||0), 0)
  const avgBudget = bounties.length ? Math.round(totalBudget/bounties.length) : 0

  function handlePostClick() {
    if (!user) {
      window.location.href = '/?auth=signin'
      return
    }
    if (!canPost) {
      window.location.href = '/pricing'
      return
    }
    setShowModal(true)
  }

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.t,fontFamily:fs}}>

      {/* Header */}
      <header style={{borderBottom:`1px solid ${C.bdr}`,padding:'12px 16px',background:C.s1,position:'sticky',top:0,zIndex:50}}>
        <div style={{maxWidth:960,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <a href="/" style={{fontSize:'1rem',fontWeight:800,fontFamily:fm,textDecoration:'none',color:C.t}}>
            BUILD<span style={{color:C.acc}}>SPEC</span>
          </a>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <a href="/" style={{fontSize:'0.6rem',color:C.tm,textDecoration:'none'}}>Home</a>
            <span style={{color:C.td,fontSize:'0.6rem'}}>/</span>
            <span style={{fontSize:'0.6rem',color:C.acc,fontWeight:600}}>Bounty Board</span>
          </div>
        </div>
      </header>

      <div style={{maxWidth:960,margin:'0 auto',padding:'2rem 1rem 5rem'}}>

        {/* Hero */}
        <div style={{marginBottom:'2rem',borderRadius:16,overflow:'hidden',border:`1px solid ${C.g}25`,position:'relative',background:'#07070D',padding:'2rem'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 80% at 10% 50%,rgba(46,196,182,0.12) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 90% 20%,rgba(255,183,3,0.06) 0%,transparent 55%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1,display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1.5rem'}}>
            <div>
              <div style={{display:'inline-block',padding:'3px 12px',borderRadius:20,background:`${C.g}15`,border:`1px solid ${C.g}30`,fontSize:'0.55rem',color:C.g,fontFamily:fm,fontWeight:700,letterSpacing:'0.12em',marginBottom:'0.75rem',textTransform:'uppercase'}}>
                Community Marketplace
              </div>
              <h1 style={{fontSize:'clamp(1.5rem,4vw,2.2rem)',fontWeight:900,marginBottom:'0.5rem',letterSpacing:'-0.03em',lineHeight:1.1}}>
                Bounty Board
              </h1>
              <p style={{fontSize:'0.78rem',color:C.tm,maxWidth:460,lineHeight:1.6,marginBottom:'1.25rem'}}>
                Post what you need. Pro builders respond. You pick your builder. No middlemen, no per-seat nonsense.
              </p>
              <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
                {[
                  {v:bounties.length,l:'Open Bounties',c:C.g},
                  {v:avgBudget?`$${avgBudget.toLocaleString()}`:'-',l:'Avg Budget',c:C.y},
                  {v:bounties.reduce((s,b)=>s+(b.response_count||0),0),l:'Responses',c:'#B69CF5'},
                ].map(s=>(
                  <div key={s.l}>
                    <div style={{fontSize:'1.5rem',fontWeight:900,color:s.c,fontFamily:fm,lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:'0.48rem',color:C.td,marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
              <button
                onClick={handlePostClick}
                style={{
                  padding:'10px 22px',borderRadius:10,border:`1px solid ${C.g}`,
                  background:canPost||!authLoading?C.g:'transparent',
                  color:canPost||!authLoading?'#08080B':C.g,
                  fontWeight:700,fontSize:'0.8rem',cursor:'pointer',fontFamily:fs,
                  whiteSpace:'nowrap',
                }}
              >
                + Post Bounty
              </button>
              {!authLoading && !user && (
                <div style={{fontSize:'0.52rem',color:C.td,textAlign:'right',maxWidth:160}}>Sign in to post a bounty</div>
              )}
              {!authLoading && user && !canPost && (
                <div style={{fontSize:'0.52rem',color:C.td,textAlign:'right',maxWidth:160}}>
                  <a href="/pricing" style={{color:C.g,textDecoration:'none'}}>Upgrade to Member</a> to post
                </div>
              )}
              {!authLoading && user && canPost && (
                <div style={{fontSize:'0.52rem',color:C.td,textAlign:'right',maxWidth:160}}>
                  Expires in 30 days · Visible to all Pro builders
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1rem',alignItems:'center'}}>
          {/* condition filters */}
          {[{key:'all',label:'All',color:C.tm},...Object.entries(CONDITION_CFG).map(([k,v])=>({key:k,label:v.label,color:v.color}))].map(f=>(
            <button key={f.key} onClick={()=>setCondFilter(f.key)} style={{
              padding:'5px 12px',borderRadius:20,border:`1px solid ${condFilter===f.key?f.color:C.bdr}`,
              background:condFilter===f.key?`${f.color}15`:'transparent',
              color:condFilter===f.key?f.color:C.tm,
              fontSize:'0.62rem',cursor:'pointer',fontFamily:fs,fontWeight:condFilter===f.key?700:400,transition:'all 0.15s',
            }}>
              {f.key==='all'?`All (${bounties.length})`:f.label}
            </button>
          ))}

          <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
            {/* sort */}
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{
              padding:'5px 10px',borderRadius:20,border:`1px solid ${C.bdr}`,background:C.s1,
              color:C.tm,fontSize:'0.62rem',fontFamily:fs,outline:'none',cursor:'pointer',
            }}>
              <option value="newest">Newest first</option>
              <option value="expiring">Expiring soon</option>
              <option value="budget">Budget: high → low</option>
              <option value="responses">Most responses</option>
            </select>
            {/* search */}
            <input
              type="text"
              placeholder="Search bounties…"
              value={search}
              onChange={e=>setSearch(e.target.value)}
              style={{
                padding:'5px 12px',borderRadius:20,border:`1px solid ${C.bdr}`,
                background:C.s1,color:C.t,fontSize:'0.62rem',fontFamily:fs,outline:'none',width:170,
              }}
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:14}}>
            {filtered.map(b => <BountyCard key={b.id} b={b}/>)}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'5rem 2rem',color:C.td}}>
            {bounties.length === 0 ? (
              <>
                <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🎯</div>
                <div style={{fontSize:'1rem',fontWeight:800,color:C.tm,marginBottom:'0.5rem'}}>No bounties yet.</div>
                <div style={{fontSize:'0.72rem',color:C.td,marginBottom:'1.5rem',maxWidth:360,margin:'0 auto 1.5rem'}}>
                  Be the first to post one. Find a builder near you for any mod, swap, or build job.
                </div>
                <button onClick={handlePostClick} style={{padding:'10px 28px',borderRadius:8,border:'none',background:C.g,color:'#08080B',fontWeight:700,fontSize:'0.8rem',cursor:'pointer',fontFamily:fs}}>
                  Post the First Bounty →
                </button>
              </>
            ) : (
              <>
                <div style={{fontSize:'1.5rem',marginBottom:'0.75rem'}}>🔍</div>
                <div style={{fontSize:'0.8rem'}}>No bounties match that filter.</div>
              </>
            )}
          </div>
        )}

        {/* How it works */}
        {bounties.length === 0 && (
          <div style={{marginTop:'3rem',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
            {[
              {step:'01',title:'Post a Bounty',body:'Describe what you need — part, swap, full build. Set your budget and condition preference.'},
              {step:'02',title:'Builders Respond',body:'Verified Pro builders in your area see it and send offers with prices and availability.'},
              {step:'03',title:'Pick Your Builder',body:'Review their profiles, rep, and completed bounties. Message directly and close the deal.'},
              {step:'04',title:'Get It Done',body:'Payment through BuildSpec escrow. Release funds when satisfied. Rate your builder.'},
            ].map(s=>(
              <div key={s.step} style={{background:C.s1,borderRadius:10,border:`1px solid ${C.bdr}`,padding:'1rem'}}>
                <div style={{fontSize:'0.55rem',fontWeight:800,color:C.g,fontFamily:fm,letterSpacing:'0.1em',marginBottom:'0.4rem'}}>STEP {s.step}</div>
                <div style={{fontSize:'0.72rem',fontWeight:700,color:C.t,marginBottom:'0.4rem'}}>{s.title}</div>
                <div style={{fontSize:'0.63rem',color:C.tm,lineHeight:1.6}}>{s.body}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div style={{marginTop:'3rem',textAlign:'center',padding:'2rem',borderTop:`1px solid ${C.bdr}`}}>
          <p style={{fontSize:'0.72rem',color:C.td,marginBottom:'0.75rem'}}>Are you a builder? Go Pro to respond to bounties.</p>
          <a href="/pricing" style={{display:'inline-block',padding:'10px 28px',borderRadius:8,background:C.y,color:'#08080B',textDecoration:'none',fontWeight:700,fontSize:'0.82rem'}}>
            Go Pro → Fulfill Bounties
          </a>
        </div>
      </div>

      {/* Post Modal */}
      {showModal && (
        <PostModal
          user={user}
          profile={profile}
          onClose={()=>setShowModal(false)}
          onPosted={async ()=>{
            setShowModal(false)
            await refreshBounties()
          }}
        />
      )}
    </div>
  )
}
