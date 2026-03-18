// import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ShowTruck } from "@/components/show-truck"
import { ShowsCarousel } from "@/components/shows-carousel"
import { ShowsGrid } from "@/components/shows-grid"
import { Services } from "@/components/services"
import { Artistas } from "@/components/artistas"
import { LiveChannels } from "@/components/live-channels"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import type { Show, Artist, Channel, Service, Category, SiteSettings } from "@/lib/types"

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

async function getArtists(): Promise<Artist[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("artists")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    if (error) { console.error("Error fetching artists:", error); return [] }
    return data || []
  } catch { return [] }
}

async function getChannels(): Promise<Channel[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    if (error) { console.error("Error fetching channels:", error); return [] }
    return data || []
  } catch { return [] }
}

async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    if (error) { console.error("Error fetching services:", error); return [] }
    return data || []
  } catch { return [] }
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

export default async function Home() {
  const [shows, artists, channels, services, categories, settings] = await Promise.all([
    getShows(),
    getArtists(),
    getChannels(),
    getServices(),
    getCategories(),
    getSiteSettings(),
  ])

  const featuredShows = shows.filter((s) => s.is_featured)
  
  return (
    <main className="min-h-screen bg-black overflow-x-hidden relative">
      {/* Global Background Continuity Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh bg-noise opacity-100 animate-mesh" />
        <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-primary/5 rounded-full blur-[150px] animate-spotlight-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-primary/3 rounded-full blur-[180px] animate-spotlight-slow [animation-delay:-5s]" />
        <div className="absolute top-[20%] right-[-15%] w-[60%] h-[60%] bg-primary/2 rounded-full blur-[200px] animate-spotlight-slow [animation-delay:-12s]" />
      </div>

      <div className="relative z-10">
        <Hero categories={categories} settings={settings} />
        <ShowsCarousel shows={featuredShows} />
        <ShowTruck />
        <Services services={services} />
        <Artistas artists={artists} categories={categories} settings={settings} />
        <LiveChannels channels={channels} />
        <Contact settings={settings} />
        <Footer categories={categories} settings={settings} />
      </div>
    </main>
  )
}
