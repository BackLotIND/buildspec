import { createClient } from '@supabase/supabase-js'
import BuyPageClient from './BuyPageClient'

const supabase = createClient(
  'https://mykvcojasfftliexypnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3Zjb2phc2ZmdGxpZXh5cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTA1OTEsImV4cCI6MjA4OTYyNjU5MX0.jDGPr6c0DgmOzqbODnyLpVN7nlpbljk5knvq6cz720I'
)

export const revalidate = 3600

export const metadata = {
  title: 'Should You Buy? — BuildSpec',
  description: 'Honest verdicts on every enthusiast platform. Cope levels, fair prices, reality checks. No fluff.',
  openGraph: {
    title: 'Should You Buy? — BuildSpec',
    description: 'Drift taxed. Unobtainium. Actually worth it. Find out where your dream car lands.',
    url: 'https://thebuildspec.com/buy',
  },
}

export default async function BuyPage() {
  const { data: verdicts } = await supabase
    .from('buying_verdicts')
    .select('*')
    .order('cope_level', { ascending: false })

  return <BuyPageClient verdicts={verdicts || []} />
}
