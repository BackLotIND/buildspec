export const metadata = {
  title: 'Terms of Service — BuildSpec',
  description: 'Terms of Service for BuildSpec, the car enthusiast platform.',
}

const C = { bg:'#08080B', s1:'#12121A', bdr:'#2A2A3A', t:'#EEEEF2', tm:'#9999AA', td:'#666677', acc:'#E63946' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const SECTIONS = [
  {
    heading: '1. Acceptance of Terms',
    body: `By accessing or using BuildSpec ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. We may update these terms at any time; continued use after changes constitutes acceptance.`,
  },
  {
    heading: '2. Description of Service',
    body: `BuildSpec is a car enthusiast platform that lets users plan builds, browse parts knowledge, post bounties, participate in community threads, and write part reviews. Some features require a free account; premium features require a paid subscription.`,
  },
  {
    heading: '3. Accounts',
    body: `You must be 13 years of age or older to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You agree to provide accurate information and to update it as necessary.`,
  },
  {
    heading: '4. User Content',
    body: `You retain ownership of content you post. By posting, you grant BuildSpec a non-exclusive, worldwide, royalty-free license to display, distribute, and promote that content within the Service. You are solely responsible for the accuracy and legality of your posts. We may remove content that violates these terms or applicable law without notice.`,
  },
  {
    heading: '5. Prohibited Conduct',
    body: `You may not: post false, misleading, or fraudulent content; harass, threaten, or abuse other users; spam or post unsolicited commercial messages; scrape or harvest data from the Service without permission; attempt to gain unauthorized access to any part of the Service; or use the Service for any unlawful purpose.`,
  },
  {
    heading: '6. Subscriptions and Payments',
    body: `Paid plans (Member, Pro) are billed monthly via Stripe. Subscriptions auto-renew until cancelled. You may cancel at any time through your account settings; cancellation takes effect at the end of the current billing period. We do not issue refunds for partial periods except where required by law.`,
  },
  {
    heading: '7. Intellectual Property',
    body: `All content, design, code, and data produced by BuildSpec (excluding user-generated content) is owned by BuildSpec and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.`,
  },
  {
    heading: '8. Disclaimers',
    body: `The Service is provided "as is" without warranties of any kind. Parts information, prices, and build advice are for informational purposes only. BuildSpec does not guarantee the accuracy of any content and is not liable for decisions made based on information found on the platform.`,
  },
  {
    heading: '9. Limitation of Liability',
    body: `To the fullest extent permitted by law, BuildSpec shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, even if advised of the possibility of such damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.`,
  },
  {
    heading: '10. Termination',
    body: `We may suspend or terminate your account at any time for violation of these terms or for any other reason at our discretion. Upon termination, your right to use the Service ceases immediately.`,
  },
  {
    heading: '11. Governing Law',
    body: `These terms are governed by the laws of the State of Delaware, without regard to conflict of law provisions. Any disputes shall be resolved in the courts of Delaware.`,
  },
  {
    heading: '12. Contact',
    body: `Questions about these terms? Email us at legal@thebuildspec.com.`,
  },
]

export default function TermsPage() {
  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:C.t, fontFamily:fs }}>
      {/* Header */}
      <header style={{ borderBottom:`1px solid ${C.bdr}`, padding:'12px 16px', background:C.s1, position:'sticky', top:0, zIndex:50, paddingTop:'calc(12px + env(safe-area-inset-top))' }}>
        <div style={{ maxWidth:700, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <a href="/" style={{ fontSize:'1rem', fontWeight:800, fontFamily:fm, textDecoration:'none', color:C.t }}>
            BUILD<span style={{ color:C.acc }}>SPEC</span>
          </a>
          <a href="/" style={{ fontSize:'0.62rem', color:C.tm, textDecoration:'none' }}>← Back</a>
        </div>
      </header>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'2.5rem 1.25rem 5rem' }}>
        {/* Title */}
        <div style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'1.6rem', fontWeight:900, margin:'0 0 6px', letterSpacing:'-0.02em' }}>Terms of Service</h1>
          <p style={{ fontSize:'0.68rem', color:C.td, margin:0, fontFamily:fm }}>Last updated: April 24, 2026</p>
        </div>

        {/* Intro */}
        <p style={{ fontSize:'0.78rem', color:C.tm, lineHeight:1.7, marginBottom:'2rem', padding:'1rem', background:C.s1, borderRadius:10, border:`1px solid ${C.bdr}`, borderLeft:`3px solid ${C.acc}` }}>
          Please read these Terms of Service carefully before using BuildSpec. These terms govern your access to and use of our platform.
        </p>

        {/* Sections */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          {SECTIONS.map(s => (
            <div key={s.heading}>
              <h2 style={{ fontSize:'0.82rem', fontWeight:700, color:C.t, margin:'0 0 8px', fontFamily:fm }}>{s.heading}</h2>
              <p style={{ fontSize:'0.75rem', color:C.tm, lineHeight:1.75, margin:0 }}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div style={{ marginTop:'3rem', paddingTop:'1.5rem', borderTop:`1px solid ${C.bdr}`, display:'flex', gap:16, flexWrap:'wrap' }}>
          <a href="/privacy" style={{ fontSize:'0.65rem', color:C.td, textDecoration:'none' }}>Privacy Policy</a>
          <a href="/" style={{ fontSize:'0.65rem', color:C.td, textDecoration:'none' }}>← Back to BuildSpec</a>
        </div>
      </div>
    </div>
  )
}
