export interface Show {
  id: string
  title: string
  artist: string
  description: string
  venue: string
  date: string
  image_url: string
  ticket_url: string
  price: string
  is_featured: boolean
  show_in_all_shows?: boolean
  is_active?: boolean
  created_at?: string
}

export interface Artist {
  id: string
  name: string
  category: string
  bio: string
  image_url: string
  tags: string[]
  links: ArtistLink[]
  gallery: string[]
  whatsapp_number: string
  display_order: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface ArtistLink {
  label: string
  url: string
}

export interface Channel {
  id: string
  name: string
  description: string
  image_url: string
  stream_url: string
  is_live: boolean
  display_order: number
  is_active?: boolean
  created_at?: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  display_order: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  display_order: number
  is_active?: boolean
  created_at?: string
}

export interface SiteSettings {
  [key: string]: string
}

export interface GalleryImage {
  id: string
  type: 'show_truck' | 'tecnica'
  url: string
  display_order: number
  created_at?: string
}
