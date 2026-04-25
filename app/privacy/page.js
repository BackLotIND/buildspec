export const metadata = {
  title: 'Privacy Policy — BuildSpec',
  description: 'Privacy Policy for BuildSpec, the car enthusiast platform.',
}

const C = { bg:'#08080B', s1:'#12121A', bdr:'#2A2A3A', t:'#EEEEF2', tm:'#9999AA', td:'#666677', acc:'#E63946' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const SECTIONS = [
  {
    heading: '1. Information We Collect',
    body: `We collect information you provide directly — such as your email address, username, display name, and profile details (bio, garage, skill level, location) when you create an account. We also collect content you post (build threads, part reviews, bounties, comments). When you subscribe, Stripe collects your payment information on our behalf; we do not store full card numbers. We automatically collect usage data including pages visited, features used, and device/browser information through our hosting and analytics providers.`,
  },
  {
    heading: '2. How We Use Your Information',
    body: `We use your information to operate and improve the Service; to personalize your experience (e.g., feed recommendations, onboarding); to process payments and manage subscriptions; to send transactional emails (account confirmation, subscription receipts); to detect and prevent fraud or abuse; and to comply with legal obligations. We do not sell your personal information to third parties.`,
  },
  {
    heading: '3. Information We Share',
    body: `Your public profile (username, display name, bio, garage, posts) is visible to other users if your profile is set to public. We share data with service providers who help us operate the platform: Supabase (database and authentication), Stripe (payments), and Vercel (hosting). These providers are bound by their own privacy policies and data processing agreements. We may disclose information if required by law or to protect the rights, property, or safety of BuildSpec, our users, or the public.`,
  },
  {
    heading: '4. Data Storage and Security',
    body: `Your data is stored in Supabase (PostgreSQL) hosted on AWS infrastructure. We use row-level security policies to ensure users can only access data they are authorized to see. Passwords are managed by Supabase Auth and are never stored in plaintext. While we implement reasonable security measures, no system is completely secure and we cannot guarantee absolute security.`,
  },
  {
    heading: '5. Cookies and Tracking',
    body: `We use cookies and local storage to maintain your session and authentication state. We may use analytics tools to understand aggregate usage patterns. You can disable cookies in your browser settings, but doing so may prevent you from logging in or using certain features.`,
  },
  {
    heading: '6. Your Rights',
    body: `You may access, update, or delete your profile information at any time through your account settings. You may request deletion of your account and associated data by emailing privacy@thebuildspec.com. We will fulfill deletion requests within 30 days, subject to legal retention requirements. If you are in the EEA or UK, you may also have rights to data portability and to lodge a complaint with your local supervisory authority.`,
  },
  {
    heading: '7. Data Retention',
    body: `We retain your account data for as long as your account is active or as needed to provide the Service. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or fraud-prevention purposes. Anonymized, aggregated data may be retained indefinitely.`,
  },
  {
    heading: '8. Children\'s Privacy',
    body: `BuildSpec is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete it promptly. If you believe a child has provided us with their information, please contact us at privacy@thebuildspec.com.`,
  },
  {
    heading: '9. Third-Party Links',
    body: `The Service may contain links to third-party websites (e.g., parts retailers, YouTube videos, community forums). We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies before providing any information.`,
  },
  {
    heading: '10. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy and updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the updated policy.`,
  },
  {
    heading: '11. Contact',
    body: `If you have questions or concerns about this Privacy Policy or how we handle your data, contact us at privacy@thebuildspec.com.`,
  },
]

export default function PrivacyPage() {
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
          <h1 style={{ fontSize:'1.6rem', fontWeight:900, margin:'0 0 6px', letterSpacing:'-0.02em' }}>Privacy Policy</h1>
          <p style={{ fontSize:'0.68rem', color:C.td, margin:0, fontFamily:fm }}>Last updated: April 24, 2026</p>
        </div>

        {/* Intro */}
        <p style={{ fontSize:'0.78rem', color:C.tm, lineHeight:1.7, marginBottom:'2rem', padding:'1rem', background:C.s1, borderRadius:10, border:`1px solid ${C.bdr}`, borderLeft:`3px solid ${C.acc}` }}>
          Your privacy matters. This policy explains what data we collect, how we use it, and the choices you have. BuildSpec does not sell your personal information.
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
          <a href="/terms" style={{ fontSize:'0.65rem', color:C.td, textDecoration:'none' }}>Terms of Service</a>
          <a href="/" style={{ fontSize:'0.65rem', color:C.td, textDecoration:'none' }}>← Back to BuildSpec</a>
        </div>
      </div>
    </div>
  )
}
