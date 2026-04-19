"use client"
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = 'https://mykvcojasfftliexypnm.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3Zjb2phc2ZmdGxpZXh5cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTA1OTEsImV4cCI6MjA4OTYyNjU5MX0.jDGPr6c0DgmOzqbODnyLpVN7nlpbljk5knvq6cz720I'
const supabase = createClient(SUPA_URL, SUPA_KEY)

const C = { bg:'#08080B', s1:'#12121A', s2:'#1A1A25', s3:'#20202E', bdr:'#2A2A3A', t:'#EEEEF2', tm:'#9999AA', td:'#666677', acc:'#E63946', g:'#2EC4B6', y:'#FFB703' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const CAT_CFG = {
  market_watch:   { label:'Market Watch',   color:'#3B82F6', bg:'#3B82F615', border:'#3B82F640', icon:'📈' },
  industry_roast: { label:'Industry Roast', color:'#E63946', bg:'#E6394615', border:'#E6394640', icon:'🔥' },
  hidden_gem:     { label:'Hidden Gem',     color:'#2EC4B6', bg:'#2EC4B615', border:'#2EC4B640', icon:'💎' },
  rip:            { label:'RIP',            color:'#6B7280', bg:'#6B728015', border:'#6B728040', icon:'🪦' },
  price_alert:    { label:'Price Alert',    color:'#F97316', bg:'#F9731615', border:'#F9731640', icon:'🚨' },
}

const ALL_CATS = [
  { id: 'all', label: 'All' },
  ...Object.entries(CAT_CFG).map(([id, v]) => ({ id, label: v.label, icon: v.icon })),
]

function timeAgo(ts) {
  if (!ts) return ''
  const diff = Date.now() - new Date(ts)
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  if (d < 30) return `${d}d ago`
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function CategoryBadge({ category }) {
  const cfg = CAT_CFG[category] || { label: category, color: C.tm, bg: C.bdr+'30', border: C.bdr, icon: '📰' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: '0.52rem', fontWeight: 700, padding: '2px 8px',
      borderRadius: 20, background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`, fontFamily: fm,
      letterSpacing: '0.06em', whiteSpace: 'nowrap',
    }}>
      {cfg.icon} {cfg.label.toUpperCase()}
    </span>
  )
}

function ArticleCard({ article }) {
  const cfg = CAT_CFG[article.category] || { color: C.tm }
  const [likes, setLikes] = useState(article.like_count || 0)
  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [liking, setLiking] = useState(false)

  async function handleLike() {
    if (liked || liking) return
    setLiking(true)
    setLikes(n => n + 1)
    setLiked(true)
    await supabase.rpc('increment_like', { row_id: article.id }).catch(() => {
      // optimistic — UI already updated
    })
    setLiking(false)
  }

  return (
    <div style={{
      background: C.s1,
      borderRadius: 14,
      border: `1px solid ${article.is_pinned ? cfg.color+'50' : C.bdr}`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeUp 0.3s ease-out both',
      transition: 'border-color 0.15s',
    }}>
      {/* Top accent */}
      <div style={{ height: 3, background: `linear-gradient(90deg,${cfg.color},${cfg.color}50,transparent)` }} />

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
            <CategoryBadge category={article.category} />
            {article.is_pinned && (
              <span style={{ fontSize: '0.5rem', color: C.y, fontFamily: fm, fontWeight: 700 }}>📌 PINNED</span>
            )}
          </div>
          <span style={{ fontSize: '0.55rem', color: C.td, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {timeAgo(article.created_at)}
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.t, lineHeight: 1.3, margin: 0 }}>
          {article.title}
        </h2>

        {/* Subtitle */}
        {article.subtitle && (
          <p style={{ fontSize: '0.72rem', color: C.tm, lineHeight: 1.55, margin: 0 }}>
            {article.subtitle}
          </p>
        )}

        {/* Content — truncated with expand */}
        <div style={{ fontSize: '0.7rem', color: '#B8B8C8', lineHeight: 1.65 }}>
          {expanded ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{article.content}</div>
          ) : (
            <div style={{
              display: '-webkit-box', WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {article.content}
            </div>
          )}
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              background: 'none', border: 'none', color: cfg.color,
              fontSize: '0.62rem', fontWeight: 600, cursor: 'pointer',
              padding: '4px 0 0', fontFamily: fs,
            }}
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {article.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '0.5rem', color: C.td, background: C.s2,
                border: `1px solid ${C.bdr}`, borderRadius: 4,
                padding: '1px 6px', fontFamily: fm,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.4rem', borderTop: `1px solid ${C.bdr}` }}>
          <span style={{ fontSize: '0.55rem', color: C.td }}>
            {article.author ? `by ${article.author}` : 'BuildSpec Team'}
          </span>
          <button
            onClick={handleLike}
            disabled={liked}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: liked ? `${cfg.color}18` : 'transparent',
              border: `1px solid ${liked ? cfg.color+'60' : C.bdr}`,
              borderRadius: 20, padding: '4px 10px',
              color: liked ? cfg.color : C.td,
              fontSize: '0.6rem', fontWeight: liked ? 700 : 400,
              cursor: liked ? 'default' : 'pointer',
              fontFamily: fs, transition: 'all 0.15s',
              minHeight: 30,
            }}
          >
            <span style={{ fontSize: '0.8rem' }}>{liked ? '❤️' : '🤍'}</span>
            {likes > 0 ? likes : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NewsClient({ initialArticles }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? initialArticles
    : initialArticles.filter(a => a.category === activeFilter)

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.t, fontFamily: fs }}>

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${C.bdr}`, padding: '12px 16px', background: C.s1, position: 'sticky', top: 0, zIndex: 50, paddingTop: 'calc(12px + env(safe-area-inset-top))' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <a href="/" style={{ fontSize: '1rem', fontWeight: 800, fontFamily: fm, textDecoration: 'none', color: C.t }}>
            BUILD<span style={{ color: C.acc }}>SPEC</span>
          </a>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="/" style={{ fontSize: '0.6rem', color: C.tm, textDecoration: 'none' }}>Home</a>
            <span style={{ color: C.td, fontSize: '0.6rem' }}>/</span>
            <span style={{ fontSize: '0.6rem', color: C.acc, fontWeight: 600 }}>News</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 5rem' }}>

        {/* Hero */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '3px 14px', borderRadius: 20, background: `${C.acc}18`, border: `1px solid ${C.acc}30`, fontSize: '0.55rem', color: C.acc, fontFamily: fm, fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            BuildSpec News
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            Market Watch. Roasts.<br />
            <span style={{ color: C.g }}>Hidden Gems.</span>
          </h1>
          <p style={{ fontSize: '0.8rem', color: C.tm, lineHeight: 1.6, maxWidth: 480 }}>
            No fluff. Price moves, industry takes, parts worth knowing about, and proper send-offs for dead platforms.
          </p>
        </div>

        {/* Category filter tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {ALL_CATS.map(cat => {
            const cfg = CAT_CFG[cat.id]
            const active = activeFilter === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                style={{
                  padding: '5px 12px', borderRadius: 20,
                  border: `1px solid ${active ? (cfg?.color || C.acc) : C.bdr}`,
                  background: active ? (cfg?.bg || `${C.acc}15`) : 'transparent',
                  color: active ? (cfg?.color || C.acc) : C.tm,
                  fontSize: '0.6rem', fontWeight: active ? 700 : 400,
                  cursor: 'pointer', fontFamily: fs,
                  transition: 'all 0.15s',
                }}
              >
                {cat.icon && `${cat.icon} `}{cat.label}
              </button>
            )
          })}
        </div>

        {/* Article count */}
        <div style={{ fontSize: '0.6rem', color: C.td, marginBottom: '1rem' }}>
          {filtered.length === 0 ? 'No articles yet' : `${filtered.length} article${filtered.length === 1 ? '' : 's'}`}
          {activeFilter !== 'all' && ` in ${CAT_CFG[activeFilter]?.label}`}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: C.td }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: C.tm }}>Nothing here yet</div>
            <div style={{ fontSize: '0.68rem' }}>Check back soon — the team posts regularly.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
            {filtered.map((article, i) => (
              <div key={article.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
