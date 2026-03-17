"use client"

import { useState, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { uploadFile, deleteFile } from "@/lib/supabase/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageDropzone } from "@/components/ui/image-dropzone"
import { Trash2, Plus, GripVertical } from "lucide-react"
import Image from "next/image"
import type { GalleryImage } from "@/lib/types"

interface GalleryAdminProps {
  images: GalleryImage[]
  type: "show_truck" | "tecnica"
  title: string
  description: string
  onRefresh: () => void
}

export function GalleryAdmin({ images, type, title, description, onRefresh }: GalleryAdminProps) {
  const [isUploading, setIsUploading] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  const handleUploadImage = useCallback(
    async (file: File) => uploadFile(supabase, "gallery", file),
    [supabase],
  )

  const handleRemoveImage = useCallback(
    async (url: string) => { await deleteFile(supabase, "gallery", url) },
    [supabase],
  )

  const onImageAdded = async (url: string) => {
    const { error } = await supabase.from("gallery_images").insert([
      {
        type,
        url,
        display_order: images.length,
      },
    ])
    if (!error) onRefresh()
  }

  async function handleDelete(id: string, url: string) {
    if (confirm("¿Eliminar esta imagen?")) {
      await handleRemoveImage(url)
      const { error } = await supabase.from("gallery_images").delete().eq("id", id)
      if (!error) onRefresh()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <Button onClick={() => setIsUploading(!isUploading)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> {isUploading ? "Cerrar" : "Nueva Imagen"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {isUploading && (
          <Card className="lg:col-span-1 bg-card/50 border-border/50 h-fit">
            <CardContent className="pt-6">
              <ImageDropzone
                label="Subir Imagen"
                value=""
                onChange={onImageAdded}
                onUpload={handleUploadImage}
                onRemove={handleRemoveImage}
              />
            </CardContent>
          </Card>
        )}

        <div className={isUploading ? "lg:col-span-2" : "lg:col-span-3"}>
          {images.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="py-16 text-center text-muted-foreground">
                No hay imágenes en esta galería.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="group bg-card/50 border-border/50 overflow-hidden relative aspect-square">
                  <Image src={image.url} alt="Gallery" fill className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(image.id, image.url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
