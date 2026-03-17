"use client"

import { useState, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { uploadFile, deleteFile } from "@/lib/supabase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ImageDropzone } from "@/components/ui/image-dropzone"
import { Trash2, Edit, Plus, Radio } from "lucide-react"
import Image from "next/image"
import type { Channel } from "@/lib/types"

interface ChannelsAdminProps {
  channels: Channel[]
  onRefresh: () => void
}

export function ChannelsAdmin({ channels, onRefresh }: ChannelsAdminProps) {
  const [editing, setEditing] = useState<Channel | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    stream_url: "",
    is_live: false,
    display_order: 0,
  })

  const supabase = useMemo(() => createClient(), [])

  const handleUploadImage = useCallback(
    async (file: File) => uploadFile(supabase, "channels", file),
    [supabase],
  )

  const handleRemoveImage = useCallback(
    async (url: string) => { await deleteFile(supabase, "channels", url) },
    [supabase],
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      const { error } = await supabase.from("channels").update(formData).eq("id", editing.id)
      if (!error) { onRefresh(); setEditing(null); resetForm() }
    } else {
      const { error } = await supabase.from("channels").insert([{ ...formData, is_active: true }])
      if (!error) { onRefresh(); setIsCreating(false); resetForm() }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar este canal?")) {
      const { error } = await supabase.from("channels").delete().eq("id", id)
      if (!error) onRefresh()
    }
  }

  function resetForm() {
    setFormData({ name: "", description: "", image_url: "", stream_url: "", is_live: false, display_order: 0 })
  }

  function startEditing(channel: Channel) {
    setEditing(channel)
    setIsCreating(false)
    setFormData({
      name: channel.name,
      description: channel.description || "",
      image_url: channel.image_url || "",
      stream_url: channel.stream_url,
      is_live: channel.is_live || false,
      display_order: channel.display_order || 0,
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Canales</h2>
          <p className="text-muted-foreground text-sm">Gestiona los canales de streaming en vivo</p>
        </div>
        <Button onClick={() => { setIsCreating(true); setEditing(null); resetForm() }} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Canal
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {(isCreating || editing) && (
          <Card className="lg:col-span-1 bg-card/50 border-border/50 h-fit">
            <CardHeader><CardTitle>{editing ? "Editar Canal" : "Nuevo Canal"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Descripcion</Label>
                  <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-background/50" />
                </div>
                <ImageDropzone
                  label="Imagen del Canal"
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  onUpload={handleUploadImage}
                  onRemove={handleRemoveImage}
                />
                <div className="space-y-2">
                  <Label>URL de Stream</Label>
                  <Input value={formData.stream_url} onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })} required className="bg-background/50" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>En Vivo</Label>
                  <Switch checked={formData.is_live} onCheckedChange={(checked) => setFormData({ ...formData, is_live: checked })} />
                </div>
                <div className="space-y-2">
                  <Label>Orden</Label>
                  <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} className="bg-background/50" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">{editing ? "Guardar" : "Crear"}</Button>
                  <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setEditing(null); resetForm() }}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className={isCreating || editing ? "lg:col-span-2" : "lg:col-span-3"}>
          {channels.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-16 text-center">
                <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hay canales</h3>
                <p className="text-muted-foreground mb-6">Agrega tu primer canal</p>
                <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" /> Crear Canal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((channel) => (
                <Card key={channel.id} className="bg-card/50 border-border/50 overflow-hidden">
                  <div className="relative h-32">
                    {channel.image_url ? (
                      <Image src={channel.image_url} alt={channel.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted/20">
                        <Radio className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    {channel.is_live && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> EN VIVO
                      </span>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-foreground mb-1">{channel.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{channel.description}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEditing(channel)} className="flex-1"><Edit className="h-3 w-3 mr-1" />Editar</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(channel.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /></Button>
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
