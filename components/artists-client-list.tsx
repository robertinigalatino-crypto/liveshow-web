"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { slugify } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, Tag } from "lucide-react"
import type { Artist } from "@/lib/types"

interface ArtistsClientListProps {
  artists: Artist[]
  whatsappNumber: string
}

export function ArtistsClientList({ artists, whatsappNumber }: ArtistsClientListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const categories = useMemo(() => {
    const cats = new Set(artists.map((a) => a.category))
    return Array.from(cats).sort()
  }, [artists])

  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      const matchesSearch =
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = activeCategory === "all" ? true : artist.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [artists, searchQuery, activeCategory])

  return (
    <div className="space-y-12">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="relative w-full md:w-96 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por nombre, género..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
          />
        </div>
        
        <div className="flex overflow-x-auto w-full gap-2 pb-2 md:pb-0 scrollbar-hide snap-x">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap snap-start border ${
              activeCategory === "all"
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/10"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap snap-start border ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredArtists.length === 0 ? (
        <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-white/60 text-lg">No se encontraron artistas que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtists.map((artist) => (
            <article key={artist.id} className="bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col group hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
              <div className="relative aspect-[4/3] w-full bg-black/40 overflow-hidden">
                <Link href={`/artistas/${slugify(artist.name)}`}>
                  <Image
                    src={artist.image_url || '/placeholder.jpg'}
                    alt={`Foto de ${artist.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60 pointer-events-none" />
                </Link>
                <div className="absolute top-3 left-3 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {artist.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-xl font-bold mb-2 line-clamp-1">
                  <Link href={`/artistas/${slugify(artist.name)}`} className="hover:text-primary transition-colors">
                    {artist.name}
                  </Link>
                </h2>
                
                <div className="flex flex-wrap gap-1.5 mb-3 h-6 overflow-hidden">
                  {artist.tags.map((tag: string, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[10px] text-white/60 px-1.5 py-0.5 bg-white/5 rounded border border-white/10 whitespace-nowrap">
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <p className="text-white/60 text-sm leading-relaxed line-clamp-4 mb-6 flex-1" title={artist.bio}>
                  {artist.bio}
                </p>
                
                <div className="flex gap-2 mt-auto pt-4 border-t border-white/10">
                  <Button asChild className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm h-11">
                    <Link
                      href={`https://wa.me/${artist.whatsapp_number || whatsappNumber}?text=${encodeURIComponent(`Hola! Me interesa contratar a ${artist.name}`)}`}
                      target="_blank"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Consultar
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="px-4 rounded-xl border-white/20 hover:bg-white/10 h-11">
                    <Link href={`/artistas/${slugify(artist.name)}`} aria-label={`Ver perfil de ${artist.name}`}>
                      Ver más
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
