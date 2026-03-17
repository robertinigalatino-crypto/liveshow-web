import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { JsonLd } from '@/components/json-ld'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif'
});
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: {
    default: 'Live Show Producciones | Producción de Eventos y Contratación de Artistas en Argentina',
    template: '%s | Live Show Producciones'
  },
  description: 'Productora líder en Argentina. Producción integral de eventos, contratación de artistas, bandas en vivo, DJs, conductores y técnica profesional (sonido, luces, pantallas LED).',
  keywords: [
    'producción de eventos argentina',
    'contratación de artistas argentina',
    'bandas para eventos',
    'shows en vivo',
    'escenario móvil',
    'sonido e iluminación profesional',
    'eventos corporativos buenos aires',
    'booking de artistas',
    'dj para eventos',
    'productora de eventos buenos aires',
    'shows musicales argentina'
  ],
  authors: [{ name: 'Live Show Producciones' }],
  creator: 'Live Show Producciones',
  publisher: 'Live Show Producciones',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://liveshowproducciones.com.ar'), // Placeholder - update with real domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Live Show Producciones | Producción de Eventos y Contratación de Artistas',
    description: 'Transformamos tu evento en una experiencia inolvidable. El mejor catálogo de artistas y técnica de vanguardia en Argentina.',
    url: 'https://liveshowproducciones.com.ar',
    siteName: 'Live Show Producciones',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Ensure this exists or I will generate it
        width: 1200,
        height: 630,
        alt: 'Live Show Producciones - Producción de Eventos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Show Producciones | Producción Integral de Eventos',
    description: 'Contratación de artistas, técnica y producción profesional en toda Argentina.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: {
      url: '/apple-icon.png',
      sizes: '180x180',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <JsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
