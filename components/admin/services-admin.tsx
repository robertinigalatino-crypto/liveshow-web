"use client"

import { useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, Plus, Wrench } from "lucide-react"
import type { Service } from "@/lib/types"

interface ServicesAdminProps {
  services: Service[]
  onRefresh: () => void
}

export function ServicesAdmin({ services, onRefresh }: ServicesAdminProps) {
  const [editing, setEditing] = useState<Service | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "speaker",
    features: "",
    display_order: 0,
  })

  const supabase = useMemo(() => createClient(), [])

  const iconOptions = ["speaker", "lightbulb", "monitor", "truck", "mic2", "camera", "wrench", "music", "video", "wifi"]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
      display_order: formData.display_order,
    }

    if (editing) {
      const { error } = await supabase.from("services").update(payload).eq("id", editing.id)
      if (!error) { onRefresh(); setEditing(null); resetForm() }
    } else {
      const { error } = await supabase.from("services").insert([{ ...payload, is_active: true }])
      if (!error) { onRefresh(); setIsCreating(false); resetForm() }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar este servicio?")) {
      const { error } = await supabase.from("services").delete().eq("id", id)
      if (!error) onRefresh()
    }
  }

  function resetForm() {
    setFormData({ title: "", description: "", icon: "speaker", features: "", display_order: 0 })
  }

  function startEditing(service: Service) {
    setEditing(service)
    setIsCreating(false)
    setFormData({
      title: service.title,
      description: service.description || "",
      icon: service.icon,
      features: service.features.join(", "),
      display_order: service.display_order,
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Servicios</h2>
          <p className="text-muted-foreground text-sm">Gestiona los servicios técnicos</p>
        </div>
        <Button onClick={() => { setIsCreating(true); setEditing(null); resetForm() }} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Servicio
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {(isCreating || editing) && (
          <Card className="lg:col-span-1 bg-card/50 border-border/50 h-fit">
            <CardHeader><CardTitle>{editing ? "Editar Servicio" : "Nuevo Servicio"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Titulo</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label>Descripcion</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-background/50" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Icono</Label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Features (separadas por coma)</Label>
                  <Textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Line Array JBL, Monitores de piso, Consolas digitales" className="bg-background/50" rows={3} />
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
          {services.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-16 text-center">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hay servicios</h3>
                <p className="text-muted-foreground mb-6">Agrega tu primer servicio</p>
                <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" /> Crear Servicio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service.id} className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-xs text-primary font-mono">{service.icon}</span>
                      </div>
                      <h3 className="font-bold text-foreground">{service.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {service.features.map((f, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{f}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEditing(service)} className="flex-1"><Edit className="h-3 w-3 mr-1" />Editar</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /></Button>
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
