import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600 // re-fetch at most once per hour

async function getArticle(slug) {
  const { data } = await supabase
    .from('knowledge_articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Article Not Found — BuildSpec' }

  const title = `${article.title} — BuildSpec`
  const description = article.meta_description || article.content?.slice(0, 155).replace(/<[^>]+>/g, '') + '...'

  return {
    title,
    description,
    keywords: article.tags?.join(', '),
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://thebuildspec.com/knowledge/${params.slug}`,
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://thebuildspec.com/knowledge/${params.slug}`,
    },
  }
}

export default async function KnowledgeArticlePage({ params }) {
  const article = await getArticle(params.slug)
  if (!article) notFound()

  // Increment view count (fire-and-forget, don't block render)
  supabase
    .from('knowledge_articles')
    .update({ views: (article.views || 0) + 1 })
    .eq('id', article.id)
    .then(() => {})
    .catch(() => {})

  const publishedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  const updatedDate = article.updated_at && article.updated_at !== article.created_at
    ? new Date(article.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  // Detect if content is HTML or plain text
  const isHtml = article.content?.trimStart().startsWith('<')

  const C = { bg: '#0A0A0F', s1: '#12121A', s2: '#1A1A25', bdr: '#2A2A3A', t: '#EEEEF2', tm: '#9999AA', td: '#666677', acc: '#E63946', g: '#2EC4B6' }
  const fs = "'Inter',system-ui,sans-serif"
  const fm = "'JetBrains Mono','SF Mono',monospace"

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.meta_description || '',
            author: { '@type': 'Person', name: article.author || 'BuildSpec' },
            publisher: { '@type': 'Organization', name: 'BuildSpec' },
            datePublished: article.created_at,
            dateModified: article.updated_at || article.created_at,
            url: `https://thebuildspec.com/knowledge/${params.slug}`,
            keywords: article.tags?.join(', '),
          }),
        }}
      />

      <div style={{ minHeight: '100vh', background: C.bg, color: C.t, fontFamily: fs }}>
        {/* Header */}
        <header style={{ borderBottom: `1px solid ${C.bdr}`, padding: '12px 16px', background: C.s1 }}>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" style={{ fontSize: '1rem', fontWeight: 800, fontFamily: fm, textDecoration: 'none', color: C.t }}>
              BUILD<span style={{ color: C.acc }}>SPEC</span>
            </a>
            <a href="/" style={{ fontSize: '0.65rem', color: C.tm, textDecoration: 'none' }}>← Back to BuildSpec</a>
          </div>
        </header>

        {/* Article */}
        <main style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
          {/* Breadcrumb */}
          <nav style={{ fontSize: '0.6rem', color: C.td, marginBottom: '1.25rem', display: 'flex', gap: 6, alignItems: 'center' }}>
            <a href="/" style={{ color: C.td, textDecoration: 'none' }}>Home</a>
            <span>/</span>
            <span style={{ color: C.tm }}>Knowledge</span>
            {article.category && (
              <>
                <span>/</span>
                <span style={{ color: C.tm }}>{article.category}</span>
              </>
            )}
          </nav>

          {/* Category + tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
            {article.category && (
              <span style={{ fontSize: '0.58rem', padding: '2px 8px', borderRadius: 4, background: `${C.acc}20`, color: C.acc, fontFamily: fm, fontWeight: 600 }}>
                {article.category}
              </span>
            )}
            {article.tags?.map(tag => (
              <span key={tag} style={{ fontSize: '0.55rem', padding: '2px 7px', borderRadius: 4, background: C.s2, color: C.tm, border: `1px solid ${C.bdr}` }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem' }}>
            {article.title}
          </h1>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: `1px solid ${C.bdr}` }}>
            {article.author && (
              <span style={{ fontSize: '0.65rem', color: C.tm }}>By <strong style={{ color: C.t }}>{article.author}</strong></span>
            )}
            {publishedDate && (
              <span style={{ fontSize: '0.6rem', color: C.td }}>{publishedDate}</span>
            )}
            {updatedDate && (
              <span style={{ fontSize: '0.58rem', color: C.td }}>Updated {updatedDate}</span>
            )}
            {article.views > 0 && (
              <span style={{ fontSize: '0.58rem', color: C.td, marginLeft: 'auto' }}>{article.views.toLocaleString()} views</span>
            )}
          </div>

          {/* Content */}
          {isHtml ? (
            <div
              style={{ fontSize: '0.9rem', lineHeight: 1.75, color: C.tm }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div style={{ fontSize: '0.9rem', lineHeight: 1.75, color: C.tm, whiteSpace: 'pre-wrap' }}>
              {article.content}
            </div>
          )}

          {/* Platform / Make links */}
          {(article.platform_id || article.make_id) && (
            <div style={{ marginTop: '3rem', padding: '1rem', background: C.s1, borderRadius: 10, border: `1px solid ${C.bdr}` }}>
              <p style={{ fontSize: '0.7rem', color: C.tm, marginBottom: '0.75rem' }}>Related on BuildSpec:</p>
              <a
                href={`/?platform=${article.platform_id || article.make_id}`}
                style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 8, background: C.acc, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.78rem' }}
              >
                🔧 Build This Platform →
              </a>
            </div>
          )}

          {/* Footer CTA */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center', padding: '1.5rem', borderTop: `1px solid ${C.bdr}` }}>
            <p style={{ fontSize: '0.72rem', color: C.td, marginBottom: '0.75rem' }}>Plan your build with parts, pricing, and honest advice.</p>
            <a href="/" style={{ display: 'inline-block', padding: '10px 28px', borderRadius: 8, background: C.acc, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' }}>
              Start Building on BuildSpec →
            </a>
          </div>
        </main>
      </div>
    </>
  )
}
