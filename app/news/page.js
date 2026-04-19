import { createClient } from '@supabase/supabase-js'
import NewsClient from './NewsClient'

const supabase = createClient(
  'https://mykvcojasfftliexypnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3Zjb2phc2ZmdGxpZXh5cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTA1OTEsImV4cCI6MjA4OTYyNjU5MX0.jDGPr6c0DgmOzqbODnyLpVN7nlpbljk5knvq6cz720I'
)

export const revalidate = 60

export const metadata = {
  title: 'News — BuildSpec',
  description: 'Market watch, industry news, hidden gems, price alerts, and RIPs from the BuildSpec team.',
  openGraph: {
    title: 'News — BuildSpec',
    description: 'Market watch, industry news, hidden gems, price alerts, and RIPs from the BuildSpec team.',
    url: 'https://thebuildspec.com/news',
  },
}

export default async function NewsPage() {
  const { data: articles } = await supabase
    .from('news_feed')
    .select('id,slug,title,subtitle,content,category,is_pinned,author,like_count,tags,created_at')
    .eq('is_published', true)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  return <NewsClient initialArticles={articles || []} />
}
