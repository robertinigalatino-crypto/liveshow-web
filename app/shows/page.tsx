import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Ticket } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ShowsGrid } from '@/components/shows-grid'
import { Footer } from '@/components/footer'
import type { Show, Category, SiteSettings } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Próximos Shows | Live Show Producciones',
  description: 'Consulta todos los próximos shows y eventos. Comprá tus entradas de forma segura.',
}

async function getShows(): Promise<Show[]> {
  try {
    const supabase = await createClient()
    const { data: shows, error } = await supabase
      .from("shows")
      .select("*")
      .eq("is_active", true)
      .order("date", { ascending: true })
    
    if (error) {
      console.error("Error fetching shows:", error)
      return []
    }
    
    return shows || []
  } catch (error) {
    console.error("Error:", error)
    return []
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    if (error) { console.error("Error fetching categories:", error); return [] }
    return data || []
  } catch { return [] }
}

async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
    if (error) { console.error("Error fetching site settings:", error); return {} }
    const settings: SiteSettings = {}
    if (data) {
      for (const row of data) {
        settings[row.key] = row.value
      }
    }
    return settings
  } catch { return {} }
}

export default async function ShowsPage() {
  const [shows, categories, settings] = await Promise.all([
    getShows(),
    getCategories(),
    getSiteSettings(),
  ])

  return (
    <main className="min-h-screen bg-black text-white relative flex flex-col">
      {/* Global Background Continuity Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh bg-noise opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="relative z-10 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-12 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al Inicio
          </Link>

          <header className="mb-16 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <span className="h-px w-12 bg-primary/50" />
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Cartelera Completa</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Todos los <span className="text-gradient">Shows</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto lg:mx-0">
              Explorá nuestra agenda completa de eventos y asegurá tu lugar en los mejores espectáculos.
            </p>
          </header>

          <ShowsGrid shows={shows} hideHeader={true} />
        </div>
      </div>

      <Footer categories={categories} settings={settings} />
    </main>
  )
}
