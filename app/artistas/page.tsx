import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { ArtistsClientList } from '@/components/artists-client-list'

export const metadata: Metadata = {
  title: 'Catálogo de Artistas | Live Show Producciones',
  description: 'Conocé a todos los artistas, bandas, músicos y humoristas que podés contratar para tu evento. Biografías, información y contacto directo.',
  alternates: {
    canonical: '/artistas',
  },
}

export default async function ArtistasPage() {
  const supabase = await createClient()
  
  const { data: artists } = await supabase
    .from('artists')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*')
  
  const settings = settingsData?.reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {} as Record<string, string>) || {}

  const whatsappNumber = settings.whatsapp_number || '5491131432020'

  if (!artists) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: artists.map((artist, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': artist.category.toLowerCase().includes('banda') ? 'MusicGroup' : 'Person',
        name: artist.name,
        description: artist.bio,
        image: artist.image_url,
        url: `https://liveshowproducciones.com.ar/artistas/${slugify(artist.name)}`,
      }
    }))
  }

  return (
    <main className="min-h-screen bg-black text-white relative py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh bg-noise opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Link 
            href="/#artistas" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al Inicio
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-6">
            Catálogo de <span className="text-primary text-gradient">Artistas</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
            Explorá nuestro catálogo con opciones para todos los presupuestos. Utilizá los filtros para encontrar el show ideal para tu evento corporativo, fiesta privada o festival.
          </p>
        </div>

        <ArtistsClientList artists={artists} whatsappNumber={whatsappNumber} />
      </div>
    </main>
  )
}
