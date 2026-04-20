"use client"
import { useState, useEffect, useCallback } from 'react'

const C = { bg:'#08080B',s1:'#12121A',s2:'#1A1A25',bdr:'#2A2A3A',t:'#EEEEF2',tm:'#9999AA',td:'#666677',acc:'#E63946',accD:'#E6394620',g:'#2EC4B6',y:'#FFB703',or:'#F97316' }
const fs = "'Inter',system-ui,sans-serif"
const fm = "'JetBrains Mono','SF Mono',monospace"

const TYPE_META = {
  bounty_response: { icon:'🎯', label:'Bounty Response', color: C.or },
  thread_reply:    { icon:'🧵', label:'Thread Reply',    color:'#A78BFA' },
  like:            { icon:'❤️', label:'Like',            color: C.acc },
  system:          { icon:'📢', label:'System',          color: C.g },
}

function groupByTime(notifications) {
  const now = new Date()
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0)
  const weekStart = new Date(todayStart); weekStart.setDate(todayStart.getDate() - 6)

  const today = [], thisWeek = [], earlier = []
  for (const n of notifications) {
    const d = new Date(n.created_at)
    if (d >= todayStart) today.push(n)
    else if (d >= weekStart) thisWeek.push(n)
    else earlier.push(n)
  }
  return { today, thisWeek, earlier }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function NotificationRow({ notif, onTap }) {
  const meta = TYPE_META[notif.type] || TYPE_META.system
  const [pressed, setPressed] = useState(false)

  return (
    <div
      onClick={() => onTap(notif)}
      onMouseEnter={e => { e.currentTarget.style.background = C.s2 }}
      onMouseLeave={e => { e.currentTarget.style.background = notif.is_read ? 'transparent' : C.accD }}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '12px 16px',
        background: notif.is_read ? 'transparent' : C.accD,
        cursor: 'pointer',
        transition: 'background 0.15s',
        borderBottom: `1px solid ${C.bdr}`,
        WebkitTapHighlightColor: 'transparent',
        opacity: pressed ? 0.7 : 1,
      }}
    >
      {/* Icon badge */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: meta.color + '20',
        border: `1px solid ${meta.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', marginTop: 1,
      }}>
        {meta.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: '0.6rem', color: meta.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: fm }}>
            {meta.label}
          </span>
          {!notif.is_read && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.acc, flexShrink: 0 }} />
          )}
        </div>
        <div style={{ fontSize: '0.75rem', color: C.t, fontWeight: notif.is_read ? 400 : 600, lineHeight: 1.4, marginBottom: 3 }}>
          {notif.title}
        </div>
        {notif.body && (
          <div style={{ fontSize: '0.68rem', color: C.tm, lineHeight: 1.4, marginBottom: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {notif.body}
          </div>
        )}
        <div style={{ fontSize: '0.58rem', color: C.td, fontFamily: fm }}>
          {timeAgo(notif.created_at)}
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ label, count }) {
  return (
    <div style={{ padding: '10px 16px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: '0.58rem', fontWeight: 700, color: C.td, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: fm }}>
        {label}
      </span>
      <span style={{ fontSize: '0.55rem', color: C.td, background: C.s2, borderRadius: 10, padding: '1px 6px', border: `1px solid ${C.bdr}` }}>
        {count}
      </span>
    </div>
  )
}

export default function NotificationsTab({ onClose, user, supabase }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) { setLoading(false); return }
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(60)
    setNotifications(data || [])
    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    fetchNotifications()

    if (!user?.id) return
    const channel = supabase
      .channel('notifications-tab')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, payload => {
        setNotifications(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchNotifications, user, supabase])

  const markRead = useCallback(async (notif) => {
    if (notif.is_read) {
      if (notif.link) window.location.href = notif.link
      return
    }
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n))
    await supabase.from('notifications').update({ is_read: true }).eq('id', notif.id)
    if (notif.link) window.location.href = notif.link
  }, [supabase])

  const markAllRead = useCallback(async () => {
    setMarkingAll(true)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false)
    setMarkingAll(false)
  }, [supabase, user])

  const unreadCount = notifications.filter(n => !n.is_read).length
  const { today, thisWeek, earlier } = groupByTime(notifications)

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: '#000000B0',
        display: 'flex', flexDirection: 'column',
        paddingTop: 'env(safe-area-inset-top)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: C.bg,
        display: 'flex', flexDirection: 'column',
        paddingTop: 'env(safe-area-inset-top)',
      }}>
        {/* Header */}
        <div style={{
          background: C.s1 + 'F0', backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${C.bdr}`,
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: C.tm,
            fontSize: '1.2rem', cursor: 'pointer', padding: '4px 8px 4px 0',
            WebkitTapHighlightColor: 'transparent',
          }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontFamily: fm, fontSize: '0.9rem', color: C.t }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: 8, background: C.acc, color: '#fff',
                  borderRadius: 10, padding: '1px 7px', fontSize: '0.6rem',
                  fontWeight: 700, fontFamily: fs,
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} disabled={markingAll} style={{
              background: 'none', border: `1px solid ${C.bdr}`, color: C.tm,
              borderRadius: 6, padding: '4px 10px', fontSize: '0.6rem',
              cursor: 'pointer', fontFamily: fs, opacity: markingAll ? 0.5 : 1,
            }}>
              Mark all read
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 'calc(60px + env(safe-area-inset-bottom))' }}>
          {loading ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: C.td, fontSize: '0.75rem' }}>
              Loading…
            </div>
          ) : !user?.id ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔔</div>
              <div style={{ color: C.t, fontWeight: 600, marginBottom: 6, fontSize: '0.85rem' }}>Sign in for notifications</div>
              <div style={{ color: C.tm, fontSize: '0.72rem' }}>Bounty responses, replies, and updates will appear here.</div>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔔</div>
              <div style={{ color: C.t, fontWeight: 600, marginBottom: 6, fontSize: '0.85rem' }}>All caught up</div>
              <div style={{ color: C.tm, fontSize: '0.72rem' }}>Bounty responses, thread replies, likes, and system alerts will appear here.</div>
            </div>
          ) : (
            <>
              {today.length > 0 && (
                <>
                  <SectionHeader label="Today" count={today.length} />
                  {today.map(n => <NotificationRow key={n.id} notif={n} onTap={markRead} />)}
                </>
              )}
              {thisWeek.length > 0 && (
                <>
                  <SectionHeader label="This Week" count={thisWeek.length} />
                  {thisWeek.map(n => <NotificationRow key={n.id} notif={n} onTap={markRead} />)}
                </>
              )}
              {earlier.length > 0 && (
                <>
                  <SectionHeader label="Earlier" count={earlier.length} />
                  {earlier.map(n => <NotificationRow key={n.id} notif={n} onTap={markRead} />)}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function useUnreadCount(user, supabase) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user?.id) { setCount(0); return }

    const fetch = async () => {
      const { count: c } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
      setCount(c || 0)
    }
    fetch()

    const channel = supabase
      .channel('notif-count')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, fetch)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, supabase])

  return count
}
