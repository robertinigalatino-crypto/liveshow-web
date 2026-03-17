"use client"

import { Users, CalendarDays, Music, Award } from "lucide-react"
import type { SiteSettings } from "@/lib/types"

interface StatsBarProps {
  showCount: number
  artistCount: number
  settings?: SiteSettings
}

export function StatsBar({ showCount, artistCount }: StatsBarProps) {
  const stats = [
    {
      icon: Users,
      value: artistCount > 0 ? `${artistCount}` : "500+",
      label: "Artistas disponibles",
    },
    {
      icon: CalendarDays,
      value: showCount > 0 ? `${showCount}` : "10+",
      label: "Próximos shows",
    },
    {
      icon: Music,
      value: "15+",
      label: "Años de experiencia",
    },
    {
      icon: Award,
      value: "100%",
      label: "Producción integral",
    },
  ]

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-3 group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground font-serif">
                    {stat.value}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
