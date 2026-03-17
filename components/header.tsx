"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SiteSettings } from "@/lib/types"

const navItems = [
  { href: "#inicio", label: "Inicio" },
  { href: "#shows", label: "Shows" },
  { href: "#servicios", label: "Servicios" },
  { href: "#artistas", label: "Artistas" },
  { href: "#contacto", label: "Contacto" },
]

interface HeaderProps {
  settings?: SiteSettings
}

export function Header({ settings = {} }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const whatsappNumber = settings.whatsapp_number || "5491131432020"
  const instagramHandle = settings.instagram_handle || "liveshowproducciones"
  const logoUrl = settings.logo_url || "/logo.png"
  const companyName = settings.company_name || "Live Show Producciones"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl shadow-primary/5" 
        : "bg-transparent"
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          scrolled ? "h-20" : "h-24"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group transition-transform duration-300 hover:scale-105">
            <Image
              src={logoUrl}
              alt={companyName}
              width={300}
              height={80}
              className={`w-auto drop-shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-500 ${
                scrolled ? "h-10" : "h-14"
              }`}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA & Social */}
          <div className="flex items-center gap-4">
            <Link
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              className="hidden sm:flex items-center justify-center h-11 w-11 rounded-full border border-border/50 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Button asChild className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 text-sm font-semibold px-6">
              <Link href={`https://wa.me/${whatsappNumber}`} target="_blank">
                <Phone className="h-4 w-4 mr-2" />
                Contactar
              </Link>
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-xl border-b border-border">
          <nav className="flex flex-col px-4 sm:px-6 py-6 sm:py-8 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-primary py-3 border-b border-border/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-6">
              <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                <Link href={`https://wa.me/${whatsappNumber}`} target="_blank">
                  <Phone className="h-4 w-4 mr-2" />
                  Contactar
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link href={`https://instagram.com/${instagramHandle}`} target="_blank">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
