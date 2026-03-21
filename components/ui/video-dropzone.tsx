"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Video, Loader2 } from "lucide-react"

interface VideoDropzoneProps {
  value?: string
  onChange: (url: string) => void
  onUpload: (file: File) => Promise<string | null>
  onRemove?: (url: string) => Promise<void>
  label?: string
  className?: string
  compact?: boolean
}

export function VideoDropzone({
  value,
  onChange,
  onUpload,
  onRemove,
  label,
  className = "",
  compact = false,
}: VideoDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("video/")) {
        alert("Solo se permiten archivos de video (MP4, QuickTime, WebM)")
        return
      }
      setIsUploading(true)
      try {
        const url = await onUpload(file)
        if (url) onChange(url)
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, onChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
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
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      if (inputRef.current) inputRef.current.value = ""
    },
    [handleFile],
  )

  const handleRemove = useCallback(async () => {
    if (value && onRemove) {
      await onRemove(value)
    }
    onChange("")
  }, [value, onRemove, onChange])

  if (value) {
    return (
      <div className={`relative group ${className}`}>
        {label && (
          <span className="text-sm font-medium text-foreground mb-1.5 block">{label}</span>
        )}
        <div className={`relative overflow-hidden rounded-lg border border-border/50 bg-card/50 ${compact ? "h-24" : "h-40"}`}>
          <video
            src={value}
            className="w-full h-full object-contain"
            controls
          />
          <div className="absolute top-2 right-2 z-10">
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {label && (
        <span className="text-sm font-medium text-foreground mb-1.5 block">{label}</span>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200
          ${compact ? "p-4" : "p-6"}
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
          accept="video/*"
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2 text-center" >
          {isUploading ? (
            <>
              <Loader2 className={`${compact ? "h-5 w-5" : "h-8 w-8"} text-primary animate-spin`} />
              <span className="text-xs text-muted-foreground">Subiendo video...</span>
            </>
          ) : isDragging ? (
            <>
              <Upload className={`${compact ? "h-5 w-5" : "h-8 w-8"} text-primary`} />
              <span className="text-xs text-primary font-medium">Soltar video aquí</span>
            </>
          ) : (
            <>
              <Video className={`${compact ? "h-5 w-5" : "h-8 w-8"} text-muted-foreground`} />
              <div>
                <span className="text-xs text-muted-foreground">
                  Arrastrá un video o{" "}
                  <span className="text-primary font-medium">hacé click</span>
                </span>
                <p className="text-[10px] text-muted-foreground mt-1">MP4, WebM o MOV (máx. 50MB)</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
