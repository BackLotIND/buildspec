import { createClient } from '@supabase/supabase-js'
import CommunityClient from './CommunityClient'

const supabase = createClient(
  'https://mykvcojasfftliexypnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3Zjb2phc2ZmdGxpZXh5cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTA1OTEsImV4cCI6MjA4OTYyNjU5MX0.jDGPr6c0DgmOzqbODnyLpVN7nlpbljk5knvq6cz720I'
)

export const revalidate = 60

export const metadata = {
  title: 'Community — BuildSpec',
  description: 'Build threads, swap logs, and mod journals from the BuildSpec community.',
  openGraph: {
    title: 'Community — BuildSpec',
    description: 'Build threads, swap logs, and mod journals from the BuildSpec community.',
    url: 'https://thebuildspec.com/community',
  },
}

export default async function CommunityPage() {
  const { data: threads } = await supabase
    .from('build_threads')
    .select('*, author:profiles!user_id(username, display_name, location_city, location_state, is_verified_seller, reputation, completed_bounties, subscription_tier)')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100)

  return <CommunityClient initialThreads={threads || []} />
}
