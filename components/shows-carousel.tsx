"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Ticket, Share2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Show } from "@/lib/types"

import { slugify } from "@/lib/utils"

interface ShowsCarouselProps {
  shows?: Show[]
}

export function ShowsCarousel({ shows = [] }: ShowsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const displayShows = shows

  useEffect(() => {
    if (!isAutoPlaying || displayShows.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayShows.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, displayShows.length])

  if (displayShows.length === 0) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: format(date, "d"),
      month: format(date, "MMM", { locale: es }).toUpperCase(),
    }
  }

  return (
    <section id="shows" className="relative pt-0 pb-6 overflow-hidden">
      {/* Global Continuity - Local Effects Removed */}
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-4 sm:mb-6 text-center sm:text-left">
          <h2 className="mt-2 text-white text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-balance">
            Próximos <span className="text-gradient">shows</span>
          </h2>
        </div>

        {/* Shows Carousel (Top) */}
        <div className="relative group/thumbnails">
          {/* Navigation Buttons for Thumbnails */}
          <button
            onClick={() => {
              const el = document.getElementById('thumbnail-scroll');
              if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
            }}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all opacity-0 group-hover/thumbnails:opacity-100 hidden sm:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => {
              const el = document.getElementById('thumbnail-scroll');
              if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
            }}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all opacity-0 group-hover/thumbnails:opacity-100 hidden sm:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Scrollable Container */}
          <div 
            id="thumbnail-scroll"
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pt-4 pb-2 px-4 sm:px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayShows.map((show, index) => {
              const showDate = formatDate(show.date)
              const isActive = index === currentIndex
              const showSlug = slugify(show.title)

              return (
                <div 
                  key={show.id} 
                  className="flex-none w-[200px] sm:w-[240px] snap-center group flex flex-col gap-3"
                >
                  <Link
                    href={`/shows/${showSlug}`}
                    onClick={() => {
                      setIsAutoPlaying(false)
                      setCurrentIndex(index)
                    }}
                    className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden transition-all duration-500 block ${
                      isActive 
                        ? "ring-4 ring-primary ring-offset-4 ring-offset-black scale-[1.02] shadow-[0_0_50px_rgba(220,38,38,0.4)]" 
                        : "opacity-80 hover:opacity-100 hover:scale-[1.05]"
                    }`}
                  >
                    <Image
                      src={(show.image_url && show.image_url.trim()) ? show.image_url : "/placeholder.jpg"}
                      alt={show.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Date Overlay */}
                    <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase tracking-tight z-10">
                      {showDate.day} {showDate.month}
                    </div>

                    {/* Buy Ticket Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-20">
                      <div className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                        <Share2 className="h-4 w-4" />
                        Ver Info & Comprar
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0" />
                  </Link>

                  <div className="text-center px-1">
                    <h4 className={`text-sm sm:text-base font-black uppercase tracking-tight transition-colors truncate ${isActive ? 'text-primary' : 'text-white'}`}>
                      {show.artist}
                    </h4>
                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest truncate">
                      {show.venue}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
