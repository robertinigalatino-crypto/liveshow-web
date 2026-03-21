"use client"

import * as React from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ImageIcon } from "lucide-react"

interface ArtistMediaCarouselProps {
  name: string
  mainImage: string
  gallery?: string[]
}

export function ArtistMediaCarousel({ name, mainImage, gallery = [] }: ArtistMediaCarouselProps) {
  const media = React.useMemo(() => {
    const items = [mainImage, ...gallery]
    return items.filter(Boolean)
  }, [mainImage, gallery])

  if (media.length === 0) return null

  return (
    <div className="relative group/carousel">
      <Carousel className="w-full">
        <CarouselContent>
          {media.map((url, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm">
                <Image
                  src={url || "/placeholder.jpg"}
                  alt={`${name} - ${index}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
                
                {/* Media Indicator Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white/90 z-20 flex items-center gap-1.5 shadow-xl">
                  <ImageIcon className="h-3 w-3 text-primary" /> FOTO {index + 1}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {media.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/40 to-transparent pointer-events-none rounded-l-3xl" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/40 to-transparent pointer-events-none rounded-r-3xl" />
            
            <CarouselPrevious className="left-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-black/60 border-white/20 hover:bg-primary hover:border-primary text-white size-10" />
            <CarouselNext className="right-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-black/60 border-white/20 hover:bg-primary hover:border-primary text-white size-10" />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              {media.map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 h-1 rounded-full bg-white/20"
                />
              ))}
            </div>
          </>
        )}
      </Carousel>
    </div>
  )
}
