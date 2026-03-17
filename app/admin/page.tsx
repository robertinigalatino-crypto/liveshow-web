"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LogOut, Eye, ArrowLeft, Calendar, Users, Radio, Wrench, Tag, Settings, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Show, Artist, Channel, Service, Category, SiteSettings, GalleryImage } from "@/lib/types"
import { ShowsAdmin } from "@/components/admin/shows-admin"
import { ArtistsAdmin } from "@/components/admin/artists-admin"
import { ChannelsAdmin } from "@/components/admin/channels-admin"
import { ServicesAdmin } from "@/components/admin/services-admin"
import { CategoriesAdmin } from "@/components/admin/categories-admin"
import { SettingsAdmin } from "@/components/admin/settings-admin"
import { GalleryAdmin } from "@/components/admin/gallery-admin"

type TabId = "shows" | "artists" | "channels" | "services" | "categories" | "show_truck" | "tecnica" | "settings"

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "shows", label: "Shows", icon: Calendar },
  { id: "artists", label: "Artistas", icon: Users },
  { id: "channels", label: "Canales", icon: Radio },
  { id: "services", label: "Servicios", icon: Wrench },
  { id: "categories", label: "Categorías", icon: Tag },
  { id: "show_truck", label: "Show Truck", icon: Truck },
  { id: "tecnica", label: "Técnica", icon: Wrench },
  { id: "settings", label: "Configuración", icon: Settings },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("shows")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")

  const [shows, setShows] = useState<Show[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [settings, setSettings] = useState<SiteSettings>({})

  const supabase = createClient()

  const fetchAll = useCallback(async () => {
    const [showsRes, artistsRes, channelsRes, servicesRes, categoriesRes, galleryImagesRes, settingsRes] = await Promise.all([
      supabase.from("shows").select("*").order("date", { ascending: true }),
      supabase.from("artists").select("*").order("display_order", { ascending: true }),
      supabase.from("channels").select("*").order("display_order", { ascending: true }),
      supabase.from("services").select("*").order("display_order", { ascending: true }),
      supabase.from("categories").select("*").order("display_order", { ascending: true }),
      supabase.from("gallery_images").select("*").order("display_order", { ascending: true }),
      supabase.from("site_settings").select("*"),
    ])

    if (showsRes.data) setShows(showsRes.data)
    if (artistsRes.data) setArtists(artistsRes.data)
    if (channelsRes.data) setChannels(channelsRes.data)
    if (servicesRes.data) setServices(servicesRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    if (galleryImagesRes.data) setGalleryImages(galleryImagesRes.data)
    if (settingsRes.data) {
      const s: SiteSettings = {}
      for (const row of settingsRes.data) s[row.key] = row.value
      setSettings(s)
    }
  }, [supabase])

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setIsLoading(false)
      if (user) fetchAll()
    }
    checkAuth()
  }, [supabase, fetchAll])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthError(error.message)
    } else {
      setIsAuthenticated(true)
      fetchAll()
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center">
            <Image src="/logo.png" alt="Logo" width={150} height={50} className="h-12 w-auto mx-auto mb-4" />
            <CardTitle className="font-serif text-2xl">Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{authError}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@email.com" required className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="bg-background/50" />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Iniciar Sesion</Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="inline h-4 w-4 mr-1" /> Volver al sitio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const countForTab = (id: TabId) => {
    switch (id) {
      case "shows": return shows.length
      case "artists": return artists.length
      case "channels": return channels.length
      case "services": return services.length
      case "categories": return categories.length
      case "show_truck": return galleryImages.filter(img => img.type === "show_truck").length
      case "tecnica": return galleryImages.filter(img => img.type === "tecnica").length
      default: return 0
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Logo" width={120} height={40} className="h-8 w-auto" />
              <span className="text-sm font-semibold text-primary">Admin Panel</span>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/" target="_blank"><Eye className="h-4 w-4 mr-2" />Ver Sitio</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-2 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const count = countForTab(tab.id)
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-card"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {count > 0 && (
                    <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "shows" && <ShowsAdmin shows={shows} onRefresh={fetchAll} />}
        {activeTab === "artists" && <ArtistsAdmin artists={artists} categories={categories} onRefresh={fetchAll} />}
        {activeTab === "channels" && <ChannelsAdmin channels={channels} onRefresh={fetchAll} />}
        {activeTab === "services" && <ServicesAdmin services={services} onRefresh={fetchAll} />}
        {activeTab === "categories" && <CategoriesAdmin categories={categories} onRefresh={fetchAll} />}
        {activeTab === "show_truck" && (
          <GalleryAdmin 
            images={galleryImages.filter(img => img.type === "show_truck")} 
            type="show_truck" 
            title="Galería Show Truck" 
            description="Gestiona las fotos del Show Truck" 
            onRefresh={fetchAll} 
          />
        )}
        {activeTab === "tecnica" && (
          <GalleryAdmin 
            images={galleryImages.filter(img => img.type === "tecnica")} 
            type="tecnica" 
            title="Galería Técnica" 
            description="Gestiona las fotos de equipamiento técnico" 
            onRefresh={fetchAll} 
          />
        )}
        {activeTab === "settings" && <SettingsAdmin settings={settings} onRefresh={fetchAll} />}
      </main>
    </div>
  )
}
