"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Images, Loader2 } from "lucide-react"
import Image from "next/image"

interface GalleryDropzoneProps {
  value: string[]
  onChange: (urls: string[]) => void
  onUpload: (file: File) => Promise<string | null>
  onRemove?: (url: string) => Promise<void>
  label?: string
  className?: string
}

export function GalleryDropzone({
  value,
  onChange,
  onUpload,
  onRemove,
  label,
  className = "",
}: GalleryDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (files: FileList) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"))
      if (imageFiles.length === 0) {
        alert("Solo se permiten archivos de imagen (JPG, PNG, WebP, GIF)")
        return
      }

      setIsUploading(true)
      try {
        const urls: string[] = []
        for (const file of imageFiles) {
          const url = await onUpload(file)
          if (url) urls.push(url)
        }
        if (urls.length > 0) {
          onChange([...value, ...urls])
        }
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, onChange, value],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files?.length) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleFiles(e.target.files)
      }
      if (inputRef.current) inputRef.current.value = ""
    },
    [handleFiles],
  )

  const handleRemoveImage = useCallback(
    async (url: string) => {
      if (onRemove) await onRemove(url)
      onChange(value.filter((v) => v !== url))
    },
    [value, onChange, onRemove],
  )

  return (
    <div className={className}>
      {label && (
        <span className="text-sm font-medium text-foreground mb-1.5 block">{label}</span>
      )}

      {/* Gallery grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {value.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border/50">
              <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 p-4
          ${
            isDragging
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-border/50 hover:border-primary/50 hover:bg-card/80"
          }
          ${isUploading ? "pointer-events-none opacity-70" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-1.5 text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <span className="text-xs text-muted-foreground">Subiendo...</span>
            </>
          ) : isDragging ? (
            <>
              <Upload className="h-5 w-5 text-primary" />
              <span className="text-xs text-primary font-medium">Soltar imágenes aquí</span>
            </>
          ) : (
            <>
              <Images className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Arrastrá imágenes o{" "}
                <span className="text-primary font-medium">hacé click</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
