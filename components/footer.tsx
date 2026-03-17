import Link from "next/link"
import Image from "next/image"
import { Instagram, Phone } from "lucide-react"
import type { Category, SiteSettings } from "@/lib/types"

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#shows", label: "Shows" },
  { href: "#servicios", label: "Servicios" },
  { href: "#artistas", label: "Artistas" },
  { href: "#contacto", label: "Contacto" },
]

interface FooterProps {
  categories?: Category[]
  settings?: SiteSettings
}

export function Footer({ categories = [], settings = {} }: FooterProps) {
  const whatsappNumber = settings.whatsapp_number || "5491131432020"
  const whatsappDisplay = settings.whatsapp_display || "+54 9 11 3143-2020"
  const instagramHandle = settings.instagram_handle || "liveshowproducciones"
  const location = settings.location || "Buenos Aires, Argentina"
  const logoUrl = settings.logo_url || "/logo.png"
  const companyName = settings.company_name || "Live Show Producciones"
  const footerDescription = settings.footer_description || "Producción integral de eventos con los mejores artistas de Argentina. Técnica propia y servicio premium."

  return (
    <footer className="relative bg-card/50 border-t border-border/50 overflow-hidden">
      {/* Background */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-8 group">
              <Image
                src={logoUrl || "/logo.png"}
                alt={companyName}
                width={220}
                height={70}
                className="h-16 w-auto drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {footerDescription}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                className="h-11 w-11 rounded-full bg-card border border-border/50 hover:border-primary hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                className="h-11 w-11 rounded-full bg-card border border-border/50 hover:border-primary hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Phone className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">
              Navegación
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">
                Categorías
              </h4>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`https://wa.me/${whatsappNumber}?text=Hola! Me interesa consultar por ${category.name}`}
                      target="_blank"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">WhatsApp</p>
                <Link
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {whatsappDisplay}
                </Link>
              </li>
              <li>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Instagram</p>
                <Link
                  href={`https://instagram.com/${instagramHandle}`}
                  target="_blank"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  @{instagramHandle}
                </Link>
              </li>
              <li>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ubicación</p>
                <p className="text-foreground font-medium">{location}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} {companyName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
