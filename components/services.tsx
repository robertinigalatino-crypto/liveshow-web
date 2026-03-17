"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Speaker, Lightbulb, Monitor, Truck, Mic2, Camera, Wrench, Music, Video, Wifi, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Service, GalleryImage } from "@/lib/types"

const iconMap: Record<string, LucideIcon> = {
  speaker: Speaker,
  lightbulb: Lightbulb,
  monitor: Monitor,
  truck: Truck,
  mic2: Mic2,
  camera: Camera,
  wrench: Wrench,
  music: Music,
  video: Video,
  wifi: Wifi,
}

interface ServicesProps {
  services?: Service[]
}

export function Services({ services = [] }: ServicesProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchImages() {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("type", "tecnica")
        .order("display_order", { ascending: true })
      
      if (data) setImages(data)
    }
    fetchImages()
  }, [])

  if (services.length === 0) return null

  const scrollGallery = (direction: 'left' | 'right') => {
    const el = document.getElementById('tecnica-scroll')
    if (el) {
      const scrollAmount = direction === 'left' ? -400 : 400
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section id="servicios" className="relative py-24 overflow-hidden bg-noise">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-card/50" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
            Técnica <span className="text-gradient">Profesional</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Equipamiento de primera línea y personal técnico capacitado para garantizar el éxito de tu evento
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-20">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Speaker
            return (
              <Card
                key={service.id}
                className="group bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
              >
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="relative mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                      <IconComponent className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-20 w-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Image Carousel */}
        <div className="relative mt-20 group/carousel">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="h-8 w-1 bg-primary rounded-full" />
              Equipamiento en Acción
            </h3>
            {images.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollGallery('left')}
                  className="rounded-full bg-white/5 border-white/10 hover:bg-white hover:text-black"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollGallery('right')}
                  className="rounded-full bg-white/5 border-white/10 hover:bg-white hover:text-black"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          {images.length > 0 ? (
            <div 
              id="tecnica-scroll"
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((img) => (
                <div 
                  key={img.id}
                  className="flex-none w-[280px] sm:w-[500px] aspect-[16/10] relative rounded-3xl overflow-hidden snap-center border border-white/10 shadow-2xl group/img"
                >
                  <Image
                    src={img.url}
                    alt="Equipamiento"
                    fill
                    className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
              <p className="text-muted-foreground italic">Estamos cargando fotos de nuestro equipamiento profesional...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
