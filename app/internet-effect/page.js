import { createClient } from '@supabase/supabase-js'
import InternetEffectClient from './InternetEffectClient'

const supabase = createClient(
  'https://mykvcojasfftliexypnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3Zjb2phc2ZmdGxpZXh5cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTA1OTEsImV4cCI6MjA4OTYyNjU5MX0.jDGPr6c0DgmOzqbODnyLpVN7nlpbljk5knvq6cz720I'
)

export const revalidate = 3600

export const metadata = {
  title: 'The Internet Effect — BuildSpec',
  description: 'What the internet did to car prices. Before and after YouTubers discovered your favorite cheap car.',
  openGraph: {
    title: 'The Internet Effect — BuildSpec',
    description: 'The Honda S2000 was $8k in 2018. Now it\'s $22k. The internet found it. You\'re welcome.',
    url: 'https://thebuildspec.com/internet-effect',
  },
}

export default async function InternetEffectPage() {
  const { data: entries } = await supabase
    .from('internet_effect')
    .select('*')
    .order('severity', { ascending: false })

  return <InternetEffectClient entries={entries || []} />
}
