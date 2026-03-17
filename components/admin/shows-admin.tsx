"use client"

import { useState, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { uploadFile, deleteFile } from "@/lib/supabase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ImageDropzone } from "@/components/ui/image-dropzone"
import { Trash2, Edit, Plus, Calendar, MapPin, Ticket } from "lucide-react"
import Image from "next/image"
import type { Show } from "@/lib/types"

interface ShowsAdminProps {
  shows: Show[]
  onRefresh: () => void
}

export function ShowsAdmin({ shows, onRefresh }: ShowsAdminProps) {
  const [editingShow, setEditingShow] = useState<Show | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    description: "",
    venue: "",
    date: "",
    image_url: "",
    ticket_url: "",
    price: "",
    is_featured: false,
  })

  const supabase = useMemo(() => createClient(), [])

  const handleUploadImage = useCallback(
    async (file: File) => uploadFile(supabase, "shows", file),
    [supabase],
  )

  const handleRemoveImage = useCallback(
    async (url: string) => { await deleteFile(supabase, "shows", url) },
    [supabase],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingShow) {
      const { error } = await supabase.from("shows").update(formData).eq("id", editingShow.id)
      if (!error) { onRefresh(); setEditingShow(null); resetForm() }
    } else {
      const { error } = await supabase.from("shows").insert([{ ...formData, is_active: true }])
      if (!error) { onRefresh(); setIsCreating(false); resetForm() }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar este show?")) {
      const { error } = await supabase.from("shows").delete().eq("id", id)
      if (!error) onRefresh()
    }
  }

  function resetForm() {
    setFormData({ title: "", artist: "", description: "", venue: "", date: "", image_url: "", ticket_url: "", price: "", is_featured: false })
  }

  function startEditing(show: Show) {
    setEditingShow(show)
    setIsCreating(false)
    setFormData({
      title: show.title, artist: show.artist, description: show.description, venue: show.venue,
      date: show.date.slice(0, 16), image_url: show.image_url, ticket_url: show.ticket_url,
      price: show.price, is_featured: show.is_featured,
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Shows</h2>
          <p className="text-muted-foreground text-sm">Gestiona los shows del carrusel principal</p>
        </div>
        <Button onClick={() => { setIsCreating(true); setEditingShow(null); resetForm() }} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Show
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {(isCreating || editingShow) && (
          <Card className="lg:col-span-1 bg-card/50 border-border/50 h-fit">
            <CardHeader><CardTitle>{editingShow ? "Editar Show" : "Nuevo Show"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Titulo</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Artista(s)</Label>
                  <Input value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })} required className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Descripcion</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Lugar</Label>
                  <Input value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} required className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Fecha y Hora</Label>
                  <Input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="bg-background/50" />
                </div>
                <ImageDropzone
                  label="Imagen del Show"
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  onUpload={handleUploadImage}
                  onRemove={handleRemoveImage}
                />
                <div className="space-y-2">
                  <Label>URL de Entradas</Label>
                  <Input value={formData.ticket_url} onChange={(e) => setFormData({ ...formData, ticket_url: e.target.value })} required className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Precio</Label>
                  <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="bg-background/50" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>Destacar</Label>
                  <Switch checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">{editingShow ? "Guardar" : "Crear"}</Button>
                  <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setEditingShow(null); resetForm() }}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className={isCreating || editingShow ? "lg:col-span-2" : "lg:col-span-3"}>
          {shows.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-16 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hay shows</h3>
                <p className="text-muted-foreground mb-6">Agrega tu primer show</p>
                <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" /> Crear Show
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {shows.map((show) => (
                <Card key={show.id} className="bg-card/50 border-border/50 overflow-hidden">
                  <div className="relative h-40">
                    <Image src={show.image_url} alt={show.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    {show.is_featured && (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">Destacado</span>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-foreground text-lg mb-1">{show.title}</h3>
                    <p className="text-primary font-medium mb-3">{show.artist}</p>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(show.date).toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{show.venue}</div>
                      <div className="flex items-center gap-2"><Ticket className="h-4 w-4" />{show.price}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEditing(show)} className="flex-1"><Edit className="h-4 w-4 mr-1" />Editar</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(show.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
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
