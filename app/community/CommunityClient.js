"use client"
import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = 'https://mykvcojasfftliexypnm.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3Zjb2phc2ZmdGxpZXh5cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTA1OTEsImV4cCI6MjA4OTYyNjU5MX0.jDGPr6c0DgmOzqbODnyLpVN7nlpbljk5knvq6cz720I'

const supabase = createClient(SUPA_URL, SUPA_KEY)

const C = { bg:'#08080B', s1:'#12121A', s2:'#1A1A25', bdr:'#2A2A3A', t:'#EEEEF2', tm:'#9999AA', td:'#666677', acc:'#E63946', g:'#2EC4B6', y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const STATUS_CFG = {
  planning:    { label:'Planning',    color:'#B69CF5', bg:'#B69CF515', border:'#B69CF540', emoji:'📐' },
  in_progress: { label:'In Progress', color:C.g,       bg:`${C.g}15`,  border:`${C.g}40`,  emoji:'🔧' },
  completed:   { label:'Completed',   color:C.y,       bg:`${C.y}15`,  border:`${C.y}40`,  emoji:'✅' },
  abandoned:   { label:'Abandoned',   color:C.td,      bg:`${C.bdr}`,  border:C.bdr,       emoji:'💀' },
}

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts)
  const m = Math.floor(diff/60000), h = Math.floor(diff/3600000), d = Math.floor(diff/86400000)
  if (d > 30) return new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
  if (d >= 1) return `${d}d ago`
  if (h >= 1) return `${h}h ago`
  if (m >= 1) return `${m}m ago`
  return 'just now'
}

function Avatar({ name, tier, size=28 }) {
  const tierColor = tier==='pro' ? C.y : tier==='member' ? C.g : C.td
  return (
    <div style={{
      width:size,height:size,borderRadius:'50%',flexShrink:0,
      background:`${tierColor}20`,border:`1.5px solid ${tierColor}40`,
      display:'flex',alignItems:'center',justifyContent:'center',
      fontSize:size*0.4+'px',color:tierColor,fontFamily:fm,fontWeight:700,
    }}>
      {(name||'?')[0].toUpperCase()}
    </div>
  )
}

function AuthorLine({ author, createdAt, small }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:6}}>
      <Avatar name={author?.username||author?.display_name} tier={author?.subscription_tier} size={small?20:24}/>
      <div>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          <span style={{fontSize:small?'0.55rem':'0.62rem',fontWeight:600,color:C.tm}}>
            {author?.username || author?.display_name || 'Anonymous'}
          </span>
          {author?.is_verified_seller && (
            <span style={{fontSize:'0.45rem',color:C.y,fontFamily:fm}}>✓ Pro</span>
          )}
          {author?.subscription_tier==='member' && !author?.is_verified_seller && (
            <span style={{fontSize:'0.45rem',color:C.g,fontFamily:fm}}>Member</span>
          )}
        </div>
        {(author?.location_city||author?.location_state) && (
          <div style={{fontSize:'0.45rem',color:C.td}}>
            📍 {[author.location_city,author.location_state].filter(Boolean).join(', ')}
          </div>
        )}
      </div>
      {createdAt && <span style={{fontSize:'0.5rem',color:C.td,marginLeft:4}}>{timeAgo(createdAt)}</span>}
    </div>
  )
}

function ThreadCard({ thread, onOpen, liked, onLike }) {
  const st = STATUS_CFG[thread.status] || STATUS_CFG.in_progress
  const hasImages = thread.images?.length > 0

  return (
    <div
      onClick={() => onOpen(thread)}
      style={{
        background:C.s1, borderRadius:14, border:`1px solid ${thread.is_featured ? C.g+'50' : C.bdr}`,
        overflow:'hidden', display:'flex', flexDirection:'column', cursor:'pointer', transition:'border-color 0.15s, transform 0.1s',
      }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.g+'60';e.currentTarget.style.transform='translateY(-1px)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=thread.is_featured?C.g+'50':C.bdr;e.currentTarget.style.transform='none'}}
    >
      {/* top bar */}
      <div style={{height:2,background:thread.is_featured
        ?`linear-gradient(90deg,${C.g},${C.y},transparent)`
        :`linear-gradient(90deg,${st.color}60,transparent)`
      }}/>

      {/* first image preview if any */}
      {hasImages && (
        <div style={{height:120,overflow:'hidden',background:C.s2,position:'relative'}}>
          <img src={thread.images[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>e.target.style.display='none'}/>
          {thread.images.length > 1 && (
            <div style={{position:'absolute',bottom:6,right:6,fontSize:'0.48rem',fontWeight:700,padding:'2px 7px',borderRadius:8,background:'rgba(0,0,0,0.75)',color:C.tm,fontFamily:fm}}>
              +{thread.images.length-1} more
            </div>
          )}
          {thread.is_featured && (
            <div style={{position:'absolute',top:6,left:6,fontSize:'0.48rem',fontWeight:800,padding:'2px 8px',borderRadius:8,background:`${C.g}`,color:'#08080B',fontFamily:fm,letterSpacing:'0.06em'}}>
              FEATURED
            </div>
          )}
        </div>
      )}

      <div style={{padding:'0.9rem',flex:1,display:'flex',flexDirection:'column',gap:'0.6rem'}}>
        {/* featured badge (no image) */}
        {thread.is_featured && !hasImages && (
          <div style={{display:'inline-block',fontSize:'0.48rem',fontWeight:800,padding:'2px 8px',borderRadius:8,background:`${C.g}20`,color:C.g,fontFamily:fm,letterSpacing:'0.06em',border:`1px solid ${C.g}40`,alignSelf:'flex-start'}}>
            ★ FEATURED
          </div>
        )}

        {/* title row */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
          <h3 style={{fontSize:'0.88rem',fontWeight:800,color:C.t,lineHeight:1.25,margin:0,flex:1}}>{thread.title}</h3>
          <span style={{flexShrink:0,fontSize:'0.52rem',fontWeight:700,padding:'3px 8px',borderRadius:10,background:st.bg,color:st.color,fontFamily:fm,border:`1px solid ${st.border}`,whiteSpace:'nowrap'}}>
            {st.emoji} {st.label}
          </span>
        </div>

        {/* platform/make */}
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {thread.platform_id && (
            <span style={{fontSize:'0.5rem',fontWeight:700,padding:'2px 7px',borderRadius:8,background:`${C.g}12`,color:C.g,fontFamily:fm,border:`1px solid ${C.g}25`}}>
              {thread.platform_id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
            </span>
          )}
          {thread.make_id && !thread.platform_id && (
            <span style={{fontSize:'0.5rem',fontWeight:700,padding:'2px 7px',borderRadius:8,background:`${C.tm}10`,color:C.tm,fontFamily:fm,border:`1px solid ${C.bdr}`}}>
              {thread.make_id.toUpperCase()}
            </span>
          )}
          {thread.tags?.slice(0,2).map(tag=>(
            <span key={tag} style={{fontSize:'0.48rem',padding:'2px 6px',borderRadius:8,background:C.s2,color:C.td,border:`1px solid ${C.bdr}`}}>#{tag}</span>
          ))}
        </div>

        {/* description preview */}
        {thread.description && (
          <p style={{fontSize:'0.65rem',color:C.tm,lineHeight:1.55,margin:0,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
            {thread.description}
          </p>
        )}

        {/* footer */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'auto',paddingTop:'0.4rem',borderTop:`1px solid ${C.bdr}`}}>
          <AuthorLine author={thread.author} createdAt={thread.created_at} small/>
          <div style={{display:'flex',gap:10,alignItems:'center',flexShrink:0}}>
            <button
              onClick={e=>{e.stopPropagation();onLike(thread.id)}}
              style={{display:'flex',alignItems:'center',gap:3,background:'none',border:'none',cursor:'pointer',padding:'3px 6px',borderRadius:6,color:liked?C.acc:C.td,transition:'color 0.15s'}}
            >
              <span style={{fontSize:'0.7rem'}}>{liked?'♥':'♡'}</span>
              <span style={{fontSize:'0.55rem',fontFamily:fm,fontWeight:700}}>{thread.like_count||0}</span>
            </button>
            <div style={{display:'flex',alignItems:'center',gap:3,color:C.td}}>
              <span style={{fontSize:'0.7rem'}}>💬</span>
              <span style={{fontSize:'0.55rem',fontFamily:fm,fontWeight:700}}>{thread.reply_count||0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThreadModal({ thread, user, profile, onClose, onLike, liked }) {
  const [replies, setReplies] = useState([])
  const [loadingReplies, setLoadingReplies] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localLikeCount, setLocalLikeCount] = useState(thread.like_count||0)
  const [localLiked, setLocalLiked] = useState(liked)
  const st = STATUS_CFG[thread.status] || STATUS_CFG.in_progress
  const canReply = profile?.subscription_tier === 'member' || profile?.subscription_tier === 'pro'

  useEffect(() => {
    supabase
      .from('thread_replies')
      .select('*, author:profiles!user_id(username, display_name, location_city, location_state, is_verified_seller, subscription_tier)')
      .eq('thread_id', thread.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => { setReplies(data||[]); setLoadingReplies(false) })
  }, [thread.id])

  async function handleLike() {
    if (!user) { window.location.href='/?auth=signin'; return }
    const { data: { session } } = await supabase.auth.getSession()
    const client = session
      ? createClient(SUPA_URL, SUPA_KEY, { global: { headers: { Authorization: `Bearer ${session.access_token}` } } })
      : supabase
    if (localLiked) {
      setLocalLiked(false); setLocalLikeCount(c=>c-1)
      await client.from('thread_likes').delete().eq('thread_id', thread.id).eq('user_id', user.id)
    } else {
      setLocalLiked(true); setLocalLikeCount(c=>c+1)
      await client.from('thread_likes').insert({ thread_id: thread.id, user_id: user.id })
    }
    onLike(thread.id)
  }

  async function handleReply(e) {
    e.preventDefault()
    if (!replyText.trim()) return
    setSubmitting(true)
    const { data: { session } } = await supabase.auth.getSession()
    const client = session
      ? createClient(SUPA_URL, SUPA_KEY, { global: { headers: { Authorization: `Bearer ${session.access_token}` } } })
      : supabase
    const { data, error } = await client.from('thread_replies').insert({
      thread_id: thread.id,
      user_id: user.id,
      content: replyText.trim(),
    }).select('*, author:profiles!user_id(username, display_name, location_city, location_state, is_verified_seller, subscription_tier)').single()
    setSubmitting(false)
    if (!error && data) {
      setReplies(r => [...r, data])
      setReplyText('')
    }
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'flex-start',justifyContent:'center',zIndex:200,padding:'1rem',overflowY:'auto'}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:C.s1,borderRadius:16,border:`1px solid ${C.bdr}`,width:'100%',maxWidth:680,marginTop:'2rem',marginBottom:'2rem'}}>

        {/* header */}
        <div style={{padding:'1.25rem 1.5rem',borderBottom:`1px solid ${C.bdr}`,display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:'0.5rem'}}>
              <span style={{fontSize:'0.52rem',fontWeight:700,padding:'3px 8px',borderRadius:10,background:st.bg,color:st.color,fontFamily:fm,border:`1px solid ${st.border}`}}>
                {st.emoji} {st.label}
              </span>
              {thread.platform_id && (
                <span style={{fontSize:'0.52rem',fontWeight:700,padding:'3px 8px',borderRadius:10,background:`${C.g}12`,color:C.g,fontFamily:fm,border:`1px solid ${C.g}25`}}>
                  {thread.platform_id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
                </span>
              )}
              {thread.is_featured && (
                <span style={{fontSize:'0.52rem',fontWeight:800,padding:'3px 8px',borderRadius:10,background:`${C.g}20`,color:C.g,fontFamily:fm,border:`1px solid ${C.g}40`}}>★ Featured</span>
              )}
            </div>
            <h2 style={{fontSize:'1.1rem',fontWeight:900,color:C.t,margin:0,lineHeight:1.2}}>{thread.title}</h2>
          </div>
          <button onClick={onClose} style={{background:'transparent',border:'none',color:C.td,cursor:'pointer',fontSize:'1.2rem',lineHeight:1,padding:4,flexShrink:0}}>✕</button>
        </div>

        <div style={{padding:'1.25rem 1.5rem',display:'flex',flexDirection:'column',gap:'1.25rem'}}>

          {/* author */}
          <AuthorLine author={thread.author} createdAt={thread.created_at}/>

          {/* images */}
          {thread.images?.length > 0 && (
            <div style={{display:'flex',gap:8,overflowX:'auto',paddingBottom:4}}>
              {thread.images.map((img,i)=>(
                <img key={i} src={img} alt="" style={{height:160,width:'auto',borderRadius:8,border:`1px solid ${C.bdr}`,flexShrink:0,maxWidth:260,objectFit:'cover'}} onError={e=>e.target.style.display='none'}/>
              ))}
            </div>
          )}

          {/* description */}
          {thread.description && (
            <p style={{fontSize:'0.75rem',color:C.tm,lineHeight:1.7,margin:0,whiteSpace:'pre-wrap'}}>{thread.description}</p>
          )}

          {/* tags */}
          {thread.tags?.length > 0 && (
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {thread.tags.map(tag=>(
                <span key={tag} style={{fontSize:'0.52rem',padding:'3px 8px',borderRadius:8,background:C.s2,color:C.td,border:`1px solid ${C.bdr}`}}>#{tag}</span>
              ))}
            </div>
          )}

          {/* like + stats bar */}
          <div style={{display:'flex',gap:16,alignItems:'center',padding:'0.75rem 1rem',background:C.s2,borderRadius:10,border:`1px solid ${C.bdr}`}}>
            <button onClick={handleLike} style={{
              display:'flex',alignItems:'center',gap:5,background:'none',border:`1px solid ${localLiked?C.acc:C.bdr}`,
              borderRadius:8,cursor:'pointer',padding:'5px 12px',color:localLiked?C.acc:C.tm,
              fontSize:'0.68rem',fontFamily:fs,fontWeight:localLiked?700:400,transition:'all 0.15s',
            }}>
              <span>{localLiked?'♥':'♡'}</span>
              <span>{localLikeCount} {localLikeCount===1?'like':'likes'}</span>
            </button>
            <div style={{display:'flex',alignItems:'center',gap:5,color:C.td,fontSize:'0.65rem'}}>
              <span>💬</span>
              <span>{replies.length||thread.reply_count||0} {(replies.length||thread.reply_count||0)===1?'reply':'replies'}</span>
            </div>
            {thread.view_count > 0 && (
              <div style={{display:'flex',alignItems:'center',gap:5,color:C.td,fontSize:'0.65rem'}}>
                <span>👁</span>
                <span>{thread.view_count} views</span>
              </div>
            )}
          </div>

          {/* replies */}
          <div>
            <div style={{fontSize:'0.6rem',fontWeight:700,color:C.td,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>
              Replies {replies.length > 0 && `(${replies.length})`}
            </div>
            {loadingReplies ? (
              <div style={{textAlign:'center',padding:'2rem',color:C.td,fontSize:'0.7rem'}}>Loading replies…</div>
            ) : replies.length === 0 ? (
              <div style={{textAlign:'center',padding:'1.5rem',color:C.td,fontSize:'0.7rem',background:C.s2,borderRadius:10,border:`1px dashed ${C.bdr}`}}>
                No replies yet. Be the first to respond.
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {replies.map(reply=>(
                  <div key={reply.id} style={{padding:'0.75rem 1rem',background:C.s2,borderRadius:10,border:`1px solid ${C.bdr}`}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.5rem'}}>
                      <AuthorLine author={reply.author} createdAt={reply.created_at} small/>
                      {reply.like_count > 0 && (
                        <span style={{fontSize:'0.52rem',color:C.td}}>♥ {reply.like_count}</span>
                      )}
                    </div>
                    <p style={{fontSize:'0.7rem',color:C.t,lineHeight:1.6,margin:0,whiteSpace:'pre-wrap'}}>{reply.content}</p>
                    {reply.images?.length > 0 && (
                      <div style={{display:'flex',gap:6,marginTop:8,overflowX:'auto'}}>
                        {reply.images.map((img,i)=>(
                          <img key={i} src={img} alt="" style={{height:80,borderRadius:6,border:`1px solid ${C.bdr}`}} onError={e=>e.target.style.display='none'}/>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* reply form */}
          {user && canReply ? (
            <form onSubmit={handleReply} style={{display:'flex',flexDirection:'column',gap:8}}>
              <textarea
                value={replyText}
                onChange={e=>setReplyText(e.target.value)}
                placeholder="Add a reply…"
                rows={3}
                style={{width:'100%',padding:'10px 12px',borderRadius:10,border:`1px solid ${C.bdr}`,background:C.s2,color:C.t,fontSize:'0.75rem',fontFamily:fs,outline:'none',resize:'vertical',lineHeight:1.5,boxSizing:'border-box'}}
              />
              <div style={{display:'flex',justifyContent:'flex-end'}}>
                <button type="submit" disabled={submitting||!replyText.trim()} style={{
                  padding:'7px 20px',borderRadius:8,border:'none',background:C.g,color:'#08080B',
                  fontWeight:700,fontSize:'0.72rem',cursor:submitting?'wait':'pointer',fontFamily:fs,
                  opacity:(submitting||!replyText.trim())?0.5:1,
                }}>
                  {submitting?'Posting…':'Post Reply'}
                </button>
              </div>
            </form>
          ) : user && !canReply ? (
            <div style={{textAlign:'center',padding:'1rem',background:`${C.g}08`,border:`1px solid ${C.g}20`,borderRadius:10,fontSize:'0.65rem',color:C.tm}}>
              <a href="/pricing" style={{color:C.g,fontWeight:700,textDecoration:'none'}}>Upgrade to Member</a> to post replies.
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'1rem',background:C.s2,border:`1px solid ${C.bdr}`,borderRadius:10,fontSize:'0.65rem',color:C.td}}>
              <a href="/?auth=signin" style={{color:C.g,fontWeight:700,textDecoration:'none'}}>Sign in</a> to reply.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NewThreadModal({ user, profile, onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [platformId, setPlatformId] = useState('')
  const [makeId, setMakeId] = useState('')
  const [status, setStatus] = useState('in_progress')
  const [imageUrls, setImageUrls] = useState('')
  const [tags, setTags] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required.'); return }
    if (!description.trim()) { setError('Description is required.'); return }
    setSubmitting(true); setError(null)

    const images = imageUrls.split('\n').map(s=>s.trim()).filter(Boolean)
    const tagArr = tags.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean)

    const { data: { session } } = await supabase.auth.getSession()
    const client = session
      ? createClient(SUPA_URL, SUPA_KEY, { global: { headers: { Authorization: `Bearer ${session.access_token}` } } })
      : supabase

    const { data, error: insertError } = await client.from('build_threads').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      platform_id: platformId.trim().toLowerCase().replace(/\s+/g,'_') || null,
      make_id: makeId.trim().toLowerCase() || null,
      status,
      images,
      tags: tagArr,
    }).select('*, author:profiles!user_id(username, display_name, location_city, location_state, is_verified_seller, reputation, completed_bounties, subscription_tier)').single()

    setSubmitting(false)
    if (insertError) { setError(insertError.message || 'Failed to create thread.') }
    else { onCreated(data) }
  }

  const inputStyle = {
    width:'100%',padding:'8px 12px',borderRadius:8,border:`1px solid ${C.bdr}`,
    background:C.s2,color:C.t,fontSize:'0.75rem',fontFamily:fs,outline:'none',boxSizing:'border-box',
  }
  const labelStyle = { fontSize:'0.6rem',color:C.td,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:4 }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem'}}>
      <div style={{background:C.s1,borderRadius:16,border:`1px solid ${C.bdr}`,width:'100%',maxWidth:560,maxHeight:'92vh',overflowY:'auto'}}>
        <div style={{padding:'1.25rem 1.5rem',borderBottom:`1px solid ${C.bdr}`,display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:C.s1,zIndex:1}}>
          <div>
            <div style={{fontSize:'0.55rem',fontWeight:700,color:C.g,fontFamily:fm,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:2}}>New Thread</div>
            <div style={{fontSize:'1rem',fontWeight:900,color:C.t}}>Start a Build Thread</div>
          </div>
          <button onClick={onClose} style={{background:'transparent',border:'none',color:C.td,cursor:'pointer',fontSize:'1.2rem',lineHeight:1,padding:4}}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div>
            <label style={labelStyle}>Thread Title *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Full K-swap on my 2002 EG Civic — build log" style={inputStyle} maxLength={120}/>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div>
              <label style={labelStyle}>Platform (optional)</label>
              <input value={platformId} onChange={e=>setPlatformId(e.target.value)} placeholder="e.g. eg_civic" style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Make (optional)</label>
              <input value={makeId} onChange={e=>setMakeId(e.target.value)} placeholder="e.g. honda" style={inputStyle}/>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Build Status</label>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {Object.entries(STATUS_CFG).filter(([k])=>k!=='abandoned').map(([key,cfg])=>(
                <button key={key} type="button" onClick={()=>setStatus(key)} style={{
                  padding:'5px 12px',borderRadius:20,fontSize:'0.62rem',cursor:'pointer',fontFamily:fs,fontWeight:status===key?700:400,
                  border:`1px solid ${status===key?cfg.color:C.bdr}`,
                  background:status===key?cfg.bg:'transparent',
                  color:status===key?cfg.color:C.tm,transition:'all 0.15s',
                }}>
                  {cfg.emoji} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description *</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)}
              placeholder="Describe your build — what you're doing, why, what parts you're using, progress so far..."
              rows={5} style={{...inputStyle,resize:'vertical',lineHeight:1.55}}
            />
          </div>

          <div>
            <label style={labelStyle}>Image URLs (one per line, optional)</label>
            <textarea value={imageUrls} onChange={e=>setImageUrls(e.target.value)}
              placeholder={"https://i.imgur.com/your-image.jpg\nhttps://..."}
              rows={3} style={{...inputStyle,resize:'vertical',lineHeight:1.55,fontFamily:fm,fontSize:'0.65rem'}}
            />
          </div>

          <div>
            <label style={labelStyle}>Tags (comma separated, optional)</label>
            <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="k-swap, turbo, budget build, daily driver" style={inputStyle}/>
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
              {submitting?'Posting…':'Post Thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CommunityClient({ initialThreads }) {
  const [threads, setThreads] = useState(initialThreads)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [openThread, setOpenThread] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [likedIds, setLikedIds] = useState(new Set())
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const [{ data: prof }, { data: likes }] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', session.user.id).single(),
          supabase.from('thread_likes').select('thread_id').eq('user_id', session.user.id).not('thread_id','is',null),
        ])
        setProfile(prof)
        if (likes) setLikedIds(new Set(likes.map(l=>l.thread_id)))
      }
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user||null)
      if (session?.user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(prof)
      } else { setProfile(null) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const canPost = profile?.subscription_tier === 'member' || profile?.subscription_tier === 'pro'

  function handleLike(threadId) {
    setLikedIds(prev => {
      const next = new Set(prev)
      if (next.has(threadId)) next.delete(threadId)
      else next.add(threadId)
      return next
    })
    setThreads(ts => ts.map(t =>
      t.id === threadId
        ? { ...t, like_count: likedIds.has(threadId) ? (t.like_count||1)-1 : (t.like_count||0)+1 }
        : t
    ))
  }

  function handleNewThread() {
    if (!user) { window.location.href='/?auth=signin'; return }
    if (!canPost) { window.location.href='/pricing'; return }
    setShowNewModal(true)
  }

  const filtered = useMemo(() => {
    let list = threads
    if (statusFilter !== 'all') list = list.filter(t => t.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description||'').toLowerCase().includes(q) ||
        (t.platform_id||'').toLowerCase().includes(q) ||
        (t.make_id||'').toLowerCase().includes(q) ||
        (t.tags||[]).some(tag=>tag.includes(q))
      )
    }
    if (sort === 'newest') list = [...list].sort((a,b) => new Date(b.created_at)-new Date(a.created_at))
    if (sort === 'replies') list = [...list].sort((a,b) => (b.reply_count||0)-(a.reply_count||0))
    if (sort === 'likes') list = [...list].sort((a,b) => (b.like_count||0)-(a.like_count||0))
    if (sort === 'featured') list = [...list].sort((a,b) => (b.is_featured?1:0)-(a.is_featured?1:0))
    return list
  }, [threads, statusFilter, search, sort])

  const statusCounts = useMemo(() => {
    const c = { all: threads.length }
    threads.forEach(t => { c[t.status]=(c[t.status]||0)+1 })
    return c
  }, [threads])

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
            <span style={{fontSize:'0.6rem',color:C.acc,fontWeight:600}}>Community</span>
          </div>
        </div>
      </header>

      <div style={{maxWidth:960,margin:'0 auto',padding:'2rem 1rem 5rem'}}>

        {/* Hero */}
        <div style={{marginBottom:'2rem',borderRadius:16,overflow:'hidden',border:`1px solid ${C.g}20`,position:'relative',background:'#07070D',padding:'2rem'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 80% at 10% 50%,rgba(46,196,182,0.1) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 90% 20%,rgba(182,156,245,0.06) 0%,transparent 55%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1,display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1.5rem'}}>
            <div>
              <div style={{display:'inline-block',padding:'3px 12px',borderRadius:20,background:`${C.g}15`,border:`1px solid ${C.g}30`,fontSize:'0.55rem',color:C.g,fontFamily:fm,fontWeight:700,letterSpacing:'0.12em',marginBottom:'0.75rem',textTransform:'uppercase'}}>
                Build Threads
              </div>
              <h1 style={{fontSize:'clamp(1.5rem,4vw,2.2rem)',fontWeight:900,marginBottom:'0.5rem',letterSpacing:'-0.03em',lineHeight:1.1}}>
                Community
              </h1>
              <p style={{fontSize:'0.78rem',color:C.tm,maxWidth:440,lineHeight:1.6,marginBottom:'1.25rem'}}>
                Build logs, swap threads, mod journals. Document your build and connect with builders who've been there.
              </p>
              <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
                {[
                  {v:threads.length, l:'Threads', c:C.g},
                  {v:threads.reduce((s,t)=>s+(t.reply_count||0),0), l:'Replies', c:'#B69CF5'},
                  {v:threads.reduce((s,t)=>s+(t.like_count||0),0), l:'Likes', c:C.acc},
                  {v:threads.filter(t=>t.is_featured).length||undefined, l:'Featured', c:C.y, hide: !threads.some(t=>t.is_featured)},
                ].filter(s=>!s.hide).map(s=>(
                  <div key={s.l}>
                    <div style={{fontSize:'1.5rem',fontWeight:900,color:s.c,fontFamily:fm,lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:'0.48rem',color:C.td,marginTop:2}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
              <button
                onClick={handleNewThread}
                style={{
                  padding:'10px 22px',borderRadius:10,
                  border:`1px solid ${C.g}`,
                  background:!authLoading&&canPost?C.g:'transparent',
                  color:!authLoading&&canPost?'#08080B':C.g,
                  fontWeight:700,fontSize:'0.8rem',cursor:'pointer',fontFamily:fs,whiteSpace:'nowrap',
                }}
              >
                + New Thread
              </button>
              {!authLoading && !user && (
                <div style={{fontSize:'0.52rem',color:C.td,textAlign:'right',maxWidth:160}}>Sign in to post a thread</div>
              )}
              {!authLoading && user && !canPost && (
                <div style={{fontSize:'0.52rem',color:C.td,textAlign:'right',maxWidth:160}}>
                  <a href="/pricing" style={{color:C.g,textDecoration:'none'}}>Upgrade to Member</a> to post
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1rem',alignItems:'center'}}>
          {[
            {key:'all',label:`All (${statusCounts.all})`,color:C.tm},
            ...Object.entries(STATUS_CFG).map(([k,v])=>({key:k,label:`${v.emoji} ${v.label} (${statusCounts[k]||0})`,color:v.color}))
          ].map(f=>(
            <button key={f.key} onClick={()=>setStatusFilter(f.key)} style={{
              padding:'5px 12px',borderRadius:20,border:`1px solid ${statusFilter===f.key?f.color:C.bdr}`,
              background:statusFilter===f.key?`${f.color}15`:'transparent',
              color:statusFilter===f.key?f.color:C.tm,
              fontSize:'0.62rem',cursor:'pointer',fontFamily:fs,fontWeight:statusFilter===f.key?700:400,transition:'all 0.15s',
            }}>
              {f.label}
            </button>
          ))}
          <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{
              padding:'5px 10px',borderRadius:20,border:`1px solid ${C.bdr}`,background:C.s1,
              color:C.tm,fontSize:'0.62rem',fontFamily:fs,outline:'none',cursor:'pointer',
            }}>
              <option value="newest">Newest first</option>
              <option value="replies">Most replies</option>
              <option value="likes">Most liked</option>
              <option value="featured">Featured first</option>
            </select>
            <input
              type="text"
              placeholder="Search threads…"
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
          <div style={{columns:'repeat(auto-fill,minmax(290px,1fr))',columnGap:14,rowGap:14,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))'}}>
            {filtered.map(t=>(
              <ThreadCard
                key={t.id}
                thread={t}
                onOpen={setOpenThread}
                liked={likedIds.has(t.id)}
                onLike={handleLike}
              />
            ))}
          </div>
        ) : (
          <div style={{textAlign:'center',padding:'5rem 2rem',color:C.td}}>
            {threads.length === 0 ? (
              <>
                <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🔧</div>
                <div style={{fontSize:'1rem',fontWeight:800,color:C.tm,marginBottom:'0.5rem'}}>No threads yet.</div>
                <div style={{fontSize:'0.72rem',color:C.td,marginBottom:'1.5rem',maxWidth:360,margin:'0 auto 1.5rem'}}>
                  Be the first to document your build. The community starts with one thread.
                </div>
                <button onClick={handleNewThread} style={{padding:'10px 28px',borderRadius:8,border:'none',background:C.g,color:'#08080B',fontWeight:700,fontSize:'0.8rem',cursor:'pointer',fontFamily:fs}}>
                  Start the First Thread →
                </button>
              </>
            ) : (
              <>
                <div style={{fontSize:'1.5rem',marginBottom:'0.75rem'}}>🔍</div>
                <div style={{fontSize:'0.8rem'}}>No threads match that filter.</div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{marginTop:'3rem',textAlign:'center',padding:'2rem',borderTop:`1px solid ${C.bdr}`}}>
          <p style={{fontSize:'0.72rem',color:C.td,marginBottom:'0.75rem'}}>
            Community features require a Member account.
          </p>
          <a href="/pricing" style={{display:'inline-block',padding:'10px 28px',borderRadius:8,background:C.g,color:'#08080B',textDecoration:'none',fontWeight:700,fontSize:'0.82rem'}}>
            Join the Community →
          </a>
        </div>
      </div>

      {/* Thread detail modal */}
      {openThread && (
        <ThreadModal
          thread={openThread}
          user={user}
          profile={profile}
          onClose={()=>setOpenThread(null)}
          liked={likedIds.has(openThread.id)}
          onLike={handleLike}
        />
      )}

      {/* New thread modal */}
      {showNewModal && (
        <NewThreadModal
          user={user}
          profile={profile}
          onClose={()=>setShowNewModal(false)}
          onCreated={thread=>{
            setThreads(ts=>[thread,...ts])
            setShowNewModal(false)
          }}
        />
      )}
    </div>
  )
}
