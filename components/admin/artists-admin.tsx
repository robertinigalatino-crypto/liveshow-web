"use client"

import { useState, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { uploadFile, deleteFile } from "@/lib/supabase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ImageDropzone } from "@/components/ui/image-dropzone"
import { GalleryDropzone } from "@/components/ui/gallery-dropzone"
import { VideoDropzone } from "@/components/ui/video-dropzone"
import { Trash2, Edit, Plus, Users, X, Link as LinkIcon, Instagram, Youtube, Music2, Globe } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import type { Artist, ArtistLink, Category } from "@/lib/types"

interface ArtistsAdminProps {
  artists: Artist[]
  categories: Category[]
  onRefresh: () => void
}

const LINK_PRESETS = [
  { label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/..." },
  { label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/..." },
  { label: "Spotify", icon: Music2, placeholder: "https://open.spotify.com/..." },
  { label: "Web", icon: Globe, placeholder: "https://..." },
]

export function ArtistsAdmin({ artists, categories, onRefresh }: ArtistsAdminProps) {
  const [editing, setEditing] = useState<Artist | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    bio: "",
    image_url: "",
    tags: [] as string[],
    links: [] as ArtistLink[],
    gallery: [] as string[],
    whatsapp_number: "",
    video_url: "",
    display_order: 0,
  })
  const [tagInput, setTagInput] = useState("")
  const { toast } = useToast()

  const supabase = useMemo(() => createClient(), [])

  const handleUploadArtistImage = useCallback(
    async (file: File) => uploadFile(supabase, "artists", file),
    [supabase],
  )

  const handleRemoveArtistImage = useCallback(
    async (url: string) => { await deleteFile(supabase, "artists", url) },
    [supabase],
  )

  const handleUploadGalleryImage = useCallback(
    async (file: File) => uploadFile(supabase, "artists-gallery", file),
    [supabase],
  )

  const handleRemoveGalleryImage = useCallback(
    async (url: string) => { await deleteFile(supabase, "artists-gallery", url) },
    [supabase],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload = {
      name: formData.name,
      category: formData.category,
      bio: formData.bio,
      image_url: formData.image_url,
      tags: formData.tags,
      links: formData.links.filter((l) => l.url.trim() !== ""),
      gallery: formData.gallery,
      whatsapp_number: formData.whatsapp_number,
      video_url: formData.video_url,
      display_order: formData.display_order,
    }

    if (editing) {
      const { error } = await supabase.from("artists").update(payload).eq("id", editing.id)
      if (!error) {
        toast({ title: "Éxito", description: "Artista actualizado correctamente" })
        onRefresh()
        setEditing(null)
        resetForm()
      } else {
        toast({ title: "Error", description: `No se pudo actualizar el artista: ${error.message}`, variant: "destructive" })
        console.error("Error updating artist:", error)
      }
    } else {
      const { error } = await supabase.from("artists").insert([{ ...payload, is_active: true }])
      if (!error) {
        toast({ title: "Éxito", description: "Artista creado correctamente" })
        onRefresh()
        setIsCreating(false)
        resetForm()
      } else {
        toast({ title: "Error", description: `No se pudo crear el artista: ${error.message}`, variant: "destructive" })
        console.error("Error creating artist:", error)
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar este artista?")) {
      const { error } = await supabase.from("artists").delete().eq("id", id)
      if (!error) {
        toast({ title: "Éxito", description: "Artista eliminado correctamente" })
        onRefresh()
      } else {
        toast({ title: "Error", description: `No se pudo eliminar el artista: ${error.message}`, variant: "destructive" })
        console.error("Error deleting artist:", error)
      }
    }
  }

  function resetForm() {
    setFormData({
      name: "", category: "", bio: "", image_url: "",
      tags: [], links: [], gallery: [], whatsapp_number: "", video_url: "", display_order: 0,
    })
    setTagInput("")
  }

  function startEditing(artist: Artist) {
    setEditing(artist)
    setIsCreating(false)
    setFormData({
      name: artist.name,
      category: artist.category,
      bio: artist.bio,
      image_url: artist.image_url,
      tags: artist.tags || [],
      links: artist.links || [],
      gallery: artist.gallery || [],
      whatsapp_number: artist.whatsapp_number || "",
      video_url: artist.video_url || "",
      display_order: artist.display_order || 0,
    })
    setTagInput("")
  }

  /* ── Tag helpers ── */
  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmed] })
    }
    setTagInput("")
  }

  function removeTag(tag: string) {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault()
      addTag(tagInput)
    }
    if (e.key === "Backspace" && !tagInput && formData.tags.length > 0) {
      removeTag(formData.tags[formData.tags.length - 1])
    }
  }

  async function handleVideoUpload(file: File) {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `videos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("artists-videos")
      .upload(filePath, file)

    if (uploadError) {
      toast({ title: "Error", description: `Error al subir video: ${uploadError.message}`, variant: "destructive" })
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from("artists-videos")
      .getPublicUrl(filePath)

    return publicUrl
  }

  async function handleVideoRemove(url: string) {
    const path = url.split("/").pop()
    if (path) {
      await supabase.storage.from("artists-videos").remove([`videos/${path}`])
    }
  }

  /* ── Link helpers ── */
  function addLink() {
    setFormData({ ...formData, links: [...formData.links, { label: "", url: "" }] })
  }

  function updateLink(index: number, field: "label" | "url", value: string) {
    const updated = [...formData.links]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, links: updated })
  }

  function removeLink(index: number) {
    setFormData({ ...formData, links: formData.links.filter((_, i) => i !== index) })
  }

  function addPresetLink(preset: typeof LINK_PRESETS[number]) {
    setFormData({
      ...formData,
      links: [...formData.links, { label: preset.label, url: "" }],
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Artistas</h2>
          <p className="text-muted-foreground text-sm">Gestiona el roster de artistas</p>
        </div>
        <Button onClick={() => { setIsCreating(true); setEditing(null); resetForm() }} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Artista
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {(isCreating || editing) && (
          <Card className="lg:col-span-1 bg-card/50 border-border/50 h-fit max-h-[calc(100vh-12rem)] overflow-y-auto">
            <CardHeader><CardTitle>{editing ? "Editar Artista" : "Nuevo Artista"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* ── Imagen principal ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageDropzone
                    label="Foto de Perfil"
                    value={formData.image_url}
                    onUpload={handleUploadArtistImage}
                    onRemove={handleRemoveArtistImage}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                  />
                  <VideoDropzone
                    label="Video Promocional (Opcional)"
                    value={formData.video_url}
                    onUpload={handleVideoUpload}
                    onRemove={handleVideoRemove}
                    onChange={(url) => setFormData({ ...formData, video_url: url })}
                  />
                </div>

                {/* ── Nombre ── */}
                <div className="space-y-1.5">
                  <Label>Nombre</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Nombre del artista o banda"
                    className="bg-background/50"
                  />
                </div>

                {/* ── Categoría ── */}
                <div className="space-y-1.5">
                  <Label>Categoría</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar categoría...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* ── Bio ── */}
                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Breve descripción del artista..."
                    className="bg-background/50"
                    rows={3}
                  />
                </div>

                {/* ── Tags (chips) ── */}
                <div className="space-y-1.5">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-input bg-background/50 min-h-[2.5rem]">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onBlur={() => { if (tagInput.trim()) addTag(tagInput) }}
                      placeholder={formData.tags.length === 0 ? "Escribí y presioná Enter..." : ""}
                      className="flex-1 min-w-[80px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* ── Links (visual) ── */}
                <div className="space-y-2">
                  <Label>Redes y enlaces</Label>

                  {formData.links.map((link, i) => (
                    <div key={i} className="flex gap-1.5 items-start">
                      <Input
                        value={link.label}
                        onChange={(e) => updateLink(i, "label", e.target.value)}
                        placeholder="Nombre"
                        className="bg-background/50 w-24 flex-shrink-0 text-xs"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateLink(i, "url", e.target.value)}
                        placeholder="https://..."
                        className="bg-background/50 flex-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(i)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Quick add presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {LINK_PRESETS.map((preset) => {
                      const Icon = preset.icon
                      const alreadyHas = formData.links.some(
                        (l) => l.label.toLowerCase() === preset.label.toLowerCase(),
                      )
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          disabled={alreadyHas}
                          onClick={() => addPresetLink(preset)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs transition-colors ${
                            alreadyHas
                              ? "border-border/30 text-muted-foreground/40 cursor-not-allowed"
                              : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          {preset.label}
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      onClick={addLink}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-border/50 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <LinkIcon className="h-3 w-3" />
                      Otro
                    </button>
                  </div>
                </div>

                {/* ── Galería ── */}
                <GalleryDropzone
                  label="Galería"
                  value={formData.gallery}
                  onChange={(urls) => setFormData({ ...formData, gallery: urls })}
                  onUpload={handleUploadGalleryImage}
                  onRemove={handleRemoveGalleryImage}
                />

                {/* ── WhatsApp ── */}
                <div className="space-y-1.5">
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="5491131432020"
                    className="bg-background/50"
                  />
                </div>

                {/* ── Orden ── */}
                <div className="space-y-1.5">
                  <Label>Orden de visualización</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="bg-background/50"
                  />
                </div>

                {/* ── Actions ── */}
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    {editing ? "Guardar Cambios" : "Crear Artista"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setIsCreating(false); setEditing(null); resetForm() }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className={isCreating || editing ? "lg:col-span-2" : "lg:col-span-3"}>
          {artists.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-16 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hay artistas</h3>
                <p className="text-muted-foreground mb-6">Agrega tu primer artista</p>
                <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" /> Crear Artista
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {artists.map((artist) => (
                <Card key={artist.id} className="bg-card/50 border-border/50 overflow-hidden">
                  <div className="relative h-32">
                    {artist.image_url ? (
                      <Image src={artist.image_url} alt={artist.name} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-foreground mb-1">{artist.name}</h3>
                    <p className="text-xs text-primary mb-1">{artist.category}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {artist.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">{tag}</span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{artist.bio}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEditing(artist)} className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(artist.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
