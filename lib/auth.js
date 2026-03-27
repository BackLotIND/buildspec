"use client"
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let subscription;
    try {
      supabase.auth.getSession().then(({ data }) => {
        const session = data?.session;
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id)
        setLoading(false)
      }).catch(() => { setLoading(false) })

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id)
        else setProfile(null)
      })
      subscription = data?.subscription;
    } catch(e) { setLoading(false) }
    return () => { if(subscription) subscription.unsubscribe(); }
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (data) setProfile(data)
    } catch(e) {}
  }

  async function signUp(email, password, username) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { username, display_name: username } }
      })
      return { data, error }
    } catch(e) { return { error: { message: String(e) } } }
  }

  async function signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      return { data, error }
    } catch(e) { return { error: { message: String(e) } } }
  }

  async function signOut() {
    try { await supabase.auth.signOut() } catch(e) {}
    setUser(null); setProfile(null)
  }

  async function saveBuild({ title, platformId, vehicleId, makeId, parts, budget, notes, isPublic, totalCost, totalHp, totalTq }) {
    if (!user) return { error: { message: 'Not logged in' } }
    try {
      const { data, error } = await supabase.from('builds').insert({
        user_id: user.id, title, platform_id: platformId, vehicle_id: vehicleId,
        make_id: makeId, parts: JSON.stringify(parts), budget, notes: notes || '',
        is_public: isPublic || false, total_cost: totalCost, total_hp: totalHp, total_tq: totalTq,
      }).select().single()
      return { data, error }
    } catch(e) { return { error: { message: String(e) } } }
  }

  async function getMyBuilds() {
    if (!user) return { data: [] }
    try {
      const { data } = await supabase.from('builds').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
      return { data: data || [] }
    } catch(e) { return { data: [] } }
  }

  async function deleteBuild(buildId) {
    if (!user) return {}
    try { await supabase.from('builds').delete().eq('id', buildId).eq('user_id', user.id) } catch(e) {}
    return {}
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, saveBuild, getMyBuilds, deleteBuild }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
