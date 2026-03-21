import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient, createStaticClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Phone, ArrowLeft, MessageCircle, ExternalLink, Tag, Instagram, Twitter, Youtube, Facebook, Music2, Play } from 'lucide-react'
import { ArtistMediaCarousel } from '@/components/artist-media-carousel'
import Script from 'next/script'

interface Props {
  params: Promise<{ slug: string }>
}

async function getArtist(slug: string) {
  const supabase = createStaticClient()
  const { data: artists } = await supabase
    .from('artists')
    .select('*')
    .eq('is_active', true)

  const artist = artists?.find(a => slugify(a.name) === slug)
  return artist || null
}

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data: artists } = await supabase
    .from('artists')
    .select('name')
    .eq('is_active', true)

  return (artists || []).map((artist) => ({
    slug: slugify(artist.name),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artist = await getArtist(slug)
  if (!artist) return { title: 'Artista no encontrado' }

  const title = `¿Cómo contratar a ${artist.name}? | Booking y Presupuesto`
  const description = `¿Buscás contratar a ${artist.name}? Consultá precios, disponibilidad y presupuestos para shows y eventos en Buenos Aires con Live Show Producciones.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [artist.image_url],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [artist.image_url],
    },
    alternates: {
      canonical: `/artistas/${slug}`,
    },
  }
}

const getSocialIcon = (label: string) => {
  const l = label.toLowerCase()
  if (l.includes('instagram')) return Instagram
  if (l.includes('spotify')) return Music2
  if (l.includes('youtube')) return Youtube
  if (l.includes('twitter') || l.includes('x')) return Twitter
  if (l.includes('facebook')) return Facebook
  return ExternalLink
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params
  const artist = await getArtist(slug)
  if (!artist) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': artist.category.toLowerCase().includes('banda') ? 'MusicGroup' : 'Person',
    name: artist.name,
    description: artist.bio,
    image: artist.image_url,
    url: `https://liveshowproducciones.com.ar/artistas/${slug}`,
    jobTitle: artist.category,
    knowsAbout: artist.tags,
  }

  return (
    <main className="min-h-screen bg-black text-white relative">
      <Script
        id={`json-ld-artist-${artist.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Background with Continuity */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh bg-noise opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-24">
        <Link 
          href="/#artistas" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver a Artistas
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Media Carousel */}
          <ArtistMediaCarousel
            name={artist.name}
            mainImage={artist.image_url}
            gallery={artist.gallery}
          />

          {/* Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
                  {artist.category}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-8 bg-primary/50" />
                <span className="text-primary text-xs font-bold uppercase tracking-widest">Contratar a</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                {artist.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                {artist.tags.map((tag: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs text-white/60 px-2 py-1 bg-white/5 rounded-md border border-white/10">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="h-6 w-1 bg-primary rounded-full" />
                Biografía
              </h2>
              <p className="text-white/70 leading-relaxed whitespace-pre-line text-lg">
                {artist.bio}
              </p>
            </div>

            {/* Video Section */}
            {artist.video_url && (
              <div className="space-y-4 pt-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                  <Play className="h-5 w-5 fill-primary" />
                  Video Promocional
                </h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm">
                  {artist.video_url.includes("youtube.com") || artist.video_url.includes("youtu.be") ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${
                        artist.video_url.includes("watch?v=") 
                          ? artist.video_url.split("watch?v=")[1].split("&")[0] 
                          : artist.video_url.split("/").pop()
                      }`}
                      title="YouTube video player"
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={artist.video_url}
                      controls
                      className="w-full h-full object-contain"
                      poster={artist.image_url}
                    />
                  )}
                </div>
              </div>
            )}

            {/* CTA Box */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
              <h3 className="font-bold text-xl text-primary flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                ¿Querés contratar a {artist.name}?
              </h3>
              <p className="text-white/60 text-sm">Somos especialistas en booking y producción técnica. Consultá presupuesto para eventos corporativos, fiestas privadas y festivales.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg">
                  <Link
                    href={`https://wa.me/${artist.whatsapp_number || '5491131432020'}?text=${encodeURIComponent(`Hola! Me interesa contratar a ${artist.name}`)}`}
                    target="_blank"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Consultar Ahora
                  </Link>
                </Button>
                {artist.links.length > 0 && (
                  <div className="flex gap-2">
                    {artist.links.map((link: { label: string, url: string }, i: number) => {
                      const Icon = getSocialIcon(link.label)
                      return (
                        <Link
                          key={i}
                          href={link.url}
                          target="_blank"
                          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/link"
                          title={link.label}
                        >
                          <Icon className="h-5 w-5 text-white/60 group-hover/link:text-primary transition-colors" />
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden SEO Keywords for Search Engines */}
        <section className="mt-24 pt-12 border-t border-white/5 opacity-20 pointer-events-none select-none">
          <h4 className="text-[10px] uppercase tracking-widest mb-4">Información de Contrataciones</h4>
          <p className="text-[10px] space-x-2 leading-loose">
            <span>Contrataciones de {artist.name}</span>
            <span>-</span>
            <span>{artist.name} Booking Argentina</span>
            <span>-</span>
            <span>Contratar a {artist.name} para eventos</span>
            <span>-</span>
            <span>Presupuesto {artist.name}</span>
            <span>-</span>
            <span>{artist.name} Productora Buenos Aires</span>
            <span>-</span>
            <span>Booking directo {artist.name}</span>
            <span>-</span>
            <span>Shows de {artist.name} 2024 2025</span>
          </p>
        </section>
      </div>
    </main>
  )
}
