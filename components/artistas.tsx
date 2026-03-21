"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, ChevronRight, X, ExternalLink, MessageCircle } from "lucide-react"
import { slugify } from "@/lib/utils"
import type { Artist, Category, SiteSettings } from "@/lib/types"

interface ArtistasProps {
  artists?: Artist[]
  categories?: Category[]
  settings?: SiteSettings
}

export function Artistas({ artists = [], categories = [], settings = {} }: ArtistasProps) {
  const whatsappNumber = settings.whatsapp_number || "5491131432020"

  const categoryTabs = useMemo(() => {
    if (categories.length > 0) {
      return categories.map((c) => ({ id: c.slug, label: c.name }))
    }
    const uniqueCategories = [...new Set(artists.map((a) => a.category))]
    return uniqueCategories.map((c) => ({ id: c, label: c }))
  }, [categories, artists])

  const [activeCategory, setActiveCategory] = useState(categoryTabs[0]?.id || "")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith("#artistas-")) {
        const slug = hash.replace("#artistas-", "")
        if (categoryTabs.some((c) => c.id === slug)) {
          setActiveCategory(slug)
          setSelectedIndex(null)
          
          // Smoother scroll to the section
          const element = document.getElementById("artistas")
          if (element) {
            element.scrollIntoView({ behavior: "smooth" })
          }
        }
      }
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [categoryTabs])

  const filteredArtists = useMemo(
    () => artists.filter((a) => a.category === activeCategory),
    [artists, activeCategory]
  )
  const selectedArtist = selectedIndex !== null ? filteredArtists[selectedIndex] ?? null : null

  if (artists.length === 0) return null

  return (
    <section id="artistas" className="relative py-24 overflow-hidden">
      {/* Global Continuity - Local Effects Removed */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4">
            Contratación Directa
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
            Contratación de Artistas <span className="text-gradient">Exclusivos</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Somos la productora líder en el booking y contratación de artistas para eventos en Buenos Aires y todo el país.
          </p>
          <div className="sr-only">
            <h3>Cómo contratar artistas para eventos</h3>
            <p>
              Ofrecemos gestión integral para contratar cantantes, bandas de covers, humoristas y shows en vivo. 
              Presupuestos inmediatos para contratación de artistas argentinos y booking internacional.
            </p>
          </div>
          <p className="mt-4 text-sm font-medium text-primary/80 animate-pulse">
            Hacé clic sobre un artista para ver cómo contratarlo, fotos y biografía
          </p>
        </div>

        {/* Category Tabs */}
        {categoryTabs.length > 0 && (
          <div className="flex overflow-x-auto sm:flex-wrap sm:justify-center gap-2 mb-12 pb-4 scrollbar-hide snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {categoryTabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { 
                  setActiveCategory(cat.id); 
                  setSelectedIndex(null);
                }}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 snap-start border ${
                  activeCategory === cat.id
                    ? "bg-white text-black shadow-xl shadow-white/10 border-white"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/10 backdrop-blur-md"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
          {filteredArtists.map((artist, index) => (
            <Link
              key={artist.id}
              href={`/artistas/${slugify(artist.name)}`}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.02] cursor-pointer block"
            >
              <Image
                src={(artist.image_url && artist.image_url.trim()) ? artist.image_url : "/placeholder.jpg"}
                alt={artist.name}
                fill
                className="object-contain transition-all duration-700 group-hover:scale-110 bg-black/40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {artist.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {artist.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                  VER PERFIL <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>


        {/* Selected Artist Bio Panel */}
        {selectedArtist && (
          <div className="mt-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Photos */}
              <div className="flex-shrink-0">
                <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden">
                  <Image
                    src={(selectedArtist.image_url && selectedArtist.image_url.trim()) ? selectedArtist.image_url : "/placeholder.jpg"}
                    alt={selectedArtist.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {selectedArtist.gallery.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {selectedArtist.gallery.map((photo, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden">
                        <Image src={(photo && photo.trim()) ? photo : "/placeholder.jpg"} alt={`${selectedArtist.name} foto ${i + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Data */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                      {selectedArtist.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedArtist.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(null) }}
                    className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Bio */}
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {selectedArtist.bio}
                </p>

                {/* Links */}
                {selectedArtist.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedArtist.links.map((link, i) => (
                      <Link
                        key={i}
                        href={link.url}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-border/50 bg-card hover:border-primary/50 hover:text-primary transition-all"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* WhatsApp CTA */}
                <div className="mt-5">
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                    <Link
                      href={`https://wa.me/${selectedArtist.whatsapp_number || whatsappNumber}?text=${encodeURIComponent(`Hola! Me interesa contratar a ${selectedArtist.name}`)}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Consultar por {selectedArtist.name}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 text-lg">
            ¿No encontrás el artista que buscás? Tenemos más de 500 opciones disponibles
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
            <Link href={`https://wa.me/${whatsappNumber}`} target="_blank">
              <Phone className="h-5 w-5 mr-2" />
              Consultanos por WhatsApp
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
