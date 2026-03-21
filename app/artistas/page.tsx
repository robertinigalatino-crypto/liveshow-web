import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { ArtistsClientList } from '@/components/artists-client-list'

export const metadata: Metadata = {
  title: 'Catálogo de Artistas para Contratar | Live Show Producciones',
  description: 'Conocé nuestro catálogo completo de artistas, bandas, músicos y humoristas para eventos. Consultá precios, disponibilidad y presupuestos. Booking directo en Argentina.',
  keywords: [
    'contratar artistas', 'booking de bandas', 'shows para eventos', 
    'artistas para fiestas', 'contrataciones de cantantes', 'shows en vivo',
    'productores de eventos', 'manager de artistas argentina', 'presupuesto artistas',
    'contratar cumbia', 'contratar rock', 'bandas de covers'
  ],
  openGraph: {
    title: 'Catálogo de Artistas para Eventos | Live Show Producciones',
    description: 'Encontrá la banda o artista ideal para tu fiesta o evento corporativo. Booking directo, técnica integral y producción.',
    url: 'https://liveshowproducciones.com.ar/artistas',
    siteName: 'Live Show Producciones',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Catálogo de Artistas - Live Show Producciones',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo de Artistas para Eventos | Live Show Producciones',
    description: 'Booking directo de artistas y bandas para eventos.',
    images: ['/logo.png'],
  },
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
    '@type': 'CollectionPage',
    name: 'Catálogo de Artistas Exclusivos - Live Show Producciones',
    description: 'Catálogo completo de artistas, bandas, músicos y humoristas disponibles para contratación en Argentina.',
    url: 'https://liveshowproducciones.com.ar/artistas',
    mainEntity: {
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
        
        {/* Hidden SEO Keywords for Search Engines */}
        <section className="mt-24 pt-12 border-t border-white/5 opacity-50 sm:opacity-30 hover:opacity-100 transition-opacity">
          <h2 className="text-xs uppercase tracking-widest text-primary mb-4 font-bold">Información para Contrataciones y Booking</h2>
          <div className="text-[11px] leading-relaxed text-white/50 columns-1 sm:columns-2 lg:columns-3 gap-8 text-justify">
            <p className="mb-4">
              En Live Show Producciones somos especialistas en la <strong>contratación de artistas</strong>, <strong>booking de bandas</strong> y gestión de talentos para todo tipo de eventos. Ya sea que estés organizando una <strong>fiesta de fin de año corporativa</strong>, un <strong>casamiento</strong>, un <strong>festival municipal</strong> o una celebración privada, nuestro catálogo cuenta con las mentes creativas y las voces más buscadas de la escena actual en Argentina.
            </p>
            <p className="mb-4">
              Solicitá presupuesto directo y sin intermediarios para <strong>shows de cumbia</strong>, <strong>bandas de rock nacional</strong>, <strong>artistas de trap y música urbana</strong>, <strong>humoristas y stand up</strong>. Brindamos asesoramiento completo desde la selección del artista hasta la <strong>producción técnica integral</strong>, incluyendo sonido, pantallas LED e iluminación profesional.
            </p>
            <p>
              Términos frecuentes de búsqueda: <em>contratar a {artists[0]?.name || "artistas"}</em>, <em>precio de shows en vivo</em>, <em>booking manager argentina</em>, <em>agencias de contratación de cantantes</em>, <em>shows para casamientos</em>. Trabajamos en Capital Federal, Gran Buenos Aires y el resto de la República Argentina, llevando el mejor entretenimiento a tu escenario.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
