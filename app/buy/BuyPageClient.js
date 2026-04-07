"use client"
import { useState, useMemo } from 'react'

const C = { bg:'#08080B', s1:'#12121A', s2:'#1A1A25', bdr:'#2A2A3A', t:'#EEEEF2', tm:'#9999AA', td:'#666677', acc:'#E63946', g:'#2EC4B6', y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const VERDICT_CFG = {
  buy:       { label:'BUY',       color:'#2EC4B6', bg:'#2EC4B615', border:'#2EC4B640', emoji:'✅', desc:'Actually worth it' },
  maybe:     { label:'MAYBE',     color:'#A8D5BA', bg:'#A8D5BA15', border:'#A8D5BA40', emoji:'🤔', desc:'Has caveats' },
  overpriced:{ label:'OVERPRICED',color:'#FFB703', bg:'#FFB70315', border:'#FFB70340', emoji:'💸', desc:'Market got greedy' },
  cope:      { label:'COPE',      color:'#FB8500', bg:'#FB850015', border:'#FB850040', emoji:'🤡', desc:'You\'re rationalizing' },
  absurd:    { label:'ABSURD',    color:'#E63946', bg:'#E6394615', border:'#E6394640', emoji:'💀', desc:'Disconnected from reality' },
}

const COPE_LABELS = ['Reasonable','Slight premium','Worth noting','Watch out','Taxed','Taxed hard','Getting bad','Cope incoming','Full cope','Maximum cope','Unobtainium']

function formatPrice(lo, hi) {
  const fmt = n => n >= 1000 ? `$${(n/1000).toFixed(n%1000===0?0:1)}k` : `$${n}`
  return `${fmt(lo)}–${fmt(hi)}`
}

function CopeMeter({ level }) {
  const pct = (level / 10) * 100
  const color = level <= 2 ? C.g : level <= 4 ? '#A8D5BA' : level <= 6 ? C.y : level <= 8 ? '#FB8500' : C.acc
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span style={{fontSize:'0.52rem',color:C.td,fontFamily:fm,textTransform:'uppercase',letterSpacing:'0.06em'}}>Cope Meter</span>
        <span style={{fontSize:'0.52rem',color,fontFamily:fm,fontWeight:700}}>{COPE_LABELS[level]}</span>
      </div>
      <div style={{height:5,background:'#1E1E2A',borderRadius:3,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${color},${color}99)`,borderRadius:3,transition:'width 0.4s ease',animation:'barFill 0.6s ease-out'}}/>
      </div>
    </div>
  )
}

function VerdictCard({ v }) {
  const cfg = VERDICT_CFG[v.verdict] || VERDICT_CFG.maybe
  const priceDiff = v.asking_price_low - v.fair_price_low
  const overAmt = priceDiff > 0 ? formatPrice(priceDiff, v.asking_price_high - v.fair_price_high) : null

  return (
    <div style={{background:C.s1, borderRadius:14, border:`1px solid ${cfg.border}`, overflow:'hidden', display:'flex', flexDirection:'column'}}>
      {/* Top bar */}
      <div style={{height:3, background:`linear-gradient(90deg,${cfg.color},${cfg.color}40,transparent)`}}/>

      <div style={{padding:'1rem', flex:1, display:'flex', flexDirection:'column', gap:'0.65rem'}}>
        {/* Header row */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8}}>
          <div style={{flex:1}}>
            <div style={{fontSize:'0.85rem', fontWeight:800, color:C.t, lineHeight:1.2, marginBottom:3}}>{v.platform_id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</div>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0}}>
            <span style={{fontSize:'0.6rem', fontWeight:800, padding:'3px 10px', borderRadius:20, background:cfg.bg, color:cfg.color, fontFamily:fm, letterSpacing:'0.08em', border:`1px solid ${cfg.border}`}}>
              {cfg.emoji} {cfg.label}
            </span>
          </div>
        </div>

        {/* Hot take */}
        <p style={{fontSize:'0.68rem', color:C.t, lineHeight:1.45, fontStyle:'italic', margin:0, borderLeft:`2px solid ${cfg.color}`, paddingLeft:'0.6rem'}}>
          "{v.hot_take}"
        </p>

        {/* Price comparison */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <div style={{padding:'0.5rem', background:C.s2, borderRadius:8, border:`1px solid ${C.g}25`}}>
            <div style={{fontSize:'0.48rem', color:C.g, fontFamily:fm, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2}}>Fair Price</div>
            <div style={{fontSize:'0.82rem', fontWeight:800, color:C.g, fontFamily:fm}}>{formatPrice(v.fair_price_low, v.fair_price_high)}</div>
          </div>
          <div style={{padding:'0.5rem', background:C.s2, borderRadius:8, border:`1px solid ${cfg.color}25`}}>
            <div style={{fontSize:'0.48rem', color:cfg.color, fontFamily:fm, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2}}>Market Asks</div>
            <div style={{fontSize:'0.82rem', fontWeight:800, color:cfg.color, fontFamily:fm}}>{formatPrice(v.asking_price_low, v.asking_price_high)}</div>
          </div>
        </div>

        {/* Over-ask callout */}
        {overAmt && v.cope_level >= 5 && (
          <div style={{fontSize:'0.58rem', color:'#FB8500', background:'#FB850010', border:'1px solid #FB850030', borderRadius:6, padding:'4px 8px', fontFamily:fm}}>
            ↑ You're paying ~{formatPrice(priceDiff, v.asking_price_high - v.fair_price_high)} over BuildSpec fair value
          </div>
        )}

        {/* Reality check */}
        <p style={{fontSize:'0.63rem', color:C.tm, lineHeight:1.55, margin:0}}>{v.reality_check}</p>

        {/* Alternative */}
        {v.alternative_suggestion && (
          <div style={{fontSize:'0.58rem', color:C.td, background:C.bg, borderRadius:6, padding:'6px 8px', lineHeight:1.4}}>
            💡 Consider instead: <span style={{color:C.tm}}>{v.alternative_suggestion}</span>
          </div>
        )}

        {/* Cope meter */}
        <div style={{marginTop:'auto', paddingTop:'0.25rem'}}>
          <CopeMeter level={v.cope_level} />
        </div>
      </div>
    </div>
  )
}

export default function BuyPageClient({ verdicts }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return verdicts.filter(v => {
      const matchVerdict = filter === 'all' || v.verdict === filter
      const matchSearch = !search || v.platform_id.toLowerCase().includes(search.toLowerCase()) || v.hot_take.toLowerCase().includes(search.toLowerCase())
      return matchVerdict && matchSearch
    })
  }, [verdicts, filter, search])

  const counts = useMemo(() => {
    const c = { all: verdicts.length }
    verdicts.forEach(v => { c[v.verdict] = (c[v.verdict] || 0) + 1 })
    return c
  }, [verdicts])

  const avgCope = verdicts.length ? Math.round(verdicts.reduce((s,v) => s+v.cope_level, 0) / verdicts.length * 10) / 10 : 0

  return (
    <div style={{minHeight:'100vh', background:C.bg, color:C.t, fontFamily:fs}}>
      {/* Header */}
      <header style={{borderBottom:`1px solid ${C.bdr}`, padding:'12px 16px', background:C.s1, position:'sticky', top:0, zIndex:50}}>
        <div style={{maxWidth:960, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
          <a href="/" style={{fontSize:'1rem', fontWeight:800, fontFamily:fm, textDecoration:'none', color:C.t, flexShrink:0}}>
            BUILD<span style={{color:C.acc}}>SPEC</span>
          </a>
          <div style={{display:'flex', gap:8, alignItems:'center', flexShrink:0}}>
            <a href="/" style={{fontSize:'0.6rem', color:C.tm, textDecoration:'none'}}>Home</a>
            <span style={{color:C.td, fontSize:'0.6rem'}}>/</span>
            <span style={{fontSize:'0.6rem', color:C.acc, fontWeight:600}}>Should You Buy?</span>
          </div>
        </div>
      </header>

      <div style={{maxWidth:960, margin:'0 auto', padding:'2rem 1rem 4rem'}}>
        {/* Hero */}
        <div style={{marginBottom:'2rem', borderRadius:16, overflow:'hidden', border:`1px solid rgba(230,57,70,0.2)`, position:'relative', background:'#07070D', padding:'2.5rem 2rem'}}>
          <div style={{position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 80% at 10% 50%,rgba(230,57,70,0.15) 0%,transparent 60%), radial-gradient(ellipse 50% 60% at 90% 30%,rgba(46,196,182,0.08) 0%,transparent 55%)', pointerEvents:'none'}}/>
          <div style={{position:'relative', zIndex:1}}>
            <div style={{display:'inline-block', padding:'3px 12px', borderRadius:20, background:'rgba(230,57,70,0.12)', border:'1px solid rgba(230,57,70,0.25)', fontSize:'0.55rem', color:C.acc, fontFamily:fm, fontWeight:700, letterSpacing:'0.12em', marginBottom:'0.75rem', textTransform:'uppercase'}}>Brutally Honest Market Analysis</div>
            <h1 style={{fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:900, marginBottom:'0.5rem', letterSpacing:'-0.03em', lineHeight:1.1}}>Should You Buy?</h1>
            <p style={{fontSize:'0.82rem', color:C.tm, maxWidth:520, lineHeight:1.6, marginBottom:'1.5rem'}}>We checked the market. We checked your feelings. One of them is lying to you.</p>
            <div style={{display:'flex', gap:16, flexWrap:'wrap'}}>
              {[
                {v:counts.buy||0, l:'Worth Buying', c:C.g},
                {v:counts.overpriced||0, l:'Overpriced', c:C.y},
                {v:(counts.cope||0)+(counts.absurd||0), l:'Cope Tier', c:'#FB8500'},
                {v:avgCope, l:'Avg Cope Level', c:C.acc, suffix:'/10'},
              ].map(s=>(
                <div key={s.l} style={{textAlign:'center'}}>
                  <div style={{fontSize:'1.4rem', fontWeight:900, color:s.c, fontFamily:fm, lineHeight:1}}>{s.v}{s.suffix||''}</div>
                  <div style={{fontSize:'0.52rem', color:C.td, marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:'0.75rem', alignItems:'center'}}>
          {['all',...Object.keys(VERDICT_CFG)].map(v => {
            const cfg = v === 'all' ? {label:'All',color:C.tm,bg:'transparent',border:C.bdr,emoji:''} : VERDICT_CFG[v]
            const active = filter === v
            return (
              <button key={v} onClick={()=>setFilter(v)} style={{padding:'5px 12px', borderRadius:20, border:`1px solid ${active ? cfg.color : C.bdr}`, background: active ? cfg.bg : 'transparent', color: active ? cfg.color : C.tm, fontSize:'0.62rem', cursor:'pointer', fontFamily:fs, fontWeight: active ? 700 : 400, transition:'all 0.15s'}}>
                {cfg.emoji && `${cfg.emoji} `}{v === 'all' ? `All (${counts.all})` : `${cfg.label} (${counts[v]||0})`}
              </button>
            )
          })}
          <input
            type="text"
            placeholder="Search platforms..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{marginLeft:'auto', padding:'5px 12px', borderRadius:20, border:`1px solid ${C.bdr}`, background:C.s1, color:C.t, fontSize:'0.62rem', fontFamily:fs, outline:'none', width:160}}
          />
        </div>

        {/* Cope tier dividers */}
        {filter === 'all' ? (
          [10,8,6,4,2,0].map(tier => {
            const tierVerdicts = filtered.filter(v =>
              tier === 10 ? v.cope_level >= 10 :
              tier === 8  ? v.cope_level >= 8 && v.cope_level < 10 :
              tier === 6  ? v.cope_level >= 6 && v.cope_level < 8 :
              tier === 4  ? v.cope_level >= 4 && v.cope_level < 6 :
              tier === 2  ? v.cope_level >= 2 && v.cope_level < 4 :
              v.cope_level < 2
            )
            if (!tierVerdicts.length) return null
            const labels = {10:'💀 ABSURD — Disconnected from reality', 8:'🤡 COPE TIER — You know what you\'re doing', 6:'💸 OVERPRICED — The market got greedy', 4:'🤔 MAYBE — Has caveats worth knowing', 2:'⚠️ MILD TAX — Small premium over fair value', 0:'✅ ACTUALLY WORTH IT — Go buy one'}
            const colors = {10:C.acc, 8:'#FB8500', 6:C.y, 4:'#A8D5BA', 2:C.tm, 0:C.g}
            return (
              <div key={tier} style={{marginBottom:'2rem'}}>
                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:'0.75rem', paddingBottom:'0.5rem', borderBottom:`1px solid ${colors[tier]}25`}}>
                  <span style={{fontSize:'0.68rem', fontWeight:800, color:colors[tier], fontFamily:fm}}>{labels[tier]}</span>
                  <span style={{fontSize:'0.52rem', color:C.td}}>({tierVerdicts.length})</span>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12}}>
                  {tierVerdicts.map((v,i) => <VerdictCard key={v.id} v={v} i={i} />)}
                </div>
              </div>
            )
          })
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12}}>
            {filtered.map((v,i) => <VerdictCard key={v.id} v={v} i={i} />)}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{textAlign:'center', padding:'4rem 2rem', color:C.td}}>
            <div style={{fontSize:'2rem', marginBottom:'0.75rem'}}>🔍</div>
            <div style={{fontSize:'0.8rem'}}>No verdicts match that filter.</div>
          </div>
        )}

        {/* Footer CTA */}
        <div style={{marginTop:'3rem', textAlign:'center', padding:'2rem', borderTop:`1px solid ${C.bdr}`}}>
          <p style={{fontSize:'0.72rem', color:C.td, marginBottom:'0.75rem'}}>Found something worth buying? Plan the build.</p>
          <a href="/" style={{display:'inline-block', padding:'10px 28px', borderRadius:8, background:C.acc, color:'#fff', textDecoration:'none', fontWeight:700, fontSize:'0.82rem'}}>
            Plan Your Build on BuildSpec →
          </a>
        </div>
      </div>
    </div>
  )
}
