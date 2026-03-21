"use client"
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({
  user: null, profile: null, loading: false,
  signUp: async()=>({error:'Not ready'}), signIn: async()=>({error:'Not ready'}), signOut: async()=>{},
  saveBuild: async()=>({error:'Not ready'}), getMyBuilds: async()=>({data:[]}), deleteBuild: async()=>({}), updateBuild: async()=>({}), uploadBuildImage: async()=>({})
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id)
        setLoading(false)
        setReady(true)
      }).catch(()=>{ setLoading(false); setReady(true); })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id)
        else setProfile(null)
      })

      return () => subscription.unsubscribe()
    } catch(e) {
      console.error('Auth init error:', e)
      setLoading(false)
      setReady(true)
    }
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
  }

  async function signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, display_name: username } }
    })
    return { data, error }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  async function saveBuild({ title, platformId, vehicleId, makeId, parts, budget, notes, isPublic, totalCost, totalHp, totalTq }) {
    if (!user) return { error: 'Not logged in' }
    const { data, error } = await supabase
      .from('builds')
      .insert({
        user_id: user.id,
        title,
        platform_id: platformId,
        vehicle_id: vehicleId,
        make_id: makeId,
        parts: JSON.stringify(parts),
        budget,
        notes,
        is_public: isPublic || false,
        total_cost: totalCost,
        total_hp: totalHp,
        total_tq: totalTq,
      })
      .select()
      .single()
    return { data, error }
  }

  async function getMyBuilds() {
    if (!user) return { data: [], error: 'Not logged in' }
    const { data, error } = await supabase
      .from('builds')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    return { data: data || [], error }
  }

  async function deleteBuild(buildId) {
    if (!user) return { error: 'Not logged in' }
    const { error } = await supabase
      .from('builds')
      .delete()
      .eq('id', buildId)
      .eq('user_id', user.id)
    return { error }
  }

  async function updateBuild(buildId, updates) {
    if (!user) return { error: 'Not logged in' }
    const { data, error } = await supabase
      .from('builds')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', buildId)
      .eq('user_id', user.id)
      .select()
      .single()
    return { data, error }
  }

  async function uploadBuildImage(buildId, file) {
    if (!user) return { error: 'Not logged in' }
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${buildId}/${Date.now()}.${ext}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('build-images')
      .upload(path, file)
    
    if (uploadError) return { error: uploadError }
    
    const { data: { publicUrl } } = supabase.storage
      .from('build-images')
      .getPublicUrl(path)

    const { data, error } = await supabase
      .from('build_images')
      .insert({ build_id: buildId, user_id: user.id, url: publicUrl })
      .select()
      .single()
    
    return { data: { ...data, url: publicUrl }, error }
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signUp, signIn, signOut,
      saveBuild, getMyBuilds, deleteBuild, updateBuild, uploadBuildImage,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
