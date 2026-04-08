"use client"
import { useState, useMemo } from 'react'

const C = { bg:'#08080B', s1:'#12121A', s2:'#1A1A25', bdr:'#2A2A3A', t:'#EEEEF2', tm:'#9999AA', td:'#666677', acc:'#E63946', g:'#2EC4B6', y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const SEV_CFG = {
  10: { label:'DESTROYED', color:'#E63946', bg:'#E6394615', border:'#E6394640', emoji:'☠️', desc:'Beyond recovery' },
  9:  { label:'WRECKED',   color:'#E63946', bg:'#E6394610', border:'#E6394630', emoji:'💀', desc:'Permanently ruined' },
  8:  { label:'COOKED',    color:'#FB8500', bg:'#FB850015', border:'#FB850040', emoji:'🔥', desc:'Thanks, YouTube' },
  7:  { label:'TAXED',     color:'#FB8500', bg:'#FB850010', border:'#FB850030', emoji:'📈', desc:'Instagram found it' },
  6:  { label:'ELEVATED',  color:'#FFB703', bg:'#FFB70315', border:'#FFB70340', emoji:'😬', desc:'Prices crept up' },
  5:  { label:'NOTICED',   color:'#FFB703', bg:'#FFB70310', border:'#FFB70330', emoji:'👀', desc:'The algorithm stirred' },
  4:  { label:'MILD',      color:'#2EC4B6', bg:'#2EC4B615', border:'#2EC4B640', emoji:'🤏', desc:'Barely affected' },
}

function getSevCfg(severity) {
  return SEV_CFG[severity] || SEV_CFG[Math.min(10, Math.max(4, severity))] || SEV_CFG[5]
}

function formatPrice(n) {
  if (!n && n !== 0) return '—'
  return n >= 1000 ? `$${(n/1000).toFixed(n%1000===0?0:1)}k` : `$${n}`
}

function PriceArrow({ then, now }) {
  if (!then || !now) return null
  const pct = Math.round(((now - then) / then) * 100)
  const gained = now > then
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
      <span style={{fontSize:'0.95rem',fontWeight:900,color:C.tm,fontFamily:fm,textDecoration:'line-through',opacity:0.6}}>{formatPrice(then)}</span>
      <span style={{fontSize:'0.7rem',color:C.td}}>→</span>
      <span style={{fontSize:'1.1rem',fontWeight:900,color:gained?C.acc:C.g,fontFamily:fm}}>{formatPrice(now)}</span>
      {pct !== 0 && (
        <span style={{fontSize:'0.6rem',fontWeight:700,padding:'2px 8px',borderRadius:20,background:gained?'#E6394620':'#2EC4B620',color:gained?C.acc:C.g,fontFamily:fm}}>
          {gained?'+':''}{pct}%
        </span>
      )}
    </div>
  )
}

function EntryCard({ entry }) {
  const cfg = getSevCfg(entry.severity)

  return (
    <div style={{background:C.s1,borderRadius:14,border:`1px solid ${cfg.border}`,overflow:'hidden',display:'flex',flexDirection:'column'}}>
      {/* Top bar */}
      <div style={{height:3,background:`linear-gradient(90deg,${cfg.color},${cfg.color}40,transparent)`}}/>

      <div style={{padding:'1rem',flex:1,display:'flex',flexDirection:'column',gap:'0.75rem'}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
          <div>
            <div style={{fontSize:'0.9rem',fontWeight:800,color:C.t,lineHeight:1.2,marginBottom:4}}>{entry.car_name}</div>
            {entry.subtitle && (
              <div style={{fontSize:'0.6rem',color:C.td,fontFamily:fm}}>{entry.subtitle}</div>
            )}
          </div>
          <div style={{flexShrink:0}}>
            <span style={{fontSize:'0.58rem',fontWeight:800,padding:'3px 10px',borderRadius:20,background:cfg.bg,color:cfg.color,fontFamily:fm,letterSpacing:'0.08em',border:`1px solid ${cfg.border}`,whiteSpace:'nowrap'}}>
              {cfg.emoji} {cfg.label}
            </span>
            <div style={{fontSize:'0.5rem',color:C.td,textAlign:'right',marginTop:3,fontFamily:fm}}>severity {entry.severity}/10</div>
          </div>
        </div>

        {/* Price comparison */}
        {(entry.price_then || entry.price_now) && (
          <div style={{padding:'0.6rem 0.75rem',background:C.s2,borderRadius:10,border:`1px solid ${C.bdr}`}}>
            <div style={{fontSize:'0.48rem',color:C.td,fontFamily:fm,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Market Reality</div>
            <PriceArrow then={entry.price_then} now={entry.price_now} />
          </div>
        )}

        {/* Used to be */}
        {entry.used_to_be && (
          <div>
            <div style={{fontSize:'0.52rem',color:C.g,fontFamily:fm,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>Used To Be</div>
            <p style={{fontSize:'0.68rem',color:C.tm,lineHeight:1.55,margin:0,borderLeft:`2px solid ${C.g}`,paddingLeft:'0.6rem'}}>
              {entry.used_to_be}
            </p>
          </div>
        )}

        {/* Is now */}
        {entry.is_now && (
          <div>
            <div style={{fontSize:'0.52rem',color:cfg.color,fontFamily:fm,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>Is Now</div>
            <p style={{fontSize:'0.68rem',color:C.t,lineHeight:1.55,margin:0,borderLeft:`2px solid ${cfg.color}`,paddingLeft:'0.6rem',fontStyle:'italic'}}>
              "{entry.is_now}"
            </p>
          </div>
        )}

        {/* Cultural shift */}
        {entry.cultural_shift && (
          <div style={{fontSize:'0.63rem',color:C.tm,lineHeight:1.55,padding:'0.5rem 0.65rem',background:C.bg,borderRadius:8,border:`1px solid ${C.bdr}`}}>
            <span style={{color:C.td,fontFamily:fm,fontSize:'0.5rem',fontWeight:700,display:'block',marginBottom:3,textTransform:'uppercase',letterSpacing:'0.08em'}}>What Happened</span>
            {entry.cultural_shift}
          </div>
        )}

        {/* Warning */}
        {entry.warning && (
          <div style={{fontSize:'0.6rem',color:'#FB8500',background:'#FB850010',border:'1px solid #FB850030',borderRadius:8,padding:'6px 10px',lineHeight:1.5,fontFamily:fm}}>
            ⚠ {entry.warning}
          </div>
        )}
      </div>
    </div>
  )
}

export default function InternetEffectClient({ entries }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchFilter = filter === 'all' || (
        filter === 'destroyed' ? e.severity >= 9 :
        filter === 'cooked'    ? e.severity >= 7 && e.severity <= 8 :
        filter === 'elevated'  ? e.severity >= 5 && e.severity <= 6 :
        e.severity <= 4
      )
      const matchSearch = !search ||
        e.car_name?.toLowerCase().includes(search.toLowerCase()) ||
        e.used_to_be?.toLowerCase().includes(search.toLowerCase()) ||
        e.is_now?.toLowerCase().includes(search.toLowerCase())
      return matchFilter && matchSearch
    })
  }, [entries, filter, search])

  const destroyed = entries.filter(e => e.severity >= 9).length
  const cooked    = entries.filter(e => e.severity >= 7 && e.severity <= 8).length
  const elevated  = entries.filter(e => e.severity >= 5 && e.severity <= 6).length
  const avgSev    = entries.length ? (entries.reduce((s,e) => s+(e.severity||0), 0) / entries.length).toFixed(1) : 0

  const filterBtns = [
    { id:'all',       label:`All (${entries.length})`,       color:C.tm,   border:C.bdr },
    { id:'destroyed', label:`☠️ Destroyed (${destroyed})`,   color:C.acc,  border:'#E6394640' },
    { id:'cooked',    label:`🔥 Cooked (${cooked})`,          color:'#FB8500', border:'#FB850040' },
    { id:'elevated',  label:`📈 Elevated (${elevated})`,     color:C.y,    border:'#FFB70340' },
  ]

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.t,fontFamily:fs}}>
      {/* Header */}
      <header style={{borderBottom:`1px solid ${C.bdr}`,padding:'12px 16px',background:C.s1,position:'sticky',top:0,zIndex:50}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <a href="/" style={{fontSize:'1rem',fontWeight:800,fontFamily:fm,textDecoration:'none',color:C.t,flexShrink:0}}>
            BUILD<span style={{color:C.acc}}>SPEC</span>
          </a>
          <div style={{display:'flex',gap:8,alignItems:'center',flexShrink:0,flexWrap:'wrap'}}>
            <a href="/" style={{fontSize:'0.6rem',color:C.tm,textDecoration:'none'}}>Home</a>
            <span style={{color:C.td,fontSize:'0.6rem'}}>/</span>
            <a href="/buy" style={{fontSize:'0.6rem',color:C.tm,textDecoration:'none'}}>Should You Buy?</a>
            <span style={{color:C.td,fontSize:'0.6rem'}}>/</span>
            <span style={{fontSize:'0.6rem',color:C.acc,fontWeight:600}}>The Internet Effect</span>
          </div>
        </div>
      </header>

      <div style={{maxWidth:1000,margin:'0 auto',padding:'2rem 1rem 4rem'}}>
        {/* Hero */}
        <div style={{marginBottom:'2rem',borderRadius:16,overflow:'hidden',border:'1px solid rgba(230,57,70,0.2)',position:'relative',background:'#07070D',padding:'2.5rem 2rem'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 80% at 5% 50%,rgba(230,57,70,0.18) 0%,transparent 60%), radial-gradient(ellipse 40% 60% at 95% 20%,rgba(251,133,0,0.08) 0%,transparent 55%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'inline-block',padding:'3px 12px',borderRadius:20,background:'rgba(230,57,70,0.12)',border:'1px solid rgba(230,57,70,0.25)',fontSize:'0.55rem',color:C.acc,fontFamily:fm,fontWeight:700,letterSpacing:'0.12em',marginBottom:'0.75rem',textTransform:'uppercase'}}>
              Post-Algorithm Autopsy
            </div>
            <h1 style={{fontSize:'clamp(1.6rem,4vw,2.4rem)',fontWeight:900,marginBottom:'0.5rem',letterSpacing:'-0.03em',lineHeight:1.1}}>
              The Internet Effect
            </h1>
            <p style={{fontSize:'0.82rem',color:C.tm,maxWidth:560,lineHeight:1.65,marginBottom:'1.5rem'}}>
              What happens when a car YouTube discovers your $8k budget enthusiast platform. The video gets 4 million views. The prices get 300% worse. You get a comment section full of people who bought one last week.
            </p>
            <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
              {[
                {v:destroyed,  l:'Fully Destroyed', c:C.acc},
                {v:cooked,     l:'Cooked by Clout',  c:'#FB8500'},
                {v:elevated,   l:'Price-Elevated',   c:C.y},
                {v:avgSev,     l:'Avg Severity',      c:C.acc, suffix:'/10'},
              ].map(s=>(
                <div key={s.l} style={{textAlign:'center'}}>
                  <div style={{fontSize:'1.4rem',fontWeight:900,color:s.c,fontFamily:fm,lineHeight:1}}>{s.v}{s.suffix||''}</div>
                  <div style={{fontSize:'0.52rem',color:C.td,marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote block */}
        <div style={{marginBottom:'2rem',padding:'2rem',borderRadius:14,background:C.s1,border:`1px solid ${C.bdr}`,borderLeft:`4px solid ${C.acc}`,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-10px',left:'1.5rem',fontSize:'6rem',color:C.acc,opacity:0.06,fontFamily:'Georgia,serif',lineHeight:1,pointerEvents:'none',userSelect:'none'}}>"</div>
          <blockquote style={{margin:0,position:'relative',zIndex:1}}>
            <p style={{fontSize:'clamp(1.05rem,2.5vw,1.4rem)',fontWeight:800,color:C.t,lineHeight:1.35,letterSpacing:'-0.02em',marginBottom:'0.75rem'}}>
              "There is no such thing as a cheap car in 2026. There are only gambles."
            </p>
            <p style={{fontSize:'0.78rem',color:C.tm,lineHeight:1.6,margin:0,fontStyle:'italic'}}>
              Pre-COVID pricing is a dead language. Adjust your expectations or cope harder.
            </p>
          </blockquote>
        </div>

        {/* Filters + search */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1.25rem',alignItems:'center'}}>
          {filterBtns.map(f => {
            const active = filter === f.id
            return (
              <button key={f.id} onClick={()=>setFilter(f.id)}
                style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${active?f.color:C.bdr}`,background:active?`${f.color}18`:'transparent',color:active?f.color:C.tm,fontSize:'0.62rem',cursor:'pointer',fontFamily:fs,fontWeight:active?700:400,transition:'all 0.15s'}}>
                {f.label}
              </button>
            )
          })}
          <input
            type="text"
            placeholder="Search cars..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{marginLeft:'auto',padding:'5px 12px',borderRadius:20,border:`1px solid ${C.bdr}`,background:C.s1,color:C.t,fontSize:'0.62rem',fontFamily:fs,outline:'none',width:160}}
          />
        </div>

        {/* Severity tier dividers (all view) */}
        {filter === 'all' ? (
          [
            {min:9, max:10, label:'☠️ DESTROYED — The internet found it and murdered the price', color:C.acc},
            {min:7, max:8,  label:'🔥 COOKED — YouTube did this. You know exactly which video.', color:'#FB8500'},
            {min:5, max:6,  label:'📈 ELEVATED — Algorithm stirred, prices crept, enthusiasts sighed', color:C.y},
            {min:0, max:4,  label:"👀 NOTICED — Barely touched, still findable if you're fast", color:C.g},
          ].map(tier => {
            const tierEntries = filtered.filter(e => e.severity >= tier.min && e.severity <= tier.max)
            if (!tierEntries.length) return null
            return (
              <div key={tier.min} style={{marginBottom:'2.5rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'0.75rem',paddingBottom:'0.5rem',borderBottom:`1px solid ${tier.color}25`}}>
                  <span style={{fontSize:'0.68rem',fontWeight:800,color:tier.color,fontFamily:fm}}>{tier.label}</span>
                  <span style={{fontSize:'0.52rem',color:C.td}}>({tierEntries.length})</span>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:14}}>
                  {tierEntries.map(e => <EntryCard key={e.id} entry={e} />)}
                </div>
              </div>
            )
          })
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:14}}>
            {filtered.map(e => <EntryCard key={e.id} entry={e} />)}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'4rem 2rem',color:C.td}}>
            <div style={{fontSize:'2rem',marginBottom:'0.75rem'}}>🔍</div>
            <div style={{fontSize:'0.8rem'}}>No entries match that filter.</div>
          </div>
        )}

        {/* Footer note */}
        <div style={{marginTop:'3rem',padding:'1.5rem',borderTop:`1px solid ${C.bdr}`,textAlign:'center'}}>
          <p style={{fontSize:'0.68rem',color:C.td,marginBottom:'0.5rem',lineHeight:1.6,maxWidth:500,margin:'0 auto 0.75rem'}}>
            Every car on this list was affordable, under-appreciated, and genuinely good. Then someone made a video.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <a href="/buy" style={{display:'inline-block',padding:'8px 22px',borderRadius:8,background:C.s1,color:C.tm,textDecoration:'none',fontWeight:600,fontSize:'0.75rem',border:`1px solid ${C.bdr}`}}>
              Should You Buy? →
            </a>
            <a href="/" style={{display:'inline-block',padding:'8px 22px',borderRadius:8,background:C.acc,color:'#fff',textDecoration:'none',fontWeight:700,fontSize:'0.75rem'}}>
              Plan Your Build on BuildSpec →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
