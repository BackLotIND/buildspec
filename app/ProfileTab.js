"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'

const C = { bg:'#08080B',s1:'#12121A',s2:'#1A1A25',bdr:'#2A2A3A',t:'#EEEEF2',tm:'#9999AA',td:'#666677',acc:'#E63946',accD:'#E6394620',g:'#2EC4B6',y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const SKILL_CFG = {
  beginner:     { label:'Beginner',     color:'#6B7280', bg:'#6B728018', border:'#6B728040', icon:'🔰' },
  intermediate: { label:'Intermediate', color:'#3B82F6', bg:'#3B82F618', border:'#3B82F640', icon:'🔧' },
  advanced:     { label:'Advanced',     color:'#8B5CF6', bg:'#8B5CF618', border:'#8B5CF640', icon:'⚡' },
  shop_tech:    { label:'Shop Tech',    color:'#F97316', bg:'#F9731618', border:'#F9731640', icon:'🛠️' },
  builder:      { label:'Builder',      color:'#FFB703', bg:'#FFB70318', border:'#FFB70340', icon:'🏆' },
  diy:          { label:'DIY',          color:'#3B82F6', bg:'#3B82F618', border:'#3B82F640', icon:'🔧' },
  enthusiast:   { label:'Enthusiast',   color:'#2EC4B6', bg:'#2EC4B618', border:'#2EC4B640', icon:'⚡' },
  experienced:  { label:'Experienced',  color:'#8B5CF6', bg:'#8B5CF618', border:'#8B5CF640', icon:'🏎️' },
  professional: { label:'Professional', color:'#FFB703', bg:'#FFB70318', border:'#FFB70340', icon:'🏆' },
}

const TIER_CFG = {
  free:   { label:'Free',   color:'#6B7280', bg:'#6B728018', border:'#6B728040', icon:'' },
  member: { label:'Member', color:'#2EC4B6', bg:'#2EC4B618', border:'#2EC4B640', icon:'🟢' },
  pro:    { label:'Pro',    color:'#FFB703', bg:'#FFB70318', border:'#FFB70340', icon:'⚡' },
}

function fmtPlatId(id) {
  return id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
}

function reputationTitle(rep) {
  if (!rep || rep < 10)  return { label:'Newcomer',    color:C.td }
  if (rep < 50)          return { label:'Regular',     color:C.tm }
  if (rep < 150)         return { label:'Contributor', color:'#3B82F6' }
  if (rep < 400)         return { label:'Respected',   color:C.g }
  if (rep < 1000)        return { label:'Expert',      color:'#8B5CF6' }
  return                        { label:'Legend',      color:C.y }
}

function timeAgo(d) {
  const s = Math.floor((Date.now()-new Date(d))/1000)
  if (s<60) return `${s}s`
  if (s<3600) return `${Math.floor(s/60)}m`
  if (s<86400) return `${Math.floor(s/3600)}h`
  return `${Math.floor(s/86400)}d`
}

function Avatar({ profile, size=72 }) {
  const name = profile?.display_name || profile?.username || '?'
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', flexShrink:0,
      background: profile?.avatar_url ? 'transparent' : `linear-gradient(135deg,${C.acc},${C.g})`,
      border:`2px solid ${C.bdr}`, overflow:'hidden',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {profile?.avatar_url
        ? <img src={profile.avatar_url} alt={name} width={size} height={size} style={{objectFit:'cover',width:'100%',height:'100%'}}/>
        : <span style={{fontSize:size*0.4+'px',fontWeight:900,color:'#fff',fontFamily:fm}}>{name[0].toUpperCase()}</span>
      }
    </div>
  )
}

function EditProfilePanel({ profile, onSave, onCancel }) {
  const { updateProfile } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [city, setCity] = useState(profile?.location_city || '')
  const [state, setState] = useState(profile?.location_state || '')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const inp = { width:'100%', padding:'9px 12px', borderRadius:8, border:`1px solid ${C.bdr}`, background:C.s2, color:C.t, fontSize:'0.75rem', fontFamily:fs, outline:'none', boxSizing:'border-box' }

  async function save() {
    setSaving(true); setErr('')
    const { error } = await updateProfile({ display_name: displayName, bio, location_city: city, location_state: state })
    setSaving(false)
    if (error) { setErr(error.message); return }
    onSave()
  }

  return (
    <div style={{background:C.s1,borderRadius:16,border:`1px solid ${C.bdr}`,padding:'1.25rem',marginBottom:'1rem'}}>
      <div style={{fontSize:'0.7rem',fontWeight:700,color:C.td,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'1rem',fontFamily:fm}}>Edit Profile</div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div>
          <label style={{fontSize:'0.6rem',color:C.td,display:'block',marginBottom:4}}>Display Name</label>
          <input value={displayName} onChange={e=>setDisplayName(e.target.value)} style={inp} placeholder="Your name"/>
        </div>
        <div>
          <label style={{fontSize:'0.6rem',color:C.td,display:'block',marginBottom:4}}>Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} style={{...inp,resize:'vertical'}} placeholder="Tell the community about your builds…"/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <div>
            <label style={{fontSize:'0.6rem',color:C.td,display:'block',marginBottom:4}}>City</label>
            <input value={city} onChange={e=>setCity(e.target.value)} style={inp} placeholder="City"/>
          </div>
          <div>
            <label style={{fontSize:'0.6rem',color:C.td,display:'block',marginBottom:4}}>State</label>
            <input value={state} onChange={e=>setState(e.target.value)} style={inp} placeholder="State"/>
          </div>
        </div>
        {err && <div style={{fontSize:'0.65rem',color:C.acc}}>{err}</div>}
        <div style={{display:'flex',gap:8}}>
          <button onClick={save} disabled={saving} style={{flex:1,padding:'9px',borderRadius:8,border:'none',background:C.acc,color:'#fff',fontSize:'0.72rem',fontWeight:700,cursor:'pointer',opacity:saving?0.6:1}}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={onCancel} style={{flex:1,padding:'9px',borderRadius:8,border:`1px solid ${C.bdr}`,background:'transparent',color:C.tm,fontSize:'0.72rem',cursor:'pointer'}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function SettingsMenu({ onClose, onSignOut }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:500,display:'flex',alignItems:'flex-end'}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{width:'100%',background:C.s1,borderTop:`1px solid ${C.bdr}`,borderRadius:'20px 20px 0 0',padding:'1rem',paddingBottom:'calc(1rem + env(safe-area-inset-bottom))'}}>
        <div style={{width:36,height:4,borderRadius:2,background:C.bdr,margin:'0 auto 1rem'}}/>
        <div style={{fontSize:'0.62rem',color:C.td,fontFamily:fm,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem',paddingLeft:4}}>Settings</div>
        {[
          { label:'View Public Profile', icon:'👤', action:null, href:true },
          { label:'Sign Out', icon:'🚪', action:onSignOut, color:C.acc },
        ].map(item=>(
          item.href
          ? <a key={item.label} href={`/user/${item.username}`} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 12px',borderRadius:10,textDecoration:'none',color:C.t,marginBottom:4,background:'transparent'}} onClick={onClose}>
              <span style={{fontSize:'1.1rem'}}>{item.icon}</span>
              <span style={{fontSize:'0.78rem',fontWeight:500}}>{item.label}</span>
            </a>
          : <button key={item.label} onClick={()=>{item.action && item.action(); onClose()}} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 12px',borderRadius:10,border:'none',background:'transparent',color:item.color||C.t,cursor:'pointer',fontFamily:fs,width:'100%',marginBottom:4}}>
              <span style={{fontSize:'1.1rem'}}>{item.icon}</span>
              <span style={{fontSize:'0.78rem',fontWeight:500}}>{item.label}</span>
            </button>
        ))}
      </div>
    </div>
  )
}

export default function ProfileTab({ onClose, onShowAuth }) {
  const { user, profile, signOut } = useAuth()
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    setPostsLoading(true)
    import('@/lib/supabase').then(({ supabase }) => {
      Promise.all([
        supabase.from('build_threads').select('id,title,created_at').eq('user_id', user.id).order('created_at',{ascending:false}).limit(5),
        supabase.from('part_reviews').select('id,part_name,rating,created_at').eq('user_id', user.id).order('created_at',{ascending:false}).limit(5),
        supabase.from('bounties').select('id,title,status,created_at').eq('poster_id', user.id).order('created_at',{ascending:false}).limit(5),
      ]).then(([{data:threads},{data:reviews},{data:bounties}]) => {
        const merged = [
          ...(threads||[]).map(x=>({...x,_type:'thread'})),
          ...(reviews||[]).map(x=>({...x,_type:'review'})),
          ...(bounties||[]).map(x=>({...x,_type:'bounty'})),
        ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,8)
        setPosts(merged)
        setPostsLoading(false)
      }).catch(()=>setPostsLoading(false))
    })
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  // ── Not signed in ──────────────────────────────────────────────
  if (!user?.id) {
    return (
      <div style={{position:'fixed',inset:0,zIndex:400,background:C.bg,display:'flex',flexDirection:'column',paddingTop:'env(safe-area-inset-top)'}}>
        <div style={{background:C.s1+'F0',backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.bdr}`,padding:'12px 16px',display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
          <button onClick={onClose} style={{background:'none',border:'none',color:C.tm,fontSize:'1.2rem',cursor:'pointer',padding:'4px 8px 4px 0',WebkitTapHighlightColor:'transparent'}}>←</button>
          <span style={{fontWeight:800,fontFamily:fm,fontSize:'0.9rem',color:C.t}}>Profile</span>
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem',textAlign:'center'}}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>👤</div>
          <h2 style={{fontSize:'1.1rem',fontWeight:800,margin:'0 0 8px',color:C.t}}>Join BuildSpec</h2>
          <p style={{fontSize:'0.75rem',color:C.tm,lineHeight:1.6,marginBottom:'1.5rem',maxWidth:280}}>
            Save builds, post reviews, respond to bounties, and connect with builders.
          </p>
          <button onClick={()=>{onClose();onShowAuth('signup')}} style={{width:'100%',maxWidth:280,padding:'12px',borderRadius:10,border:'none',background:C.acc,color:'#fff',fontSize:'0.82rem',fontWeight:700,cursor:'pointer',marginBottom:10}}>
            Create Account
          </button>
          <button onClick={()=>{onClose();onShowAuth('login')}} style={{width:'100%',maxWidth:280,padding:'12px',borderRadius:10,border:`1px solid ${C.bdr}`,background:'transparent',color:C.tm,fontSize:'0.82rem',cursor:'pointer'}}>
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // ── Signed in ──────────────────────────────────────────────────
  const displayName = profile?.display_name || profile?.username || 'Builder'
  const skill = SKILL_CFG[profile?.skill_level] || null
  const tier  = TIER_CFG[profile?.subscription_tier] || TIER_CFG.free
  const rep   = reputationTitle(profile?.reputation)
  const garage = Array.isArray(profile?.garage) ? profile.garage : []
  const location = [profile?.location_city, profile?.location_state].filter(Boolean).join(', ')

  const postMeta = {
    thread: { icon:'🧵', label:'Build Thread', color:'#A78BFA' },
    review: { icon:'⭐', label:'Review',        color:C.g },
    bounty: { icon:'🎯', label:'Bounty',        color:'#F97316' },
  }

  return (
    <div style={{position:'fixed',inset:0,zIndex:400,background:C.bg,display:'flex',flexDirection:'column',paddingTop:'env(safe-area-inset-top)'}}>
      {/* Header */}
      <div style={{background:C.s1+'F0',backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.bdr}`,padding:'12px 16px',display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
        <button onClick={onClose} style={{background:'none',border:'none',color:C.tm,fontSize:'1.2rem',cursor:'pointer',padding:'4px 8px 4px 0',WebkitTapHighlightColor:'transparent'}}>←</button>
        <span style={{flex:1,fontWeight:800,fontFamily:fm,fontSize:'0.9rem',color:C.t}}>Profile</span>
        <button onClick={()=>setShowSettings(true)} style={{background:'none',border:'none',color:C.tm,fontSize:'1.1rem',cursor:'pointer',padding:'4px',WebkitTapHighlightColor:'transparent'}} title="Settings">⚙️</button>
      </div>

      {/* Scrollable body */}
      <div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch',paddingBottom:'calc(80px + env(safe-area-inset-bottom))'}}>
        <div style={{maxWidth:600,margin:'0 auto',padding:'1rem'}}>

          {/* Edit panel (inline) */}
          {editing && (
            <EditProfilePanel profile={profile} onSave={()=>setEditing(false)} onCancel={()=>setEditing(false)}/>
          )}

          {/* Profile card */}
          {!editing && (
            <div style={{background:C.s1,borderRadius:16,border:`1px solid ${C.bdr}`,overflow:'hidden',marginBottom:'1rem'}}>
              <div style={{height:3,background:`linear-gradient(90deg,${C.acc},${C.g},${C.y},transparent)`}}/>
              <div style={{padding:'1.25rem'}}>
                <div style={{display:'flex',gap:'1rem',alignItems:'flex-start',marginBottom:'1rem'}}>
                  <Avatar profile={profile} size={68}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:2}}>
                      <span style={{fontSize:'1.1rem',fontWeight:900,color:C.t,lineHeight:1}}>{displayName}</span>
                      {profile?.is_verified_seller && (
                        <span style={{fontSize:'0.48rem',fontWeight:700,padding:'2px 7px',borderRadius:20,background:`${C.y}18`,color:C.y,border:`1px solid ${C.y}50`,fontFamily:fm}}>✓ VERIFIED</span>
                      )}
                    </div>
                    <div style={{fontSize:'0.6rem',color:C.td,fontFamily:fm,marginBottom:8}}>@{profile?.username}</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                      <span style={{fontSize:'0.48rem',fontWeight:700,padding:'2px 7px',borderRadius:20,background:tier.bg,color:tier.color,border:`1px solid ${tier.border}`,fontFamily:fm}}>
                        {tier.icon} {tier.label.toUpperCase()}
                      </span>
                      {skill && (
                        <span style={{fontSize:'0.48rem',fontWeight:700,padding:'2px 7px',borderRadius:20,background:skill.bg,color:skill.color,border:`1px solid ${skill.border}`,fontFamily:fm}}>
                          {skill.icon} {skill.label.toUpperCase()}
                        </span>
                      )}
                      <span style={{fontSize:'0.48rem',fontWeight:600,padding:'2px 7px',borderRadius:20,background:`${rep.color}12`,color:rep.color,border:`1px solid ${rep.color}30`,fontFamily:fm}}>
                        {rep.label}
                      </span>
                    </div>
                  </div>
                </div>

                {profile?.bio && (
                  <p style={{fontSize:'0.72rem',color:C.tm,lineHeight:1.6,margin:'0 0 10px',paddingTop:'0.85rem',borderTop:`1px solid ${C.bdr}`}}>{profile.bio}</p>
                )}

                {location && (
                  <div style={{fontSize:'0.6rem',color:C.td,marginBottom:8}}>📍 {location}</div>
                )}

                <button onClick={()=>setEditing(true)} style={{width:'100%',padding:'8px',borderRadius:8,border:`1px solid ${C.bdr}`,background:'transparent',color:C.tm,fontSize:'0.7rem',cursor:'pointer',fontFamily:fs,marginTop:4}}>
                  ✏️ Edit Profile
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:'1rem'}}>
            {[
              { label:'Rep',      value:profile?.reputation??0,         color:C.y },
              { label:'Builds',   value:profile?.build_count??0,         color:C.g },
              { label:'Posts',    value:profile?.post_count??0,          color:'#3B82F6' },
              { label:'Bounties', value:profile?.completed_bounties??0,  color:C.acc },
            ].map(s=>(
              <div key={s.label} style={{background:C.s1,borderRadius:10,border:`1px solid ${C.bdr}`,padding:'0.7rem 0.5rem',textAlign:'center'}}>
                <div style={{fontSize:'1.1rem',fontWeight:900,color:s.color,fontFamily:fm,lineHeight:1}}>{s.value}</div>
                <div style={{fontSize:'0.45rem',color:C.td,marginTop:3,textTransform:'uppercase',letterSpacing:'0.08em'}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Garage */}
          {garage.length > 0 && (
            <div style={{background:C.s1,borderRadius:14,border:`1px solid ${C.bdr}`,padding:'1rem',marginBottom:'1rem'}}>
              <div style={{fontSize:'0.58rem',fontWeight:700,color:C.td,textTransform:'uppercase',letterSpacing:'0.1em',fontFamily:fm,marginBottom:'0.65rem'}}>🚗 Garage</div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {garage.map((car,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:8,background:C.s2,border:`1px solid ${C.bdr}`}}>
                    <span style={{fontSize:'0.9rem'}}>🚙</span>
                    <span style={{fontSize:'0.72rem',color:C.t,fontWeight:600}}>{fmtPlatId(car)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent posts */}
          <div style={{background:C.s1,borderRadius:14,border:`1px solid ${C.bdr}`,padding:'1rem'}}>
            <div style={{fontSize:'0.58rem',fontWeight:700,color:C.td,textTransform:'uppercase',letterSpacing:'0.1em',fontFamily:fm,marginBottom:'0.65rem'}}>📋 Recent Posts</div>
            {postsLoading && (
              <div style={{textAlign:'center',padding:'1.5rem 0',color:C.td,fontSize:'0.7rem'}}>Loading…</div>
            )}
            {!postsLoading && posts.length === 0 && (
              <div style={{textAlign:'center',padding:'1.5rem 0',color:C.td,fontSize:'0.7rem'}}>No posts yet.</div>
            )}
            {!postsLoading && posts.map(p=>{
              const m = postMeta[p._type]
              const label = p._type==='thread' ? p.title : p._type==='review' ? `${p.part_name} ${'★'.repeat(p.rating||0)}${'☆'.repeat(5-(p.rating||0))}` : p.title
              return (
                <div key={`${p._type}-${p.id}`} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'9px 0',borderBottom:`1px solid ${C.bdr}`}}>
                  <div style={{width:30,height:30,borderRadius:'50%',background:m.color+'20',border:`1px solid ${m.color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',flexShrink:0}}>
                    {m.icon}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'0.62rem',fontWeight:700,color:m.color,fontFamily:fm,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:2}}>{m.label}</div>
                    <div style={{fontSize:'0.72rem',color:C.t,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{label}</div>
                  </div>
                  <div style={{fontSize:'0.55rem',color:C.td,fontFamily:fm,flexShrink:0}}>{timeAgo(p.created_at)}</div>
                </div>
              )
            })}
            {!postsLoading && posts.length > 0 && (
              <div style={{textAlign:'center',marginTop:'0.75rem'}}>
                <a href={profile?.username?`/user/${profile.username}`:'/'}
                   style={{fontSize:'0.62rem',color:C.td,textDecoration:'none',opacity:0.7}}>
                  View full profile →
                </a>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Settings bottom sheet */}
      {showSettings && (
        <SettingsMenu onClose={()=>setShowSettings(false)} onSignOut={handleSignOut}/>
      )}
    </div>
  )
}
