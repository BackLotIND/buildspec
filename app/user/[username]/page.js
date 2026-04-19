import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

const supabase = createClient(
  'https://mykvcojasfftliexypnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3Zjb2phc2ZmdGxpZXh5cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTA1OTEsImV4cCI6MjA4OTYyNjU5MX0.jDGPr6c0DgmOzqbODnyLpVN7nlpbljk5knvq6cz720I'
)

const C = { bg:'#08080B', s1:'#12121A', s2:'#1A1A25', s3:'#20202E', bdr:'#2A2A3A', t:'#EEEEF2', tm:'#9999AA', td:'#666677', acc:'#E63946', g:'#2EC4B6', y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const SKILL_CFG = {
  beginner:     { label:'Beginner',     color:'#6B7280', bg:'#6B728018', border:'#6B728040', icon:'🔰' },
  intermediate: { label:'Intermediate', color:'#3B82F6', bg:'#3B82F618', border:'#3B82F640', icon:'🔧' },
  advanced:     { label:'Advanced',     color:'#8B5CF6', bg:'#8B5CF618', border:'#8B5CF640', icon:'⚡' },
  shop_tech:    { label:'Shop Tech',    color:'#F97316', bg:'#F9731618', border:'#F9731640', icon:'🛠️' },
  builder:      { label:'Builder',      color:'#FFB703', bg:'#FFB70318', border:'#FFB70340', icon:'🏆' },
  // legacy values
  diy:          { label:'DIY',          color:'#3B82F6', bg:'#3B82F618', border:'#3B82F640', icon:'🔧' },
  enthusiast:   { label:'Enthusiast',   color:'#2EC4B6', bg:'#2EC4B618', border:'#2EC4B640', icon:'⚡' },
  experienced:  { label:'Experienced',  color:'#8B5CF6', bg:'#8B5CF618', border:'#8B5CF640', icon:'🏎️' },
  professional: { label:'Professional', color:'#FFB703', bg:'#FFB70318', border:'#FFB70340', icon:'🏆' },
}

const TIER_CFG = {
  free:   { label:'Free',   color:'#6B7280', bg:'#6B728018', border:'#6B728040' },
  member: { label:'Member', color:'#2EC4B6', bg:'#2EC4B618', border:'#2EC4B640' },
  pro:    { label:'Pro',    color:'#FFB703', bg:'#FFB70318', border:'#FFB70340' },
}

const SOCIAL_CFG = {
  instagram: { icon:'📸', label:'Instagram', base:'https://instagram.com/' },
  twitter:   { icon:'𝕏',  label:'Twitter/X', base:'https://x.com/' },
  youtube:   { icon:'▶️', label:'YouTube',   base:'https://youtube.com/@' },
  tiktok:    { icon:'🎵', label:'TikTok',    base:'https://tiktok.com/@' },
  threads:   { icon:'🧵', label:'Threads',   base:'https://threads.net/@' },
  discord:   { icon:'💬', label:'Discord',   base:null },
  website:   { icon:'🌐', label:'Website',   base:'' },
}

function fmtPlatformId(id) {
  return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function socialUrl(key, value) {
  const cfg = SOCIAL_CFG[key]
  if (!cfg) return null
  if (!cfg.base) return null
  if (cfg.base === '') return value.startsWith('http') ? value : `https://${value}`
  const handle = value.replace(/^@/, '')
  return `${cfg.base}${handle}`
}

function reputationTitle(rep) {
  if (!rep || rep < 10)  return { label:'Newcomer',   color:C.td }
  if (rep < 50)          return { label:'Regular',    color:C.tm }
  if (rep < 150)         return { label:'Contributor',color:'#3B82F6' }
  if (rep < 400)         return { label:'Respected',  color:C.g }
  if (rep < 1000)        return { label:'Expert',     color:'#8B5CF6' }
  return                        { label:'Legend',     color:C.y }
}

export async function generateMetadata({ params }) {
  const { data: p } = await supabase
    .from('profiles')
    .select('username,display_name,bio,is_public')
    .eq('username', params.username)
    .single()

  if (!p || !p.is_public) return { title: 'Profile — BuildSpec' }

  const name = p.display_name || p.username
  return {
    title: `${name} — BuildSpec`,
    description: p.bio || `Check out ${name}'s profile on BuildSpec.`,
    openGraph: {
      title: `${name} — BuildSpec`,
      description: p.bio || `Check out ${name}'s profile on BuildSpec.`,
      url: `https://thebuildspec.com/user/${p.username}`,
    },
  }
}

export const revalidate = 60

export default async function UserProfilePage({ params }) {
  const { data: p } = await supabase
    .from('profiles')
    .select('username,display_name,avatar_url,bio,skill_level,garage,interests,reputation,completed_bounties,subscription_tier,is_verified_seller,location_city,location_state,preferred_platforms,build_count,post_count,joined_display,is_public,social_links,created_at')
    .eq('username', params.username)
    .single()

  if (!p) notFound()

  // Private profile — show locked state
  if (!p.is_public) {
    return (
      <div style={{minHeight:'100vh',background:C.bg,color:C.t,fontFamily:fs}}>
        <Header />
        <div style={{maxWidth:600,margin:'6rem auto',padding:'0 1rem',textAlign:'center'}}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔒</div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,marginBottom:8}}>Private Profile</h1>
          <p style={{fontSize:'0.8rem',color:C.tm,marginBottom:'2rem'}}>
            @{p.username} has set their profile to private.
          </p>
          <a href="/" style={{padding:'10px 24px',borderRadius:8,background:C.acc,color:'#fff',textDecoration:'none',fontWeight:700,fontSize:'0.82rem'}}>← Back to BuildSpec</a>
        </div>
      </div>
    )
  }

  const skill = SKILL_CFG[p.skill_level] || null
  const tier  = TIER_CFG[p.subscription_tier] || TIER_CFG.free
  const rep   = reputationTitle(p.reputation)
  const socials = p.social_links && typeof p.social_links === 'object'
    ? Object.entries(p.social_links).filter(([,v]) => v)
    : []
  const displayName = p.display_name || p.username
  const location = [p.location_city, p.location_state].filter(Boolean).join(', ')
  const joinDate = p.joined_display || (p.created_at ? new Date(p.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : null)

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.t,fontFamily:fs}}>
      <Header />

      <div style={{maxWidth:700,margin:'0 auto',padding:'2rem 1rem 5rem'}}>

        {/* Profile card */}
        <div style={{background:C.s1,borderRadius:20,border:`1px solid ${C.bdr}`,overflow:'hidden',marginBottom:'1.25rem'}}>
          {/* Accent bar */}
          <div style={{height:4,background:`linear-gradient(90deg,${C.acc},${C.g},${C.y},transparent)`}}/>

          <div style={{padding:'1.75rem'}}>
            <div style={{display:'flex',gap:'1.25rem',alignItems:'flex-start',flexWrap:'wrap'}}>

              {/* Avatar */}
              <div style={{
                width:72,height:72,borderRadius:'50%',flexShrink:0,
                background:p.avatar_url ? 'transparent' : `linear-gradient(135deg,${C.acc},${C.g})`,
                border:`2px solid ${C.bdr}`,overflow:'hidden',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                {p.avatar_url
                  ? <img src={p.avatar_url} alt={displayName} width={72} height={72} style={{objectFit:'cover',width:'100%',height:'100%'}}/>
                  : <span style={{fontSize:'1.8rem',fontWeight:900,color:'#fff',fontFamily:fm}}>
                      {displayName[0].toUpperCase()}
                    </span>
                }
              </div>

              {/* Name / meta */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',flexWrap:'wrap',gap:6,alignItems:'center',marginBottom:4}}>
                  <h1 style={{fontSize:'1.35rem',fontWeight:900,margin:0,lineHeight:1}}>{displayName}</h1>
                  {p.is_verified_seller && (
                    <span style={{fontSize:'0.52rem',fontWeight:700,padding:'2px 8px',borderRadius:20,background:`${C.y}18`,color:C.y,border:`1px solid ${C.y}50`,fontFamily:fm,letterSpacing:'0.06em'}}>
                      ✓ VERIFIED
                    </span>
                  )}
                </div>
                <div style={{fontSize:'0.65rem',color:C.td,marginBottom:8,fontFamily:fm}}>@{p.username}</div>

                {/* Badges row */}
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                  {/* Tier */}
                  <span style={{fontSize:'0.52rem',fontWeight:700,padding:'2px 8px',borderRadius:20,background:tier.bg,color:tier.color,border:`1px solid ${tier.border}`,fontFamily:fm,letterSpacing:'0.06em'}}>
                    {tier.label === 'Pro' ? '⚡ PRO' : tier.label === 'Member' ? '🟢 MEMBER' : 'FREE'}
                  </span>
                  {/* Skill */}
                  {skill && (
                    <span style={{fontSize:'0.52rem',fontWeight:700,padding:'2px 8px',borderRadius:20,background:skill.bg,color:skill.color,border:`1px solid ${skill.border}`,fontFamily:fm,letterSpacing:'0.06em'}}>
                      {skill.icon} {skill.label.toUpperCase()}
                    </span>
                  )}
                  {/* Reputation title */}
                  <span style={{fontSize:'0.52rem',fontWeight:600,padding:'2px 8px',borderRadius:20,background:`${rep.color}12`,color:rep.color,border:`1px solid ${rep.color}30`,fontFamily:fm}}>
                    {rep.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {p.bio && (
              <p style={{fontSize:'0.78rem',color:C.tm,lineHeight:1.65,margin:'1.1rem 0 0',paddingTop:'1rem',borderTop:`1px solid ${C.bdr}`}}>
                {p.bio}
              </p>
            )}

            {/* Location + join date */}
            {(location || joinDate) && (
              <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:'0.75rem'}}>
                {location && <span style={{fontSize:'0.62rem',color:C.td}}>📍 {location}</span>}
                {joinDate  && <span style={{fontSize:'0.62rem',color:C.td}}>📅 Joined {joinDate}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))',gap:8,marginBottom:'1.25rem'}}>
          {[
            { label:'Reputation',  value: p.reputation ?? 0,          color:C.y },
            { label:'Builds',      value: p.build_count ?? 0,          color:C.g },
            { label:'Posts',       value: p.post_count ?? 0,           color:'#3B82F6' },
            { label:'Bounties',    value: p.completed_bounties ?? 0,   color:C.acc },
          ].map(s => (
            <div key={s.label} style={{background:C.s1,borderRadius:12,border:`1px solid ${C.bdr}`,padding:'0.85rem',textAlign:'center'}}>
              <div style={{fontSize:'1.3rem',fontWeight:900,color:s.color,fontFamily:fm,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:'0.5rem',color:C.td,marginTop:4,letterSpacing:'0.08em',textTransform:'uppercase'}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>

          {/* Garage */}
          {p.garage?.length > 0 && (
            <div style={{background:C.s1,borderRadius:14,border:`1px solid ${C.bdr}`,padding:'1.1rem',gridColumn: p.interests?.length ? 'auto' : '1 / -1'}}>
              <h2 style={{fontSize:'0.7rem',fontWeight:700,color:C.td,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>🚗 Garage</h2>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {p.garage.map((car, i) => (
                  <a key={i} href={`/?plat=${car}`} style={{
                    display:'flex',alignItems:'center',gap:8,
                    padding:'6px 10px',borderRadius:8,
                    background:C.s2,border:`1px solid ${C.bdr}`,
                    textDecoration:'none',transition:'border-color 0.15s',
                  }}
                  onMouseEnter={undefined}
                  >
                    <span style={{fontSize:'0.85rem'}}>🚙</span>
                    <span style={{fontSize:'0.7rem',color:C.t,fontWeight:600}}>{fmtPlatformId(car)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {p.interests?.length > 0 && (
            <div style={{background:C.s1,borderRadius:14,border:`1px solid ${C.bdr}`,padding:'1.1rem'}}>
              <h2 style={{fontSize:'0.7rem',fontWeight:700,color:C.td,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>🎯 Interests</h2>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {p.interests.map((tag, i) => (
                  <span key={i} style={{
                    fontSize:'0.62rem',padding:'3px 10px',borderRadius:20,
                    background:`${C.g}15`,color:C.g,
                    border:`1px solid ${C.g}35`,fontWeight:500,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social links */}
          {socials.length > 0 && (
            <div style={{background:C.s1,borderRadius:14,border:`1px solid ${C.bdr}`,padding:'1.1rem',gridColumn:'1 / -1'}}>
              <h2 style={{fontSize:'0.7rem',fontWeight:700,color:C.td,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>🔗 Links</h2>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {socials.map(([key, value]) => {
                  const cfg = SOCIAL_CFG[key] || { icon:'🔗', label:key, base:null }
                  const url = socialUrl(key, value)
                  const handle = value.startsWith('http') ? new URL(value).hostname : value
                  return url ? (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{
                      display:'flex',alignItems:'center',gap:6,
                      padding:'6px 12px',borderRadius:8,
                      background:C.s2,border:`1px solid ${C.bdr}`,
                      textDecoration:'none',color:C.tm,fontSize:'0.65rem',fontWeight:500,
                      transition:'border-color 0.15s,color 0.15s',
                    }}>
                      <span style={{fontSize:'0.9rem'}}>{cfg.icon}</span>
                      <span style={{color:C.t,fontWeight:600}}>{cfg.label}</span>
                      <span style={{color:C.td}}>{handle}</span>
                    </a>
                  ) : (
                    <span key={key} style={{
                      display:'flex',alignItems:'center',gap:6,
                      padding:'6px 12px',borderRadius:8,
                      background:C.s2,border:`1px solid ${C.bdr}`,
                      color:C.tm,fontSize:'0.65rem',fontWeight:500,
                    }}>
                      <span style={{fontSize:'0.9rem'}}>{cfg.icon}</span>
                      <span>{cfg.label}:</span>
                      <span style={{color:C.td}}>{value}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}

        </div>

        {/* Back CTA */}
        <div style={{textAlign:'center',marginTop:'2.5rem'}}>
          <a href="/" style={{display:'inline-block',padding:'10px 28px',borderRadius:8,background:C.acc,color:'#fff',textDecoration:'none',fontWeight:700,fontSize:'0.8rem'}}>
            🔧 Build your own spec →
          </a>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header style={{borderBottom:`1px solid ${C.bdr}`,padding:'12px 16px',background:C.s1,position:'sticky',top:0,zIndex:50,paddingTop:'calc(12px + env(safe-area-inset-top))'}}>
      <div style={{maxWidth:700,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
        <a href="/" style={{fontSize:'1rem',fontWeight:800,fontFamily:fm,textDecoration:'none',color:C.t}}>
          BUILD<span style={{color:C.acc}}>SPEC</span>
        </a>
        <a href="/" style={{fontSize:'0.62rem',color:C.tm,textDecoration:'none'}}>← Back to BuildSpec</a>
      </div>
    </header>
  )
}
