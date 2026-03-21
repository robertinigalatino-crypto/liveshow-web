import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://liveshowproducciones.com.ar'
  
  const supabase = createStaticClient()
  const { data: artists } = await supabase
    .from('artists')
    .select('name')
    .eq('is_active', true)

  const artistUrls = (artists || []).map((artist) => ({
    url: `${baseUrl}/artistas/${slugify(artist.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const { data: shows } = await supabase
    .from('shows')
    .select('title, artist')
    .eq('is_active', true)

  const showUrls = (shows || []).map((show) => ({
    url: `${baseUrl}/shows/${slugify(`${show.artist} ${show.title}`)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/artistas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...artistUrls,
    ...showUrls,
  ]
}
