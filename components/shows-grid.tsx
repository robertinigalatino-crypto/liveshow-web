"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BuyTicketButton } from "@/components/ui/buy-ticket-button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Ticket, Clock, Share2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Show } from "@/lib/types"
import { cn, slugify } from "@/lib/utils"

interface ShowsGridProps {
  shows?: Show[]
  hideHeader?: boolean
}

export function ShowsGrid({ shows = [], hideHeader = false }: ShowsGridProps) {
  if (shows.length === 0) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return { day: "?", month: "?", time: "--:--", full: "Fecha por confirmar" }
    }
    return {
      day: format(date, "d"),
      month: format(date, "MMM", { locale: es }).toUpperCase(),
      time: format(date, "HH:mm"),
      full: format(date, "EEEE d 'de' MMMM", { locale: es }),
    }
  }

  return (
    <section id="shows" className={cn("relative overflow-hidden bg-noise", hideHeader ? "py-0" : "py-24")}>
      {!hideHeader && (
        <>
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!hideHeader && (
          /* Section Header */
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
              Próximos <span className="text-gradient">Shows</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprá tus entradas para los mejores eventos de la temporada
            </p>

            {/* Ticket purchase guide banner */}
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-primary/10 border border-primary/30">
              <Ticket className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-semibold text-primary">¿Cómo compro mi entrada?</span>
                {" "}Elegí un show y hacé clic en{" "}
                <span className="font-bold text-primary">&quot;Comprar Entradas&quot;</span>
              </p>
            </div>
          </div>
        )}

        {/* Shows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => {
            const dateInfo = formatDate(show.date)
            const showSlug = slugify(show.title)
            
            return (
              <Card
                key={show.id}
                className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1"
              >
                <Link href={`/shows/${showSlug}`} className="block">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={(show.image_url && show.image_url.trim()) ? show.image_url : "/placeholder.jpg"}
                      alt={show.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                    {/* Date Badge */}
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground p-3 rounded-xl shadow-2xl shadow-primary/30 text-center min-w-[52px]">
                      <div className="text-2xl font-bold leading-none">{dateInfo.day}</div>
                      <div className="text-xs font-semibold mt-0.5">{dateInfo.month}</div>
                    </div>

                    {show.is_featured && (
                      <div className="absolute top-3 right-3 bg-foreground text-background px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Destacado
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-5 pb-2 min-h-[160px]">
                    <div className="mb-4">
                      <p className="text-primary font-semibold text-sm mb-1">{show.artist}</p>
                      <h3 className="font-serif text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
                        {show.title}
                      </h3>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                        <span className="capitalize truncate">{dateInfo.full}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate">{show.venue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>

                <div className="px-5 pb-5 mt-auto">
                  <BuyTicketButton
                    asChild
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] font-bold motion-safe:animate-glow"
                  >
                    <Link href={`/shows/${showSlug}`}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Ver Info & Comprar
                    </Link>
                  </BuyTicketButton>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
