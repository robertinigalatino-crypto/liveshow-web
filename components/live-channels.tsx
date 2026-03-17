"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Radio, ExternalLink } from "lucide-react"
import type { Channel } from "@/lib/types"

interface LiveChannelsProps {
  channels?: Channel[]
}

export function LiveChannels({ channels = [] }: LiveChannelsProps) {

  return (
    <section id="en-vivo" className="relative py-20 overflow-hidden bg-noise">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4">
            <Radio className="h-4 w-4 animate-pulse" />
            Canales en Vivo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Mirá en <span className="text-gradient">Vivo</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Los canales de streaming más populares de Argentina
          </p>
          <p className="mt-2 text-sm font-medium text-primary/80 animate-pulse">
            Hacé clic en el canal para comenzar a ver el streaming
          </p>
        </div>

        {/* Channels Grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 ${channels.length >= 5 ? 'md:grid-cols-5' : channels.length === 4 ? 'md:grid-cols-4' : channels.length === 3 ? 'md:grid-cols-3' : channels.length > 0 ? 'md:grid-cols-2' : ''} gap-4`}>
          {channels.map((channel) => (
            <Link
              key={channel.id}
              href={channel.stream_url}
              target="_blank"
              className="group relative aspect-video rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.03]"
            >
              <Image
                src={(channel.image_url && channel.image_url.trim()) ? channel.image_url : "/placeholder.jpg"}
                alt={channel.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

              {/* Live Badge */}
              {channel.is_live && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  En Vivo
                </div>
              )}

              {/* Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                  <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                </div>
              </div>

              {/* Channel Info */}
              <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="font-bold text-foreground text-sm leading-tight group-hover:text-primary transition-colors">
                  {channel.name}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {channel.description}
                </p>
              </div>

              {/* External Link Icon */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>

        {channels.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <p className="text-muted-foreground italic">Próximamente: Nuestros canales de streaming</p>
          </div>
        )}
      </div>
    </section>
  )
}
