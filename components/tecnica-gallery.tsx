"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { GalleryImage } from "@/lib/types"

export function TecnicaGallery() {
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


  return (
    <section id="tecnica" className="py-24 relative overflow-hidden bg-noise">
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-card/50" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
            Técnica para <span className="text-gradient">tu show</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Equipamiento de última generación para eventos inolvidables
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl group"
            >
              <Image
                src={img.url}
                alt="Equipamiento Técnico"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
        
        {images.length === 0 && (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
             <p className="text-muted-foreground italic">Próximamente: Fotos de nuestro equipamiento profesional</p>
          </div>
        )}
      </div>
    </section>
  )
}
