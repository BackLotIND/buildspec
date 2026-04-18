export const metadata = {
  title: 'Pricing — BuildSpec',
  description: 'Free to browse. Member for the full experience. Pro to get paid. No fluff, no per-seat nonsense.',
  openGraph: {
    title: 'Pricing — BuildSpec',
    description: 'Free to browse. Member for the full experience. Pro to get paid.',
    url: 'https://thebuildspec.com/pricing',
  },
}

const C = { bg:'#08080B', s1:'#12121A', s2:'#1A1A25', bdr:'#2A2A3A', t:'#EEEEF2', tm:'#9999AA', td:'#666677', acc:'#E63946', g:'#2EC4B6', y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: null,
    tagline: 'The whole catalog, no account required.',
    color: C.tm,
    highlight: false,
    cta: 'Start Browsing',
    ctaHref: '/',
    features: [
      { text: 'Full platform & parts database', included: true },
      { text: 'Build guides and mod order', included: true },
      { text: 'Should You Buy? verdicts', included: true },
      { text: 'The Internet Effect tracker', included: true },
      { text: 'Cope Meter & fair price data', included: true },
      { text: 'Knowledge base articles', included: false, note: 'Member+' },
      { text: 'Community access', included: false, note: 'Member+' },
      { text: 'Post build bounties', included: false, note: 'Member+' },
      { text: 'Fulfill bounties & get paid', included: false, note: 'Pro only' },
      { text: 'Verified Seller badge', included: false, note: 'Pro only' },
    ],
  },
  {
    id: 'member',
    name: 'Member',
    price: 5,
    period: 'mo',
    tagline: 'The full BuildSpec experience. Knowledge, community, and the ability to post bounties.',
    color: C.g,
    highlight: true,
    badge: 'Most Popular',
    cta: 'Become a Member',
    ctaHref: '/signup?plan=member',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Full knowledge base access', included: true },
      { text: 'Community access & discussions', included: true },
      { text: 'Post build bounties', included: true, note: 'Find builders near you' },
      { text: 'Save builds to your profile', included: true },
      { text: 'Early access to new platforms', included: true },
      { text: 'Member-only market data', included: true },
      { text: 'Fulfill bounties & get paid', included: false, note: 'Pro only' },
      { text: 'Verified Seller badge', included: false, note: 'Pro only' },
      { text: 'Priority listing in search', included: false, note: 'Pro only' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 10,
    period: 'mo',
    tagline: 'For builders and sellers. Fulfill bounties, list parts, and get the badge that closes deals.',
    color: C.y,
    highlight: false,
    cta: 'Go Pro',
    ctaHref: '/signup?plan=pro',
    features: [
      { text: 'Everything in Member', included: true },
      { text: 'Fulfill bounties & get paid', included: true, note: 'Direct payouts' },
      { text: 'Verified Seller badge', included: true, note: 'Trust signal on all listings' },
      { text: 'Priority listing in search', included: true },
      { text: 'Parts & build listings', included: true },
      { text: 'Direct messaging with buyers', included: true },
      { text: 'Pro analytics dashboard', included: true },
      { text: 'Featured builder profile', included: true },
      { text: 'First access to platform data', included: true },
      { text: 'Pro badge on all posts', included: true },
    ],
  },
]

function Check({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0,marginTop:1}}>
      <circle cx="7" cy="7" r="7" fill={color} fillOpacity="0.15"/>
      <path d="M4 7l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Cross() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0,marginTop:1}}>
      <circle cx="7" cy="7" r="7" fill={C.bdr}/>
      <path d="M5 5l4 4M9 5l-4 4" stroke={C.td} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function PricingPage() {
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
            <span style={{fontSize:'0.6rem',color:C.acc,fontWeight:600}}>Pricing</span>
          </div>
        </div>
      </header>

      <div style={{maxWidth:960,margin:'0 auto',padding:'3rem 1rem 5rem'}}>

        {/* Hero */}
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <div style={{display:'inline-block',padding:'3px 14px',borderRadius:20,background:`${C.acc}18`,border:`1px solid ${C.acc}30`,fontSize:'0.55rem',color:C.acc,fontFamily:fm,fontWeight:700,letterSpacing:'0.12em',marginBottom:'1rem',textTransform:'uppercase'}}>
            Simple Pricing
          </div>
          <h1 style={{fontSize:'clamp(1.8rem,5vw,2.8rem)',fontWeight:900,letterSpacing:'-0.03em',lineHeight:1.1,marginBottom:'0.75rem'}}>
            Free to browse.<br/>
            <span style={{color:C.g}}>$5 to go deep.</span><br/>
            <span style={{color:C.y}}>$10 to get paid.</span>
          </h1>
          <p style={{fontSize:'0.85rem',color:C.tm,maxWidth:480,margin:'0 auto',lineHeight:1.65}}>
            No per-seat nonsense. No feature-locked paywalls on basic info. The catalog is free because knowledge should be free. The community and marketplace cost money because running them does.
          </p>
        </div>

        {/* Cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16,alignItems:'start',marginBottom:'3rem'}}>
          {TIERS.map(tier => (
            <div key={tier.id} style={{
              background: tier.highlight ? `${tier.color}08` : C.s1,
              borderRadius:16,
              border:`1px solid ${tier.highlight ? tier.color+'40' : C.bdr}`,
              overflow:'hidden',
              position:'relative',
              display:'flex',
              flexDirection:'column',
            }}>
              {/* Top accent bar */}
              <div style={{height:3,background:tier.highlight
                ? `linear-gradient(90deg,${tier.color},${tier.color}60,transparent)`
                : `linear-gradient(90deg,${tier.color}40,transparent)`
              }}/>

              {/* Badge */}
              {tier.badge && (
                <div style={{position:'absolute',top:16,right:16}}>
                  <span style={{fontSize:'0.5rem',fontWeight:800,padding:'2px 8px',borderRadius:20,background:`${tier.color}25`,color:tier.color,fontFamily:fm,letterSpacing:'0.08em',border:`1px solid ${tier.color}40`}}>
                    {tier.badge}
                  </span>
                </div>
              )}

              <div style={{padding:'1.5rem',flex:1,display:'flex',flexDirection:'column',gap:'1.25rem'}}>
                {/* Tier name + price */}
                <div>
                  <div style={{fontSize:'0.6rem',fontWeight:700,color:tier.color,fontFamily:fm,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.4rem'}}>{tier.name}</div>
                  <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:'0.5rem'}}>
                    {tier.price === 0 ? (
                      <span style={{fontSize:'2.2rem',fontWeight:900,color:C.t,fontFamily:fm,lineHeight:1}}>Free</span>
                    ) : (
                      <>
                        <span style={{fontSize:'0.9rem',fontWeight:700,color:C.tm,fontFamily:fm,alignSelf:'flex-start',marginTop:6}}>$</span>
                        <span style={{fontSize:'2.6rem',fontWeight:900,color:C.t,fontFamily:fm,lineHeight:1}}>{tier.price}</span>
                        <span style={{fontSize:'0.7rem',color:C.td,marginBottom:4}}>/{tier.period}</span>
                      </>
                    )}
                  </div>
                  <p style={{fontSize:'0.68rem',color:C.tm,lineHeight:1.55,margin:0}}>{tier.tagline}</p>
                </div>

                {/* CTA */}
                <a href={tier.ctaHref} style={{
                  display:'block',
                  textAlign:'center',
                  padding:'10px 0',
                  borderRadius:8,
                  background: tier.highlight ? tier.color : 'transparent',
                  color: tier.highlight ? '#08080B' : tier.color,
                  border:`1px solid ${tier.color}${tier.highlight ? '' : '60'}`,
                  textDecoration:'none',
                  fontWeight:700,
                  fontSize:'0.78rem',
                  transition:'opacity 0.15s',
                }}>
                  {tier.cta}
                </a>

                {/* Divider */}
                <div style={{borderTop:`1px solid ${C.bdr}`}}/>

                {/* Features */}
                <ul style={{listStyle:'none',margin:0,padding:0,display:'flex',flexDirection:'column',gap:'0.6rem'}}>
                  {tier.features.map((f,i) => (
                    <li key={i} style={{display:'flex',alignItems:'flex-start',gap:8}}>
                      {f.included ? <Check color={tier.color}/> : <Cross/>}
                      <span style={{fontSize:'0.68rem',color:f.included?C.tm:C.td,lineHeight:1.45}}>
                        {f.text}
                        {f.note && (
                          <span style={{marginLeft:5,fontSize:'0.55rem',color:f.included?tier.color:C.td,fontFamily:fm,fontWeight:600}}>
                            — {f.note}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ / reassurance row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,marginBottom:'3rem'}}>
          {[
            {q:'Cancel anytime?', a:'Yes. No contracts, no cancellation fees. Stop whenever. Your data stays accessible on the free tier.'},
            {q:'What\'s a bounty?', a:'Post a job — "needs a B-swap, Portland area" — and verified Pro builders bid on it. You pick your builder.'},
            {q:'What\'s a Verified Seller?', a:'Pros go through a lightweight verification. It\'s a trust signal to buyers that you\'re a real builder with a real reputation.'},
            {q:'Free really free?', a:'The full platform database, all verdicts, all build guides — yes. Free forever. We make money on the marketplace, not the catalog.'},
          ].map(item => (
            <div key={item.q} style={{background:C.s1,borderRadius:10,border:`1px solid ${C.bdr}`,padding:'1rem'}}>
              <div style={{fontSize:'0.7rem',fontWeight:700,color:C.t,marginBottom:'0.4rem'}}>{item.q}</div>
              <div style={{fontSize:'0.65rem',color:C.tm,lineHeight:1.6}}>{item.a}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{textAlign:'center',padding:'2rem',borderTop:`1px solid ${C.bdr}`}}>
          <p style={{fontSize:'0.72rem',color:C.td,marginBottom:'0.75rem'}}>Not sure yet? The catalog is free. Start there.</p>
          <a href="/" style={{display:'inline-block',padding:'10px 32px',borderRadius:8,background:C.acc,color:'#fff',textDecoration:'none',fontWeight:700,fontSize:'0.82rem'}}>
            Browse BuildSpec Free →
          </a>
        </div>
      </div>
    </div>
  )
}
