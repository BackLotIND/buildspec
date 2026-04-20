"use client"
import { useState, useRef, useEffect } from 'react'

const C = { bg:'#08080B',s1:'#12121A',s2:'#1A1A25',bdr:'#2A2A3A',t:'#EEEEF2',tm:'#9999AA',td:'#666677',acc:'#E63946',accD:'#E6394620',g:'#2EC4B6',y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const FEED_CAT = {
  market_watch:   { l:'Market Watch',   c:'#3B82F6' },
  industry_roast: { l:'Industry Roast', c:'#E63946' },
  hidden_gem:     { l:'Hidden Gem',     c:'#2EC4B6' },
  rip:            { l:'RIP',            c:'#6B7280' },
  price_alert:    { l:'Price Alert',    c:'#F97316' },
}

function timeAgo(d) {
  const s = Math.floor((Date.now()-new Date(d))/1000)
  if (s<60) return `${s}s`
  if (s<3600) return `${Math.floor(s/60)}m`
  if (s<86400) return `${Math.floor(s/3600)}h`
  return `${Math.floor(s/86400)}d`
}

function fmtK(n) {
  return n>=1000 ? `$${(n/1000).toFixed(n%1000===0?0:1)}k` : `$${n}`
}

function CommentSection({ item, user, profile, supabase }) {
  const [comments, setComments]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [draft, setDraft]         = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr]             = useState('')
  const inputRef = useRef(null)

  const tier = profile?.subscription_tier
  const canComment = user?.id && (tier === 'member' || tier === 'pro')

  useEffect(() => {
    setLoading(true)
    supabase
      .from('feed_comments')
      .select('id,username,content,created_at')
      .eq('item_id', item.id)
      .eq('item_type', item._type)
      .order('created_at', { ascending: true })
      .limit(50)
      .then(({ data }) => { setComments(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [item.id, item._type])

  async function submit() {
    const text = draft.trim()
    if (!text || submitting) return
    setSubmitting(true); setErr('')
    const username = profile?.username || 'builder'
    const { data, error } = await supabase
      .from('feed_comments')
      .insert({ item_id: item.id, item_type: item._type, user_id: user.id, username, content: text })
      .select('id,username,content,created_at')
      .single()
    setSubmitting(false)
    if (error) { setErr('Could not post. Try again.'); return }
    setComments(prev => [...prev, data])
    setDraft('')
  }

  function handleKey(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
  }

  return (
    <div style={{ borderTop:`1px solid ${C.bdr}`, marginTop:10, paddingTop:10 }}>
      {/* Comment list */}
      {loading ? (
        <div style={{ fontSize:'0.62rem', color:C.td, padding:'6px 0' }}>Loading…</div>
      ) : comments.length === 0 ? (
        <div style={{ fontSize:'0.62rem', color:C.td, padding:'4px 0 8px' }}>No comments yet.</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:10 }}>
          {comments.map(c => (
            <div key={c.id} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
              {/* Avatar initial */}
              <div style={{
                width:24, height:24, borderRadius:'50%', flexShrink:0,
                background:`linear-gradient(135deg,${C.acc},${C.g})`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.6rem', fontWeight:800, color:'#fff', fontFamily:fm,
              }}>
                {c.username[0].toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:2 }}>
                  <span style={{ fontSize:'0.62rem', fontWeight:700, color:C.t }}>@{c.username}</span>
                  <span style={{ fontSize:'0.52rem', color:C.td, fontFamily:fm }}>{timeAgo(c.created_at)}</span>
                </div>
                <p style={{ fontSize:'0.7rem', color:C.tm, lineHeight:1.5, margin:0 }}>{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      {canComment ? (
        <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
          <textarea
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Add a comment… (⌘↵ to send)"
            rows={1}
            style={{
              flex:1, padding:'7px 10px', borderRadius:8,
              border:`1px solid ${draft ? C.acc+'80' : C.bdr}`,
              background:C.s2, color:C.t, fontSize:'0.7rem',
              fontFamily:fs, outline:'none', resize:'none',
              lineHeight:1.4, transition:'border-color 0.15s',
            }}
          />
          <button
            onClick={submit}
            disabled={!draft.trim() || submitting}
            style={{
              padding:'7px 14px', borderRadius:8, border:'none',
              background: draft.trim() ? C.acc : C.s2,
              color: draft.trim() ? '#fff' : C.td,
              fontSize:'0.68rem', fontWeight:700, cursor: draft.trim() ? 'pointer' : 'default',
              fontFamily:fs, flexShrink:0, transition:'background 0.15s,color 0.15s',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? '…' : 'Post'}
          </button>
        </div>
      ) : user?.id ? (
        <div style={{ fontSize:'0.62rem', color:C.td, padding:'4px 0', fontStyle:'italic' }}>
          Upgrade to Member or Pro to comment.
        </div>
      ) : (
        <div style={{ fontSize:'0.62rem', color:C.td, padding:'4px 0', fontStyle:'italic' }}>
          Sign in as a member to comment.
        </div>
      )}
      {err && <div style={{ fontSize:'0.62rem', color:C.acc, marginTop:4 }}>{err}</div>}
    </div>
  )
}

export default function FeedCard({ item, i, user, profile, supabase, makes, platforms, liked, onLike }) {
  const [expanded, setExpanded] = useState(false)

  const make = makes?.find(x => x.id === item.make_id)
  const plat = platforms?.find(x => x.id === item.platform_id)

  const borderColor = {
    news:   C.bdr,
    thread: C.bdr,
    bounty: '#F9731625',
    review: `${C.g}25`,
  }[item._type] || C.bdr

  // ── Card header (type badge row + timestamp) shared layout ──
  const timestamp = <span style={{fontSize:'0.52rem',color:C.td,fontFamily:fm,flexShrink:0,marginLeft:8}}>{timeAgo(item.created_at)}</span>

  // ── Comment count label ──
  const commentBtn = (
    <button
      onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
      style={{
        background:'none', border:`1px solid ${expanded ? C.acc+'60' : C.bdr}`,
        borderRadius:20, padding:'3px 10px', color: expanded ? C.acc : C.td,
        fontSize:'0.58rem', cursor:'pointer', fontFamily:fs,
        display:'flex', alignItems:'center', gap:4,
        transition:'border-color 0.15s,color 0.15s',
        WebkitTapHighlightColor:'transparent',
      }}
    >
      💬 {expanded ? 'Hide' : 'Comment'}
    </button>
  )

  // ────────────────────────────────────────────────────────────
  // NEWS
  // ────────────────────────────────────────────────────────────
  if (item._type === 'news') {
    const cat = FEED_CAT[item.category] || { l: item.category, c: C.tm }
    return (
      <div style={{ background:C.s1, borderRadius:12, border:`1px solid ${borderColor}`, padding:'0.9rem 1rem', animation:`fadeUp 0.3s ease-out ${i*0.03}s both` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
          <span style={{ fontSize:'0.52rem', fontWeight:700, padding:'2px 8px', borderRadius:20, background:cat.c+'20', color:cat.c, border:`1px solid ${cat.c}40`, fontFamily:fm, letterSpacing:'0.06em' }}>{cat.l}</span>
          {timestamp}
        </div>
        <div style={{ fontSize:'0.85rem', fontWeight:700, color:C.t, lineHeight:1.3, marginBottom:item.headline?6:10 }}>{item.title}</div>
        {item.headline && <p style={{ fontSize:'0.68rem', color:C.tm, lineHeight:1.5, margin:'0 0 10px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.headline}</p>}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button
            onClick={() => { if(liked) return; onLike(item.id) }}
            style={{ background:'none', border:`1px solid ${liked?C.acc:C.bdr}`, borderRadius:20, padding:'3px 10px', color:liked?C.acc:C.td, fontSize:'0.58rem', cursor:liked?'default':'pointer', fontFamily:fs, display:'flex', alignItems:'center', gap:4 }}
          >
            {liked?'❤️':'🤍'} {item.like_count||0}
          </button>
          {commentBtn}
          <a href="/news" style={{ fontSize:'0.58rem', color:C.td, textDecoration:'none', marginLeft:'auto', opacity:0.7 }}>Read more →</a>
        </div>
        {expanded && <CommentSection item={item} user={user} profile={profile} supabase={supabase}/>}
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────
  // THREAD
  // ────────────────────────────────────────────────────────────
  if (item._type === 'thread') {
    return (
      <div style={{ background:C.s1, borderRadius:12, border:`1px solid ${borderColor}`, padding:'0.9rem 1rem', animation:`fadeUp 0.3s ease-out ${i*0.03}s both` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            <span style={{ fontSize:'0.52rem', fontWeight:700, padding:'2px 8px', borderRadius:20, background:'#7C3AED20', color:'#A78BFA', border:'1px solid #7C3AED40', fontFamily:fm }}>🔧 Build Thread</span>
            {plat && <span style={{ fontSize:'0.52rem', padding:'2px 7px', borderRadius:20, background:C.s2, color:C.td, fontFamily:fm }}>{make?.icon} {plat.name}</span>}
          </div>
          {timestamp}
        </div>
        <div style={{ fontSize:'0.85rem', fontWeight:700, color:C.t, lineHeight:1.3, marginBottom:item.description?6:10 }}>{item.title}</div>
        {item.description && <p style={{ fontSize:'0.68rem', color:C.tm, lineHeight:1.5, margin:'0 0 10px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.description}</p>}
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontSize:'0.58rem', color:C.td }}>👁 {item.view_count||0}</span>
          <span style={{ fontSize:'0.58rem', color:C.td }}>❤️ {item.like_count||0}</span>
          {commentBtn}
        </div>
        {expanded && <CommentSection item={item} user={user} profile={profile} supabase={supabase}/>}
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────
  // BOUNTY
  // ────────────────────────────────────────────────────────────
  if (item._type === 'bounty') {
    return (
      <div style={{ background:C.s1, borderRadius:12, border:`1px solid ${borderColor}`, padding:'0.9rem 1rem', animation:`fadeUp 0.3s ease-out ${i*0.03}s both` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            <span style={{ fontSize:'0.52rem', fontWeight:700, padding:'2px 8px', borderRadius:20, background:'#F9731620', color:'#F97316', border:'1px solid #F9731640', fontFamily:fm }}>🎯 Bounty</span>
            {item.budget_low && <span style={{ fontSize:'0.52rem', padding:'2px 7px', borderRadius:20, background:C.g+'18', color:C.g, fontFamily:fm, border:`1px solid ${C.g}30` }}>{fmtK(item.budget_low)}–{fmtK(item.budget_high)}</span>}
            {plat && <span style={{ fontSize:'0.52rem', padding:'2px 7px', borderRadius:20, background:C.s2, color:C.td, fontFamily:fm }}>{make?.icon} {plat.name}</span>}
          </div>
          {timestamp}
        </div>
        <div style={{ fontSize:'0.85rem', fontWeight:700, color:C.t, lineHeight:1.3, marginBottom:item.description?6:10 }}>{item.title}</div>
        {item.description && <p style={{ fontSize:'0.68rem', color:C.tm, lineHeight:1.5, margin:'0 0 10px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.description}</p>}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:'0.58rem', color:C.td }}>💬 {item.response_count||0} responses</span>
          {commentBtn}
          <a href="/bounties" style={{ fontSize:'0.58rem', color:'#F97316', textDecoration:'none', fontWeight:600, marginLeft:'auto' }}>View bounty →</a>
        </div>
        {expanded && <CommentSection item={item} user={user} profile={profile} supabase={supabase}/>}
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────
  // REVIEW
  // ────────────────────────────────────────────────────────────
  if (item._type === 'review') {
    const stars = Array.from({length:5},(_,idx)=>idx<item.rating?'★':'☆').join('')
    const ratingColor = item.rating>=4 ? C.g : item.rating===3 ? C.y : C.acc
    return (
      <div style={{ background:C.s1, borderRadius:12, border:`1px solid ${borderColor}`, padding:'0.9rem 1rem', animation:`fadeUp 0.3s ease-out ${i*0.03}s both` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            <span style={{ fontSize:'0.52rem', fontWeight:700, padding:'2px 8px', borderRadius:20, background:`${C.g}18`, color:C.g, border:`1px solid ${C.g}40`, fontFamily:fm }}>⭐ Part Review</span>
            {plat && <span style={{ fontSize:'0.52rem', padding:'2px 7px', borderRadius:20, background:C.s2, color:C.td, fontFamily:fm }}>{make?.icon} {plat.name}</span>}
          </div>
          {timestamp}
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
          <span style={{ fontSize:'0.85rem', fontWeight:700, color:C.t, lineHeight:1.3 }}>{item.part_name}</span>
          <span style={{ fontSize:'0.75rem', color:ratingColor, fontFamily:fm, letterSpacing:'0.05em' }}>{stars}</span>
        </div>
        {item.title && <div style={{ fontSize:'0.7rem', fontWeight:600, color:C.tm, marginBottom:4 }}>{item.title}</div>}
        {item.content && <p style={{ fontSize:'0.68rem', color:C.tm, lineHeight:1.5, margin:'0 0 8px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.content}</p>}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {item.would_recommend && <span style={{ fontSize:'0.58rem', color:C.g }}>✓ Recommended</span>}
          {commentBtn}
        </div>
        {expanded && <CommentSection item={item} user={user} profile={profile} supabase={supabase}/>}
      </div>
    )
  }

  return null
}
