"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { uploadFile, deleteFile } from "@/lib/supabase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ImageDropzone } from "@/components/ui/image-dropzone"
import { AudioDropzone } from "@/components/ui/audio-dropzone"
import { Save, Settings, Check, Music } from "lucide-react"
import type { SiteSettings } from "@/lib/types"

interface SettingsAdminProps {
  settings: SiteSettings
  onRefresh: () => void
}

const settingsFields = [
  { key: "company_name", label: "Nombre de la Empresa", placeholder: "Live Show Producciones" },
  { key: "whatsapp_number", label: "Número de WhatsApp", placeholder: "5491131432020" },
  { key: "whatsapp_display", label: "WhatsApp (display)", placeholder: "+54 9 11 3143-2020" },
  { key: "instagram_handle", label: "Instagram Handle", placeholder: "liveshowproducciones" },
  { key: "location", label: "Ubicación", placeholder: "Buenos Aires, Argentina" },
  { key: "hero_title", label: "Título del Hero", placeholder: "Contrata los Mejores Shows para tu Evento" },
  { key: "hero_subtitle", label: "Subtítulo del Hero", placeholder: "Produccion integral de eventos..." },
  { key: "footer_description", label: "Descripción del Footer", placeholder: "Produccion integral de eventos..." },
  { key: "footer_event_types", label: "Tipos de eventos (footer)", placeholder: "Eventos corporativos • Fiestas privadas • Shows publicos" },
  { key: "hero_ticket_link", label: "Link de Botón de Entradas", placeholder: "#shows" },
  { key: "hero_tecnica_link", label: "Link de Botón Técnica", placeholder: "#servicios" },
  { key: "hero_show_truck_link", label: "Link de Botón Show Truck", placeholder: "#show-truck" },
]

export function SettingsAdmin({ settings, onRefresh }: SettingsAdminProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  const handleUploadLogo = useCallback(
    async (file: File) => uploadFile(supabase, "settings", file),
    [supabase],
  )

  const handleRemoveLogo = useCallback(
    async (url: string) => { await deleteFile(supabase, "settings", url) },
    [supabase],
  )

  useEffect(() => {
    const data: Record<string, string> = {}
    for (const field of settingsFields) {
      data[field.key] = settings[field.key] || ""
    }
    // Include logo_url, partnership_logo_url and background_audio_url which are handled separately
    data["logo_url"] = settings["logo_url"] || ""
    data["partnership_logo_url"] = settings["partnership_logo_url"] || ""
    data["background_audio_url"] = settings["background_audio_url"] || ""
    setFormData(data)
  }, [settings])

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    try {
      // Create an array of valid keys including logo_url, partnership_logo_url and background_audio_url
      const validKeys = [...settingsFields.map(f => f.key), "logo_url", "partnership_logo_url", "background_audio_url"]
      
      const updates = Object.entries(formData)
        .filter(([key, value]) => validKeys.includes(key) && value !== (settings[key] || ""))
        .map(([key, value]) => ({ key, value }))

      if (updates.length > 0) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(updates, { onConflict: 'key' })

        if (error) throw error
      }

      setSaved(true)
      onRefresh()
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error al guardar la configuración")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configuración del Sitio</h2>
          <p className="text-muted-foreground text-sm">Información general, contacto, textos del sitio</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90"
        >
          {saved ? (
            <><Check className="h-4 w-4 mr-2" /> Guardado</>
          ) : saving ? (
            <>Guardando...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Guardar Cambios</>
          )}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-primary" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ImageDropzone
                label="Logo del Sitio"
                value={formData["logo_url"] || ""}
                onChange={(url) => setFormData({ ...formData, logo_url: url })}
                onUpload={handleUploadLogo}
                onRemove={handleRemoveLogo}
                compact
              />
              <ImageDropzone
                label="Logo del Socio (Partnership)"
                value={formData["partnership_logo_url"] || ""}
                onChange={(url) => setFormData({ ...formData, partnership_logo_url: url })}
                onUpload={handleUploadLogo}
                onRemove={handleRemoveLogo}
                compact
              />
            </div>
            {settingsFields.slice(0, 5).map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  value={formData[field.key] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="bg-background/50"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-primary" />
              Textos del Sitio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settingsFields.slice(5).map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  value={formData[field.key] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="bg-background/50"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Audio Configuration */}
        <Card className="bg-card/50 border-border/50 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Music className="h-5 w-5 text-primary" />
              Música de Fondo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <AudioDropzone
                label="Archivo de Audio (Site-wide)"
                value={formData["background_audio_url"] || ""}
                onChange={(url) => setFormData({ ...formData, background_audio_url: url })}
                onUpload={(file) => uploadFile(supabase, "site-audio", file)}
                onRemove={async (url) => { await deleteFile(supabase, "site-audio", url) }}
                className="flex-1"
              />
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-primary">Nota:</strong> El audio se reproducirá automáticamente cuando el usuario interactúe con la página (haga clic en cualquier lugar). Se recomienda un archivo liviano (MP3).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
