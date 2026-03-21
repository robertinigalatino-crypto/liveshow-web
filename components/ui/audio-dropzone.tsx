"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Music, Loader2, Play, Pause } from "lucide-react"

interface AudioDropzoneProps {
  value?: string
  onChange: (url: string) => void
  onUpload: (file: File) => Promise<string | null>
  onRemove?: (url: string) => Promise<void>
  label?: string
  className?: string
  compact?: boolean
}

export function AudioDropzone({
  value,
  onChange,
  onUpload,
  onRemove,
  label,
  className = "",
  compact = false,
}: AudioDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("audio/")) {
        alert("Solo se permiten archivos de audio (MP3, WAV, OGG)")
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

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (value) {
    return (
      <div className={`relative group ${className}`}>
        {label && (
          <span className="text-sm font-medium text-foreground mb-1.5 block">{label}</span>
        )}
        <div className={`relative flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50 ${compact ? "h-16" : "h-24"}`}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">Archivo de Audio</span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{value.split('/').pop()}</span>
            </div>
          </div>
          <audio ref={audioRef} src={value} onEnded={() => setIsPlaying(false)} />
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
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
          accept="audio/*"
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2 text-center" >
          {isUploading ? (
            <>
              <Loader2 className={`${compact ? "h-5 w-5" : "h-8 w-8"} text-primary animate-spin`} />
              <span className="text-xs text-muted-foreground">Subiendo audio...</span>
            </>
          ) : isDragging ? (
            <>
              <Upload className={`${compact ? "h-5 w-5" : "h-8 w-8"} text-primary`} />
              <span className="text-xs text-primary font-medium">Soltar audio aquí</span>
            </>
          ) : (
            <>
              <Music className={`${compact ? "h-5 w-5" : "h-8 w-8"} text-muted-foreground`} />
              <div>
                <span className="text-xs text-muted-foreground">
                  Arrastrá un audio o{" "}
                  <span className="text-primary font-medium">hacé click</span>
                </span>
                <p className="text-[10px] text-muted-foreground mt-1">MP3, WAV o OGG</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
