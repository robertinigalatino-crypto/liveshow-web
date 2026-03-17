"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, Plus, Tag } from "lucide-react"
import type { Category } from "@/lib/types"

interface CategoriesAdminProps {
  categories: Category[]
  onRefresh: () => void
}

export function CategoriesAdmin({ categories, onRefresh }: CategoriesAdminProps) {
  const [editing, setEditing] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    display_order: 0,
  })

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    if (editing) {
      const { error } = await supabase.from("categories").update({ ...formData, slug }).eq("id", editing.id)
      if (!error) { onRefresh(); setEditing(null); resetForm() }
    } else {
      const { error } = await supabase.from("categories").insert([{ ...formData, slug, is_active: true }])
      if (!error) { onRefresh(); setIsCreating(false); resetForm() }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar esta categoría?")) {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (!error) onRefresh()
    }
  }

  function resetForm() {
    setFormData({ name: "", slug: "", display_order: 0 })
  }

  function startEditing(cat: Category) {
    setEditing(cat)
    setIsCreating(false)
    setFormData({ name: cat.name, slug: cat.slug, display_order: cat.display_order })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Categorías</h2>
          <p className="text-muted-foreground text-sm">Gestiona las categorías de artistas y el ticker del hero</p>
        </div>
        <Button onClick={() => { setIsCreating(true); setEditing(null); resetForm() }} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Nueva Categoría
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {(isCreating || editing) && (
          <Card className="lg:col-span-1 bg-card/50 border-border/50 h-fit">
            <CardHeader><CardTitle>{editing ? "Editar Categoría" : "Nueva Categoría"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-background/50" placeholder="Rock Nacional" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (auto-generado si vacío)</Label>
                  <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="bg-background/50" placeholder="rock-nacional" />
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
          {categories.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-16 text-center">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hay categorías</h3>
                <p className="text-muted-foreground mb-6">Agrega tu primera categoría</p>
                <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" /> Crear Categoría
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Card key={cat.id} className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Tag className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{cat.slug}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Orden: {cat.display_order}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEditing(cat)} className="flex-1"><Edit className="h-3 w-3 mr-1" />Editar</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(cat.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /></Button>
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
