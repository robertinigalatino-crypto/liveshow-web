"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Phone, Instagram, MapPin, ArrowRight } from "lucide-react"
import type { SiteSettings } from "@/lib/types"

interface ContactProps {
  settings?: SiteSettings
}

export function Contact({ settings = {} }: ContactProps) {
  const whatsappNumber = settings.whatsapp_number || "5491131432020"
  const whatsappDisplay = settings.whatsapp_display || "+54 9 11 3143-2020"
  const instagramHandle = settings.instagram_handle || "liveshowproducciones"
  const location = settings.location || "Buenos Aires, Argentina"
  const logoUrl = settings.logo_url || "/logo.png"
  const companyName = settings.company_name || "Live Show Producciones"
  const footerEventTypes = settings.footer_event_types || "Eventos corporativos • Fiestas privadas • Shows publicos • Casamientos • Egresados"

  return (
    <section id="contacto" className="relative py-24 overflow-hidden bg-noise">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-card/50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left side - Info */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              Contactanos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              ¿Listo para crear un
              <span className="text-gradient block">evento inolvidable?</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-muted-foreground leading-relaxed">
              Contactanos y te asesoramos para encontrar el show perfecto. 
              Presupuestos sin compromiso, respuesta en menos de 24hs.
            </p>

            {/* Contact Info */}
            <div className="mt-10 space-y-4">
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                className="flex items-center gap-4 p-4 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 group"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <Phone className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="text-base sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {whatsappDisplay}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </Link>

              <Link
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                className="flex items-center gap-4 p-4 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 group"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <Instagram className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Instagram</p>
                  <p className="text-base sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    @{instagramHandle}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </Link>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/50 border border-border/50">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ubicación</p>
                  <p className="text-base sm:text-xl font-bold text-foreground">
                    {location}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right side - CTA Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl" />
            <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-5 sm:p-8 md:p-12 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="flex justify-center mb-8">
                  <Image
                    src={logoUrl || "/logo.png"}
                    alt={companyName}
                    width={200}
                    height={70}
                    className="h-16 w-auto"
                  />
                </div>
                
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
                  Solicita tu presupuesto
                </h3>
                <p className="text-muted-foreground text-center mb-8">
                  Contanos sobre tu evento y te ayudamos a encontrar el show ideal.
                </p>

                <div className="space-y-4">
                  <Button asChild size="lg" className="w-full text-base py-7 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02]">
                    <Link href={`https://wa.me/${whatsappNumber}`} target="_blank">
                      <Phone className="h-5 w-5 mr-2" />
                      Contactar por WhatsApp
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg" className="w-full text-base py-7 border-border/50 hover:border-primary hover:bg-primary/10 transition-all duration-300">
                    <Link href={`https://instagram.com/${instagramHandle}`} target="_blank">
                      <Instagram className="h-5 w-5 mr-2" />
                      Seguinos en Instagram
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-border/50">
                  <p className="text-center text-sm text-muted-foreground">
                    {footerEventTypes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
