import { createClient } from '@supabase/supabase-js'
import CopyButton from './CopyButton'

const supabase = createClient(
  'https://mykvcojasfftliexypnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3Zjb2phc2ZmdGxpZXh5cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTA1OTEsImV4cCI6MjA4OTYyNjU5MX0.jDGPr6c0DgmOzqbODnyLpVN7nlpbljk5knvq6cz720I'
)

async function getBuild(id) {
  try {
    const { data } = await supabase.from('builds').select('*').eq('id', id).eq('is_public', true).single()
    return data
  } catch(e) { return null }
}

function formatId(id) {
  if (!id) return ''
  return id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export async function generateMetadata({ params }) {
  const build = await getBuild(params.id)
  if (!build) return { title: 'Build Not Found — BuildSpec' }
  const title = `${build.title} — BuildSpec`
  const desc = `${formatId(build.platform_id)} build • $${build.total_cost} • +${build.total_hp}HP. Planned on BuildSpec.`
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `https://thebuildspec.com/build/${params.id}`,
    },
    twitter: {
      card: 'summary',
      title,
      description: desc,
    },
  }
}

export default async function BuildSharePage({ params }) {
  const build = await getBuild(params.id)
  const shareUrl = `https://thebuildspec.com/build/${params.id}`

  const C = { bg:"#0A0A0F", s1:"#12121A", s2:"#1A1A25", bdr:"#2A2A3A", t:"#EEEEF2", tm:"#9999AA", td:"#666677", acc:"#E63946", g:"#2EC4B6" }
  const fs = "'Inter',system-ui,sans-serif"
  const fm = "'JetBrains Mono','SF Mono',monospace"

  if (!build) {
    return (
      <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:fs,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center",padding:"2rem"}}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>🔍</div>
          <h1 style={{fontSize:"1.5rem",fontWeight:800,marginBottom:8}}>Build Not Found</h1>
          <p style={{fontSize:"0.8rem",color:C.tm,marginBottom:"1.5rem"}}>This build may have been deleted or made private.</p>
          <a href="/" style={{padding:"10px 24px",borderRadius:8,background:C.acc,color:"#fff",textDecoration:"none",fontWeight:700,fontSize:"0.85rem"}}>← Back to BuildSpec</a>
        </div>
      </div>
    )
  }

  let parts = []
  try { parts = typeof build.parts === 'string' ? JSON.parse(build.parts) : build.parts } catch(e) {}
  const partCount = typeof parts === 'object' && parts !== null ? Object.keys(parts).length : 0

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:fs}}>
      {/* Header */}
      <header style={{borderBottom:`1px solid ${C.bdr}`,padding:"12px 16px",background:C.s1}}>
        <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <a href="/" style={{fontSize:"1rem",fontWeight:800,fontFamily:fm,textDecoration:"none",color:C.t}}>BUILD<span style={{color:C.acc}}>SPEC</span></a>
          <a href="/" style={{fontSize:"0.65rem",color:C.tm,textDecoration:"none"}}>← Plan your own build</a>
        </div>
      </header>

      {/* Build Card */}
      <div style={{maxWidth:600,margin:"2rem auto",padding:"0 1rem"}}>
        <div style={{background:C.s1,borderRadius:16,border:`2px solid ${C.g}`,padding:"2rem",marginBottom:"1.5rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{fontSize:"0.6rem",padding:"2px 8px",borderRadius:4,background:`${C.g}20`,color:C.g,fontFamily:fm,fontWeight:600}}>COMMUNITY BUILD</span>
          </div>
          <h1 style={{fontSize:"1.6rem",fontWeight:800,marginBottom:6,lineHeight:1.2}}>{build.title}</h1>
          <p style={{fontSize:"0.75rem",color:C.tm,marginBottom:"1.5rem"}}>{formatId(build.platform_id)} {build.vehicle_id ? `• ${formatId(build.vehicle_id)}` : ''}</p>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:"1.5rem"}}>
            {[
              {label:"Total Cost",value:`$${(build.total_cost||0).toLocaleString()}`,color:C.acc},
              {label:"Power Gain",value:`+${build.total_hp||0}HP`,color:C.g},
              {label:"Parts",value:`${partCount} parts`,color:"#FFB703"},
            ].map(stat=>(
              <div key={stat.label} style={{background:C.s2,borderRadius:10,padding:"0.75rem",textAlign:"center"}}>
                <div style={{fontSize:"1.1rem",fontWeight:800,color:stat.color,fontFamily:fm}}>{stat.value}</div>
                <div style={{fontSize:"0.55rem",color:C.td,marginTop:2}}>{stat.label}</div>
              </div>
            ))}
          </div>

          {build.notes && <p style={{fontSize:"0.72rem",color:C.tm,lineHeight:1.5,marginBottom:"1.5rem",padding:"0.75rem",background:C.s2,borderRadius:8,borderLeft:`3px solid ${C.g}`}}>{build.notes}</p>}

          <div style={{marginBottom:"1rem"}}>
            <CopyButton url={shareUrl} />
            <div style={{display:"flex",gap:8}}>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my ${formatId(build.platform_id)} build on BuildSpec! $${build.total_cost} • +${build.total_hp}HP`)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${C.bdr}`,background:"transparent",color:C.tm,fontSize:"0.72rem",fontWeight:600,cursor:"pointer",textAlign:"center",textDecoration:"none",display:"block"}}>
                𝕏 Share on X
              </a>
              <a href={`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(build.title + ' — BuildSpec')}`} target="_blank" rel="noopener noreferrer"
                style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${C.bdr}`,background:"transparent",color:C.tm,fontSize:"0.72rem",fontWeight:600,cursor:"pointer",textAlign:"center",textDecoration:"none",display:"block"}}>
                🟠 Share on Reddit
              </a>
            </div>
          </div>
        </div>

        <div style={{textAlign:"center",padding:"1rem"}}>
          <p style={{fontSize:"0.7rem",color:C.td,marginBottom:"0.75rem"}}>Want to plan your own build?</p>
          <a href="/" style={{padding:"12px 32px",borderRadius:8,background:C.acc,color:"#fff",textDecoration:"none",fontWeight:700,fontSize:"0.85rem",display:"inline-block"}}>🔧 Start Building on BuildSpec →</a>
        </div>
      </div>
    </div>
  )
}
