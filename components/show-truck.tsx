"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import type { GalleryImage } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

function TruckImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <Image
      src={imgSrc || "/placeholder.jpg"}
      alt={alt}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      onError={() => setImgSrc("/placeholder.jpg")}
    />
  )
}

export function ShowTruck() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchImages() {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("type", "show_truck")
        .order("display_order", { ascending: true })
      
      if (data) setImages(data)
    }
    fetchImages()
  }, [])

  return (
    <section id="show-truck" className="py-2 px-4 relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
        {/* Logo Section */}
        <div className="flex-none">
          <div className="relative group">
            <div className="absolute -inset-2 bg-primary/20 rounded-lg blur-md group-hover:bg-primary/30 transition-all duration-500" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
              <h3 className="text-white text-2xl sm:text-3xl font-black italic tracking-tighter leading-none uppercase">
                SHOW <br />
                <span className="text-gradient tracking-[0.2em] text-xl sm:text-2xl">TRUCK</span>
              </h3>
              <p className="text-white/20 text-[9px] mt-2 font-bold uppercase tracking-[0.3em] text-center">
                By Live Show
              </p>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="w-full sm:flex-1 max-w-2xl">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-2 justify-start sm:justify-center">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="flex-none w-[120px] sm:w-[150px] snap-center relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 group"
              >
                <TruckImage src={img.url} alt={`Show Truck Image ${i + 1}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
            {images.length === 0 && (
              <div className="flex-none w-full text-center py-4 border border-dashed border-white/10 rounded-lg">
                <p className="text-white/30 text-[10px] italic">Próximamente: Fotos de nuestro Show Truck</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
