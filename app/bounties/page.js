import { createClient } from '@supabase/supabase-js'
import BountiesClient from './BountiesClient'

const supabase = createClient(
  'https://mykvcojasfftliexypnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3Zjb2phc2ZmdGxpZXh5cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTA1OTEsImV4cCI6MjA4OTYyNjU5MX0.jDGPr6c0DgmOzqbODnyLpVN7nlpbljk5knvq6cz720I'
)

export const revalidate = 60

export const metadata = {
  title: 'Bounty Board — BuildSpec',
  description: 'Post a build bounty or find a part. Browse open bounties from the BuildSpec community.',
  openGraph: {
    title: 'Bounty Board — BuildSpec',
    description: 'Post a build bounty or find a part. Browse open bounties from the BuildSpec community.',
    url: 'https://thebuildspec.com/bounties',
  },
}

export default async function BountiesPage() {
  const { data: bounties } = await supabase
    .from('bounties')
    .select('*, poster:profiles!poster_id(username, display_name, location_city, location_state, is_verified_seller, reputation, completed_bounties)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  return <BountiesClient initialBounties={bounties || []} />
}
