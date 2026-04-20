"use client"
import { useState, useMemo } from 'react'

const C = { bg:'#08080B',s1:'#12121A',s2:'#1A1A25',bdr:'#2A2A3A',t:'#EEEEF2',tm:'#9999AA',td:'#666677',acc:'#E63946',accD:'#E6394620',g:'#2EC4B6',y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const POST_TYPES = [
  { id:'build',    icon:'🔧', label:'Build Update',  desc:'Share progress with photos and a platform tag',           color:'#A78BFA' },
  { id:'review',   icon:'⭐', label:'Part Review',    desc:'Rate a part 1–5 stars with pros, cons, install notes',    color:'#2EC4B6' },
  { id:'bounty',   icon:'🎯', label:'Bounty',         desc:'Post a wanted part — let the community find it for you',  color:'#F97316' },
  { id:'question', icon:'❓', label:'Question',       desc:'Ask the community anything about builds or platforms',    color:'#3B82F6' },
]

const DIFFICULTY_LABELS = ['','Beginner','Easy','Medium','Hard','Expert']
const RATING_LABELS     = ['','Terrible','Bad','Okay','Good','Excellent']

export default function PostModal({ onClose, user, supabase, makes, platforms }) {
  const [type,       setType]       = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState(false)

  // ── Build Update ──────────────────────────────────────
  const [bTitle,  setBTitle]  = useState('')
  const [bDesc,   setBDesc]   = useState('')
  const [bMake,   setBMake]   = useState('')
  const [bPlat,   setBPlat]   = useState('')
  const [bStatus, setBStatus] = useState('in_progress')
  const [bImages, setBImages] = useState([''])

  // ── Part Review ───────────────────────────────────────
  const [rPart,    setRPart]    = useState('')
  const [rMake,    setRMake]    = useState('')
  const [rPlat,    setRPlat]    = useState('')
  const [rRating,  setRRating]  = useState(0)
  const [rTitle,   setRTitle]   = useState('')
  const [rContent, setRContent] = useState('')
  const [rPros,    setRPros]    = useState([''])
  const [rCons,    setRCons]    = useState([''])
  const [rDiff,    setRDiff]    = useState(3)
  const [rRec,     setRRec]     = useState(true)

  // ── Bounty ────────────────────────────────────────────
  const [boTitle, setBoTitle] = useState('')
  const [boDesc,  setBoDesc]  = useState('')
  const [boMake,  setBoMake]  = useState('')
  const [boPlat,  setBoPlat]  = useState('')
  const [boCond,  setBoCond]  = useState('any')
  const [boLo,    setBoLo]    = useState('')
  const [boHi,    setBoHi]    = useState('')

  // ── Question ──────────────────────────────────────────
  const [qTitle, setQTitle] = useState('')
  const [qBody,  setQBody]  = useState('')
  const [qMake,  setQMake]  = useState('')
  const [qPlat,  setQPlat]  = useState('')
  const [qTag,   setQTag]   = useState('')
  const [qTags,  setQTags]  = useState([])

  const platsBuild    = useMemo(() => platforms.filter(p => p.make === bMake),  [bMake, platforms])
  const platsReview   = useMemo(() => platforms.filter(p => p.make === rMake),  [rMake, platforms])
  const platsBounty   = useMemo(() => platforms.filter(p => p.make === boMake), [boMake, platforms])
  const platsQuestion = useMemo(() => platforms.filter(p => p.make === qMake),  [qMake, platforms])

  const reset = () => {
    setType(null); setError(''); setSuccess(false)
    setBTitle(''); setBDesc(''); setBMake(''); setBPlat(''); setBStatus('in_progress'); setBImages([''])
    setRPart(''); setRMake(''); setRPlat(''); setRRating(0); setRTitle(''); setRContent(''); setRPros(['']); setRCons(['']); setRDiff(3); setRRec(true)
    setBoTitle(''); setBoDesc(''); setBoMake(''); setBoPlat(''); setBoCond('any'); setBoLo(''); setBoHi('')
    setQTitle(''); setQBody(''); setQMake(''); setQPlat(''); setQTag(''); setQTags([])
  }

  const submit = async () => {
    setError(''); setSubmitting(true)
    try {
      if (type === 'build') {
        if (!bTitle.trim() || !bDesc.trim() || !bMake || !bPlat) { setError('Title, platform, and update text are required.'); setSubmitting(false); return }
        const imgs = bImages.filter(u => u.trim())
        const { error: e } = await supabase.from('build_threads').insert({
          user_id: user.id, title: bTitle.trim(), description: bDesc.trim(),
          make_id: bMake, platform_id: bPlat, status: bStatus,
          images: imgs,
        })
        if (e) throw e
      } else if (type === 'review') {
        if (!rPart.trim() || !rMake || !rPlat || !rRating || !rTitle.trim() || !rContent.trim()) { setError('Part name, platform, rating, title, and review are required.'); setSubmitting(false); return }
        const { error: e } = await supabase.from('part_reviews').insert({
          user_id: user.id, part_name: rPart.trim(), make_id: rMake, platform_id: rPlat,
          rating: rRating, title: rTitle.trim(), content: rContent.trim(),
          pros: rPros.filter(p => p.trim()),
          cons: rCons.filter(c => c.trim()),
          install_difficulty: rDiff, would_recommend: rRec,
        })
        if (e) throw e
      } else if (type === 'bounty') {
        if (!boTitle.trim() || !boMake || !boHi) { setError('Title, make, and max budget are required.'); setSubmitting(false); return }
        const { error: e } = await supabase.from('bounties').insert({
          poster_id: user.id, title: boTitle.trim(), description: boDesc.trim(),
          make_id: boMake, platform_id: boPlat || null, condition: boCond,
          budget_low:  boLo ? parseInt(boLo) : null,
          budget_high: parseInt(boHi),
        })
        if (e) throw e
      } else if (type === 'question') {
        if (!qTitle.trim() || !qBody.trim()) { setError('Question title and details are required.'); setSubmitting(false); return }
        const { error: e } = await supabase.from('community_questions').insert({
          user_id: user.id, title: qTitle.trim(), body: qBody.trim(),
          make_id: qMake || null, platform_id: qPlat || null, tags: qTags,
        })
        if (e) throw e
      }
      setSuccess(true)
    } catch(e) {
      setError(e?.message || 'Something went wrong. Try again.')
    }
    setSubmitting(false)
  }

  // ── Shared UI pieces ──────────────────────────────────
  const inp = { width:'100%', padding:'9px 12px', borderRadius:8, border:`1px solid ${C.bdr}`, background:C.s2, color:C.t, fontSize:'0.78rem', fontFamily:fs, outline:'none', boxSizing:'border-box' }

  const Field = ({ label, req, children }) => (
    <div>
      <label style={{ fontSize:'0.6rem', color:C.td, display:'block', marginBottom:4 }}>
        {label}{req && <span style={{ color:C.acc, marginLeft:2 }}>*</span>}
      </label>
      {children}
    </div>
  )

  const MakePlat = ({ makeVal, onMake, platVal, onPlat, filteredPlats, makeReq }) => (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
      <Field label="Make" req={makeReq}>
        <select value={makeVal} onChange={e => { onMake(e.target.value); onPlat('') }} style={{ ...inp, padding:'8px 10px' }}>
          <option value="">Select make…</option>
          {makes.map(m => <option key={m.id} value={m.id}>{m.icon} {m.name}</option>)}
        </select>
      </Field>
      <Field label="Platform">
        <select value={platVal} onChange={e => onPlat(e.target.value)} disabled={!makeVal} style={{ ...inp, padding:'8px 10px', opacity: makeVal ? 1 : 0.45, color: makeVal ? C.t : C.td }}>
          <option value="">Any platform</option>
          {filteredPlats.map(p => <option key={p.id} value={p.id}>{p.name} ({p.gen})</option>)}
        </select>
      </Field>
    </div>
  )

  const pt = POST_TYPES.find(p => p.id === type)

  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={() => { if (!submitting) onClose() }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background:C.s1, borderRadius:18, width:'100%', maxWidth:500, maxHeight:'92vh', overflow:'auto', border:`1.5px solid ${C.bdr}`, animation:'fadeUp 0.2s ease-out', display:'flex', flexDirection:'column' }}
      >
        {/* Header */}
        <div style={{ padding:'1.25rem 1.25rem 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexShrink:0 }}>
          <div>
            {pt && <div style={{ width:36, height:4, borderRadius:2, background:pt.color, marginBottom:8 }}/>}
            <div style={{ fontSize:'1rem', fontWeight:800, color:C.t, lineHeight:1.2 }}>
              {pt ? `${pt.icon} ${pt.label}` : 'Create Post'}
            </div>
            {!pt && <div style={{ fontSize:'0.62rem', color:C.td, marginTop:3 }}>What do you want to share?</div>}
          </div>
          <button onClick={() => { if (!submitting) onClose() }} style={{ background:'none', border:'none', color:C.td, fontSize:'1.2rem', cursor:'pointer', padding:'2px 4px', lineHeight:1, flexShrink:0 }}>✕</button>
        </div>

        <div style={{ padding:'1rem 1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.85rem' }}>

          {/* ── SUCCESS ── */}
          {success && (
            <div style={{ textAlign:'center', padding:'2rem 0.5rem' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:10 }}>✅</div>
              <div style={{ fontSize:'1rem', fontWeight:800, color:C.t, marginBottom:6 }}>Posted!</div>
              <div style={{ fontSize:'0.72rem', color:C.tm, marginBottom:'1.5rem', lineHeight:1.5 }}>
                {type==='build'  && 'Build update is live on the community feed.'}
                {type==='review' && 'Part review submitted — the community thanks you.'}
                {type==='bounty' && 'Bounty is live. The community will find it.'}
                {type==='question' && 'Question posted. Expect answers soon.'}
              </div>
              <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                <button onClick={reset} style={{ padding:'9px 20px', borderRadius:8, border:`1px solid ${C.bdr}`, background:'transparent', color:C.tm, fontSize:'0.75rem', cursor:'pointer', fontFamily:fs }}>Post Another</button>
                <button onClick={onClose} style={{ padding:'9px 24px', borderRadius:8, border:'none', background:C.acc, color:'#fff', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', fontFamily:fs }}>Done</button>
              </div>
            </div>
          )}

          {/* ── TYPE PICKER ── */}
          {!type && !success && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {POST_TYPES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setType(p.id)}
                  style={{ background:C.s2, border:`1px solid ${C.bdr}`, borderRadius:12, padding:'1rem', cursor:'pointer', textAlign:'left', transition:'border-color 0.15s,background 0.15s,transform 0.12s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.background = p.color+'12'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.bdr; e.currentTarget.style.background = C.s2; e.currentTarget.style.transform='translateY(0)' }}
                >
                  <div style={{ fontSize:'1.5rem', marginBottom:8, lineHeight:1 }}>{p.icon}</div>
                  <div style={{ fontSize:'0.8rem', fontWeight:700, color:C.t, marginBottom:4 }}>{p.label}</div>
                  <div style={{ fontSize:'0.6rem', color:C.td, lineHeight:1.4 }}>{p.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* ── BUILD UPDATE FORM ── */}
          {type==='build' && !success && (<>
            <Field label="Title" req>
              <input value={bTitle} onChange={e => setBTitle(e.target.value)} placeholder="e.g. Header installed — dyno next week" style={inp}/>
            </Field>
            <MakePlat makeVal={bMake} onMake={setBMake} platVal={bPlat} onPlat={setBPlat} filteredPlats={platsBuild} makeReq/>
            <Field label="Build Status">
              <select value={bStatus} onChange={e => setBStatus(e.target.value)} style={{ ...inp, padding:'8px 10px' }}>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </Field>
            <Field label="Build Update" req>
              <textarea value={bDesc} onChange={e => setBDesc(e.target.value)} placeholder="What happened? Progress, problems, wins, lessons learned…" rows={4} style={{ ...inp, resize:'vertical', lineHeight:1.55 }}/>
            </Field>
            <Field label="Image URLs (optional)">
              {bImages.map((url, i) => (
                <div key={i} style={{ display:'flex', gap:6, marginBottom:6 }}>
                  <input value={url} onChange={e => setBImages(a => { const n=[...a]; n[i]=e.target.value; return n })} placeholder="https://i.imgur.com/…" style={{ ...inp, flex:1 }}/>
                  {bImages.length > 1 && <button onClick={() => setBImages(a => a.filter((_,j) => j!==i))} style={{ background:'none', border:`1px solid ${C.bdr}`, borderRadius:6, color:C.td, padding:'0 10px', cursor:'pointer', fontFamily:fs }}>✕</button>}
                </div>
              ))}
              {bImages.length < 4 && <button onClick={() => setBImages(a => [...a, ''])} style={{ fontSize:'0.62rem', color:C.td, background:'none', border:`1px dashed ${C.bdr}`, borderRadius:6, padding:'5px 0', cursor:'pointer', fontFamily:fs, width:'100%' }}>+ Add image URL</button>}
            </Field>
          </>)}

          {/* ── PART REVIEW FORM ── */}
          {type==='review' && !success && (<>
            <Field label="Part Name" req>
              <input value={rPart} onChange={e => setRPart(e.target.value)} placeholder="e.g. Invidia R400 Cat-Back Exhaust" style={inp}/>
            </Field>
            <MakePlat makeVal={rMake} onMake={setRMake} platVal={rPlat} onPlat={setRPlat} filteredPlats={platsReview} makeReq/>
            <Field label="Rating" req>
              <div style={{ display:'flex', gap:4, alignItems:'center', marginTop:4 }}>
                {[1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    onClick={() => setRRating(n)}
                    style={{ fontSize:'1.5rem', background:'none', border:'none', cursor:'pointer', opacity: n<=rRating ? 1 : 0.2, transition:'opacity 0.1s,transform 0.1s', padding:'2px' }}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.2)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                  >⭐</button>
                ))}
                {rRating > 0 && <span style={{ fontSize:'0.65rem', color:C.td, marginLeft:6 }}>{RATING_LABELS[rRating]}</span>}
              </div>
            </Field>
            <Field label="Review Title" req>
              <input value={rTitle} onChange={e => setRTitle(e.target.value)} placeholder="e.g. Perfect fitment, sounds amazing" style={inp}/>
            </Field>
            <Field label="Full Review" req>
              <textarea value={rContent} onChange={e => setRContent(e.target.value)} placeholder="Share your honest experience — installation, performance, durability…" rows={3} style={{ ...inp, resize:'vertical', lineHeight:1.55 }}/>
            </Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Pros">
                {rPros.map((p, i) => (
                  <div key={i} style={{ display:'flex', gap:4, marginBottom:5 }}>
                    <input value={p} onChange={e => setRPros(a => { const n=[...a]; n[i]=e.target.value; return n })} placeholder={`Pro ${i+1}`} style={{ ...inp, fontSize:'0.7rem', flex:1 }}/>
                    {rPros.length > 1 && <button onClick={() => setRPros(a => a.filter((_,j) => j!==i))} style={{ background:'none', border:'none', color:C.td, cursor:'pointer', padding:'0 4px' }}>✕</button>}
                  </div>
                ))}
                {rPros.length < 5 && <button onClick={() => setRPros(a => [...a, ''])} style={{ fontSize:'0.6rem', color:C.g, background:'none', border:`1px dashed ${C.g}35`, borderRadius:5, padding:'4px 8px', cursor:'pointer', fontFamily:fs, width:'100%' }}>+ Pro</button>}
              </Field>
              <Field label="Cons">
                {rCons.map((c, i) => (
                  <div key={i} style={{ display:'flex', gap:4, marginBottom:5 }}>
                    <input value={c} onChange={e => setRCons(a => { const n=[...a]; n[i]=e.target.value; return n })} placeholder={`Con ${i+1}`} style={{ ...inp, fontSize:'0.7rem', flex:1 }}/>
                    {rCons.length > 1 && <button onClick={() => setRCons(a => a.filter((_,j) => j!==i))} style={{ background:'none', border:'none', color:C.td, cursor:'pointer', padding:'0 4px' }}>✕</button>}
                  </div>
                ))}
                {rCons.length < 5 && <button onClick={() => setRCons(a => [...a, ''])} style={{ fontSize:'0.6rem', color:C.acc, background:'none', border:`1px dashed ${C.acc}35`, borderRadius:5, padding:'4px 8px', cursor:'pointer', fontFamily:fs, width:'100%' }}>+ Con</button>}
              </Field>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Install Difficulty">
                <select value={rDiff} onChange={e => setRDiff(Number(e.target.value))} style={{ ...inp, padding:'8px 10px' }}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{DIFFICULTY_LABELS[n]} ({n}/5)</option>)}
                </select>
              </Field>
              <Field label="Would Recommend?">
                <div style={{ display:'flex', gap:6, marginTop:4 }}>
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => setRRec(v)} style={{ flex:1, padding:'8px 6px', borderRadius:8, border:`1px solid ${rRec===v ? (v ? C.g : C.acc) : C.bdr}`, background: rRec===v ? (v ? C.g+'18' : C.acc+'18') : 'transparent', color: rRec===v ? (v ? C.g : C.acc) : C.td, fontSize:'0.72rem', cursor:'pointer', fontFamily:fs, fontWeight: rRec===v ? 700 : 400 }}>
                      {v ? '👍 Yes' : '👎 No'}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </>)}

          {/* ── BOUNTY FORM ── */}
          {type==='bounty' && !success && (<>
            <Field label="What are you looking for?" req>
              <input value={boTitle} onChange={e => setBoTitle(e.target.value)} placeholder="e.g. EK9 OEM helical LSD, any condition" style={inp}/>
            </Field>
            <MakePlat makeVal={boMake} onMake={setBoMake} platVal={boPlat} onPlat={setBoPlat} filteredPlats={platsBounty} makeReq/>
            <Field label="Condition">
              <select value={boCond} onChange={e => setBoCond(e.target.value)} style={{ ...inp, padding:'8px 10px' }}>
                {['any','new','used','oem','aftermarket','junkyard'].map(c => <option key={c} value={c}>{c === 'any' ? 'Any Condition' : c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <Field label="Budget Min ($)">
                <input value={boLo} onChange={e => setBoLo(e.target.value.replace(/\D/g,''))} placeholder="0" style={inp} inputMode="numeric"/>
              </Field>
              <Field label="Budget Max ($)" req>
                <input value={boHi} onChange={e => setBoHi(e.target.value.replace(/\D/g,''))} placeholder="500" style={inp} inputMode="numeric"/>
              </Field>
            </div>
            <Field label="Additional Details">
              <textarea value={boDesc} onChange={e => setBoDesc(e.target.value)} placeholder="Part number, year range, specific condition notes, location preference…" rows={3} style={{ ...inp, resize:'vertical', lineHeight:1.55 }}/>
            </Field>
          </>)}

          {/* ── QUESTION FORM ── */}
          {type==='question' && !success && (<>
            <Field label="Question" req>
              <input value={qTitle} onChange={e => setQTitle(e.target.value)} placeholder="e.g. B18C vs K20 swap for street/track?" style={inp}/>
            </Field>
            <MakePlat makeVal={qMake} onMake={setQMake} platVal={qPlat} onPlat={setQPlat} filteredPlats={platsQuestion}/>
            <Field label="Details" req>
              <textarea value={qBody} onChange={e => setQBody(e.target.value)} placeholder="Explain your situation, what you've already tried, and exactly what help you need…" rows={4} style={{ ...inp, resize:'vertical', lineHeight:1.55 }}/>
            </Field>
            <Field label="Tags (optional — press Enter to add)">
              <div style={{ display:'flex', gap:6, marginBottom: qTags.length ? 8 : 0 }}>
                <input
                  value={qTag}
                  onChange={e => setQTag(e.target.value)}
                  onKeyDown={e => {
                    if ((e.key==='Enter' || e.key===',') && qTag.trim() && qTags.length < 6) {
                      e.preventDefault()
                      setQTags(a => [...a, qTag.trim()])
                      setQTag('')
                    }
                  }}
                  placeholder="e.g. engine-swap, budget-build…"
                  style={{ ...inp, flex:1 }}
                />
                {qTag.trim() && qTags.length < 6 && (
                  <button onClick={() => { setQTags(a => [...a, qTag.trim()]); setQTag('') }} style={{ padding:'0 14px', borderRadius:8, border:'none', background:C.g, color:'#000', fontWeight:700, cursor:'pointer', fontSize:'0.72rem', fontFamily:fs }}>Add</button>
                )}
              </div>
              {qTags.length > 0 && (
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {qTags.map((t, i) => (
                    <span key={i} style={{ fontSize:'0.62rem', padding:'3px 10px', borderRadius:20, background:'#3B82F620', color:'#93C5FD', border:'1px solid #3B82F635', display:'flex', alignItems:'center', gap:5 }}>
                      {t}
                      <button onClick={() => setQTags(a => a.filter((_,j) => j!==i))} style={{ background:'none', border:'none', color:'#93C5FD', cursor:'pointer', padding:0, fontSize:'0.7rem', lineHeight:1 }}>✕</button>
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </>)}

          {/* Error */}
          {error && <div style={{ fontSize:'0.7rem', color:C.acc, background:C.accD, padding:'9px 12px', borderRadius:8, lineHeight:1.4 }}>{error}</div>}

          {/* Footer */}
          {type && !success && (
            <div style={{ display:'flex', gap:8, paddingTop:4 }}>
              <button onClick={() => { setType(null); setError('') }} disabled={submitting} style={{ padding:'10px 16px', borderRadius:8, border:`1px solid ${C.bdr}`, background:'transparent', color:C.tm, fontSize:'0.75rem', cursor:'pointer', fontFamily:fs }}>← Back</button>
              <button
                onClick={submit}
                disabled={submitting}
                style={{ flex:1, padding:'11px', borderRadius:8, border:'none', background: pt?.color || C.acc, color:'#fff', fontSize:'0.82rem', fontWeight:700, cursor: submitting ? 'wait' : 'pointer', fontFamily:fs, opacity: submitting ? 0.65 : 1, transition:'opacity 0.15s' }}
              >
                {submitting ? 'Posting…' : type==='build' ? '🔧 Post Build Update' : type==='review' ? '⭐ Submit Review' : type==='bounty' ? '🎯 Post Bounty' : '❓ Ask Question'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
