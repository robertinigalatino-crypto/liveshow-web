"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Ticket, MousePointer2, Wrench, Truck, Instagram } from "lucide-react"
import type { Category, SiteSettings } from "@/lib/types"

interface HeroProps {
  categories?: Category[]
  settings?: SiteSettings
}

export function Hero({ categories = [], settings = {} }: HeroProps) {
  const whatsappNumber = settings.whatsapp_number || "5491131432020"
  const logoUrl = settings.logo_url || "/logo.png"
  const instagramHandle = settings.instagram_handle || "liveshowproducciones"
  const whatsappLink = `https://wa.me/${whatsappNumber}`
  const heroTicketLink = settings.hero_ticket_link || "#shows"
  const heroTecnicaLink = settings.hero_tecnica_link || "#servicios"
  const heroShowTruckLink = settings.hero_show_truck_link || "#show-truck"

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    e.preventDefault()
    
    const isArtistCategory = targetId.startsWith('artistas-')
    const actualTargetId = isArtistCategory ? 'artistas' : targetId
    
    const element = document.getElementById(actualTargetId)
    if (element) {
      if (window.location.hash === `#${targetId}`) {
        window.dispatchEvent(new Event('hashchange'))
      } else {
        window.location.hash = targetId
      }

      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section
      id="inicio"
      className="relative flex flex-col items-center justify-start overflow-hidden pt-0 pb-1 sm:pt-1 sm:pb-3"
    >
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row / Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-1 mb-0.5 sm:mb-2 w-full">
          {/* Mobile Header */}
          <div className="flex md:hidden flex-col items-center w-full text-center">
            <div className="w-[160px] xs:w-[170px]">
              <Link href="/" className="relative block group transition-transform duration-500 hover:scale-105">
                <Image
                  src={logoUrl || "/logo.png"}
                  alt={settings.company_name || "Live Show Producciones"}
                  width={700}
                  height={300}
                  className="w-full h-auto drop-shadow-[0_0_24px_rgba(220,38,38,0.22)]"
                  priority
                />
              </Link>
              <p className="mt-0.5 text-white/55 text-[7px] xs:text-[8px] font-semibold uppercase w-full flex justify-between">
                {"Asociado a A.D.R.A y C.A.P.T.E".split("").map((char, i) => (
                  <span key={i}>{char === " " ? "\u00A0" : char}</span>
                ))}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <Link
                href={`https://www.instagram.com/${instagramHandle}`}
                target="_blank"
                className="p-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:text-primary transition-all duration-300"
                aria-label="Seguinos en Instagram"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href={whatsappLink}
                target="_blank"
                className="p-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:text-primary transition-all duration-300"
                aria-label="Contactanos por WhatsApp"
              >
                <Image
                  src="/whatsapp.png"
                  alt="WhatsApp"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <span className="sr-only">WhatsApp</span>
              </Link>
            </div>

            <div className="mt-3 w-full flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-1.5 w-full">
                <Button
                  asChild
                  variant="outline"
                  className="h-auto py-2.5 px-1 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all duration-300 text-[8px] font-bold uppercase leading-tight"
                >
                  <Link 
                    href={heroTecnicaLink}
                    target={heroTecnicaLink.startsWith("#") ? undefined : "_blank"}
                    rel={heroTecnicaLink.startsWith("#") ? undefined : "noopener noreferrer"}
                    onClick={(e) => heroTecnicaLink.startsWith("#") && scrollToSection(e, heroTecnicaLink.replace("#", ""))}
                    className="flex flex-col items-center gap-1"
                  >
                    <Wrench className="h-3 w-3 text-primary" />
                    <span>Técnica Profesional</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => scrollToSection(e, "en-vivo")}
                  className="h-auto py-2.5 px-1 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all duration-300 text-[8px] font-bold uppercase leading-tight flex flex-col items-center gap-1"
                >
                  <Play className="h-3 w-3 text-primary fill-primary/20" />
                  <span>Canales en Vivo</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto py-2.5 px-1 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all duration-300 text-[8px] font-bold uppercase leading-tight"
                >
                  <Link 
                    href={heroShowTruckLink}
                    target={heroShowTruckLink.startsWith("#") ? undefined : "_blank"}
                    rel={heroShowTruckLink.startsWith("#") ? undefined : "noopener noreferrer"}
                    onClick={(e) => heroShowTruckLink.startsWith("#") && scrollToSection(e, heroShowTruckLink.replace("#", ""))}
                    className="flex flex-col items-center gap-1"
                  >
                    <Truck className="h-3 w-3 text-primary" />
                    <span>Show Truck</span>
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <Button
                  asChild
                  className="w-full h-auto py-3 px-8 rounded-full bg-white text-black hover:bg-white/90 shadow-[0_10px_40px_rgba(255,255,255,0.12)] transition-all duration-500 hover:scale-[1.01] group border-none"
                >
                  <Link
                    href={heroTicketLink}
                    target={heroTicketLink.startsWith("#") ? undefined : "_blank"}
                    rel={heroTicketLink.startsWith("#") ? undefined : "noopener noreferrer"}
                    onClick={(e) => heroTicketLink.startsWith("#") && scrollToSection(e, heroTicketLink.replace("#", ""))}
                    className="flex items-center justify-center gap-2.5"
                  >
                    <Ticket className="h-3.5 w-3.5 fill-black/20" />
                    <span className="font-extrabold text-xs tracking-wide uppercase">Compra tu entrada</span>
                    <MousePointer2 className="h-4 w-4 animate-click-tap opacity-90" />
                  </Link>
                </Button>
                {/* Logo Abasto (Mobile) */}
                {(settings.partnership_logo_url || "/abasto_hotel.png") && (
                  <Image
                    src={settings.partnership_logo_url || "/abasto_hotel.png"}
                    alt="Partnership Logo"
                    width={250}
                    height={125}
                    className="h-20 w-auto opacity-95 brightness-110"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center w-full gap-4">
            {/* Left: Logo & Socials */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-start text-left">
                <div className="w-[160px] md:w-[175px]">
                  <Link href="/" className="relative block group transition-transform duration-500 hover:scale-105">
                    <Image
                      src={logoUrl || "/logo.png"}
                      alt={settings.company_name || "Live Show Producciones"}
                      width={700}
                      height={300}
                      className="w-full h-auto drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                      priority
                    />
                  </Link>
                  <p className="mt-0.5 text-white/50 text-[8px] md:text-[9px] font-semibold uppercase w-full flex justify-between">
                    {"Asociado a A.D.R.A y C.A.P.T.E".split("").map((char, i) => (
                      <span key={i}>{char === " " ? "\u00A0" : char}</span>
                    ))}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`https://www.instagram.com/${instagramHandle}`}
                  target="_blank"
                  className="p-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="Seguinos en Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link
                  href={whatsappLink}
                  target="_blank"
                  className="p-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label="Contactanos por WhatsApp"
                >
                  <Image src="/whatsapp.png" alt="WhatsApp" width={16} height={16} className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Center: Action Buttons */}
            <div className="flex items-center justify-center gap-1.5">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black transition-all duration-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
              >
                <Link 
                  href={heroTecnicaLink}
                  target={heroTecnicaLink.startsWith("#") ? undefined : "_blank"}
                  rel={heroTecnicaLink.startsWith("#") ? undefined : "noopener noreferrer"}
                  onClick={(e) => heroTecnicaLink.startsWith("#") && scrollToSection(e, heroTecnicaLink.replace("#", ""))}
                  className="flex items-center"
                >
                  <Wrench className="h-3 h-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
                  Técnica Profesional
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => scrollToSection(e, "en-vivo")}
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black transition-all duration-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
              >
                <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 fill-primary/20" />
                Canales en Vivo
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white hover:text-black transition-all duration-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
              >
                <Link 
                  href={heroShowTruckLink}
                  target={heroShowTruckLink.startsWith("#") ? undefined : "_blank"}
                  rel={heroShowTruckLink.startsWith("#") ? undefined : "noopener noreferrer"}
                  onClick={(e) => heroShowTruckLink.startsWith("#") && scrollToSection(e, heroShowTruckLink.replace("#", ""))}
                  className="flex items-center"
                >
                  <Truck className="h-3 h-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
                  Show Truck
                </Link>
              </Button>
            </div>

            {/* Right: Buy Ticket Button */}
            <div className="flex flex-col items-center justify-center gap-6 mt-14">
              <div className="flex items-center">
                <Button
                  asChild
                  className="h-auto py-2.5 px-8 rounded-full bg-white text-black hover:bg-white/90 shadow-[0_10px_40px_rgba(255,255,255,0.12)] transition-all duration-500 hover:scale-[1.02] group border-none"
                >
                  <Link 
                    href={heroTicketLink} 
                    target={heroTicketLink.startsWith("#") ? undefined : "_blank"}
                    rel={heroTicketLink.startsWith("#") ? undefined : "noopener noreferrer"}
                    onClick={(e) => heroTicketLink.startsWith("#") && scrollToSection(e, heroTicketLink.replace("#", ""))} 
                    className="flex items-center justify-center gap-2.5"
                  >
                    <Ticket className="h-3.5 w-3.5 fill-black/20" />
                    <span className="font-extrabold text-[11px] tracking-wide uppercase">Compra tu entrada</span>
                    <MousePointer2 className="h-4 w-4 animate-click-tap opacity-90" />
                  </Link>
                </Button>
              </div>
              {/* Logo Abasto (Desktop) */}
              {(settings.partnership_logo_url || "/abasto_hotel.png") && (
                <div className="flex items-center justify-center">
                  <Image
                    src={settings.partnership_logo_url || "/abasto_hotel.png"}
                    alt="Partnership Logo"
                    width={320}
                    height={160}
                    className="h-28 w-auto opacity-95 brightness-110"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-1.5 sm:mb-3 max-w-4xl mx-auto px-2 mt-8 md:mt-12">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase leading-[0.95] text-balance">
            <span className="block text-[0.4em] sm:text-[0.36em] font-serif italic font-medium tracking-[0.18em] text-white/60 mb-2 normal-case">
              Contratá
            </span>
            <span className="block">
              Los Mejores <span className="text-gradient">Shows</span>
            </span>
            <span className="block text-[0.62em] sm:text-[0.68em] font-serif italic font-normal tracking-tight text-white/90 mt-1 normal-case">
              para tu evento
            </span>
          </h1>
        </div>

        {/* Categories Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-6xl mx-auto mb-2 sm:mb-4 px-2 sm:px-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`#artistas-${cat.slug}`}
                onClick={(e) => scrollToSection(e, `artistas-${cat.slug}`)}
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/5 backdrop-blur-xl text-white/80 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] border border-white/10 transition-all duration-300 hover:bg-white hover:text-black hover:scale-[1.03] cursor-pointer text-center"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}