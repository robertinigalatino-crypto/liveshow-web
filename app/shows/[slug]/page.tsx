import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createStaticClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Ticket, Clock, ArrowLeft, MessageCircle, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Script from 'next/script'

interface Props {
  params: Promise<{ slug: string }>
}

async function getShow(slug: string) {
  const supabase = createStaticClient()
  const { data: shows } = await supabase
    .from('shows')
    .select('*')
    .eq('is_active', true)

  const show = shows?.find(s => slugify(`${s.artist} ${s.title}`) === slug)
  return show || null
}

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data: shows } = await supabase
    .from('shows')
    .select('title, artist')
    .eq('is_active', true)

  return (shows || []).map((show) => ({
    slug: slugify(`${show.artist} ${show.title}`),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const show = await getShow(slug)
  if (!show) return { title: 'Show no encontrado' }

  const title = `${show.title} - Entradas y Fecha | Live Show Producciones`
  const description = `Conseguí tus entradas para ${show.title} con ${show.artist} en ${show.venue}. Mirá la fecha, horario y toda la información del show.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [show.image_url],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [show.image_url],
    },
    alternates: {
      canonical: `/shows/${slug}`,
    },
  }
}

export default async function ShowPage({ params }: Props) {
  const { slug } = await params
  const show = await getShow(slug)
  if (!show) notFound()

  const date = new Date(show.date)
  const formattedDate = format(date, "EEEE d 'de' MMMM", { locale: es })
  const formattedTime = format(date, "HH:mm")

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: show.title,
    description: show.description,
    image: show.image_url,
    startDate: show.date,
    location: {
      '@type': 'Place',
      name: show.venue,
      address: show.venue,
    },
    offers: {
      '@type': 'Offer',
      url: show.ticket_url,
      price: show.price,
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
    },
    performer: {
      '@type': 'Person',
      name: show.artist,
    },
  }

  return (
    <main className="min-h-screen bg-black text-white relative">
      <Script
        id={`json-ld-show-${show.id}`}
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
          href="/#shows" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver a Shows
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Main Image */}
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={show.image_url || "/placeholder.jpg"}
              alt={show.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-8 bg-primary/50" />
                <span className="text-primary text-xs font-bold uppercase tracking-widest">{show.artist}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                {show.title}
              </h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Fecha</p>
                    <p className="text-sm font-bold capitalize">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Horario</p>
                    <p className="text-sm font-bold">{formattedTime} hs</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 sm:col-span-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Lugar</p>
                    <p className="text-sm font-bold">{show.venue}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="h-6 w-1 bg-primary rounded-full" />
                Detalles del Evento
              </h2>
              <p className="text-white/70 leading-relaxed whitespace-pre-line text-lg">
                {show.description || `No hay descripción disponible para este show.`}
              </p>
            </div>

            {/* CTA Box */}
            <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20 backdrop-blur-md space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Ticket className="h-24 w-24 rotate-12" />
              </div>
              
              <div className="relative z-10">
                <h3 className="font-bold text-2xl text-white mb-2 flex items-center gap-2">
                  Entradas Disponibles
                </h3>
                <p className="text-primary text-3xl font-black mb-6">{show.price}</p>
                
                <div className="flex flex-col gap-4">
                  <Button asChild className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xl shadow-lg shadow-primary/25">
                    <Link href={show.ticket_url}>
                      <Ticket className="h-5 w-5 mr-2" />
                      Comprar Entradas
                    </Link>
                  </Button>
                  
                  <p className="text-center text-white/40 text-xs">
                    * Serás redirigido a la ticketera oficial para completar tu compra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
