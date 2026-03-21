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
import { Youtube, Play, Image as ImageIcon } from "lucide-react"

interface ArtistMediaCarouselProps {
  name: string
  mainImage: string
  videoUrl?: string
  gallery?: string[]
}

export function ArtistMediaCarousel({ name, mainImage, videoUrl, gallery = [] }: ArtistMediaCarouselProps) {
  const media = React.useMemo(() => {
    const items = []
    
    // Video comes first to ensure it's noticed
    if (videoUrl) {
      items.push({ type: "video", url: videoUrl })
    }
    
    items.push({ type: "image", url: mainImage })
    
    gallery.forEach(url => {
      items.push({ type: "image", url })
    })
    
    return items
  }, [mainImage, videoUrl, gallery])

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be")
  }

  const getYouTubeId = (url: string) => {
    try {
      if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0]
      return url.split("/").pop()
    } catch {
      return ""
    }
  }

  if (media.length === 0) return null

  return (
    <div className="relative group/carousel">
      <Carousel className="w-full">
        <CarouselContent>
          {media.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm">
                {item.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    {isYouTubeUrl(item.url) ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}?autoplay=0&rel=0`}
                        title="YouTube video player"
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={item.url}
                        controls
                        className="w-full h-full object-contain"
                        poster={mainImage}
                      />
                    )}
                  </div>
                ) : (
                  <Image
                    src={item.url || "/placeholder.jpg"}
                    alt={`${name} - ${index}`}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                )}
                
                {/* Media Indicator Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white/90 z-20 flex items-center gap-1.5 shadow-xl">
                  {item.type === "video" ? (
                    <><Play className="h-3 w-3 fill-primary text-primary" /> VIDEO</>
                  ) : (
                    <><ImageIcon className="h-3 w-3 text-primary" /> FOTO</>
                  )}
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
                  className={`h-1 rounded-full transition-all duration-300 ${
                    // This logic would need embla api but for now just dots
                    "w-2 bg-white/20"
                  }`} 
                />
              ))}
            </div>
          </>
        )}
      </Carousel>
    </div>
  )
}
