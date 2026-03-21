"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Music } from "lucide-react"

interface BackgroundMusicProps {
  audioUrl?: string
}

export function BackgroundMusic({ audioUrl }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioUrl) return

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
        setIsMuted(false)
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true)
          }).catch(err => {
            console.log("Autoplay blocked or failed:", err)
          })
        }
        // Remove listeners after first interaction
        window.removeEventListener("click", handleInteraction)
        window.removeEventListener("touchstart", handleInteraction)
      }
    }

    window.addEventListener("click", handleInteraction)
    window.addEventListener("touchstart", handleInteraction)

    return () => {
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
    }
  }, [audioUrl, hasInteracted])

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted
      audioRef.current.muted = newMuted
      setIsMuted(newMuted)
      
      if (!newMuted && !isPlaying) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  if (!audioUrl) return null

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex items-center gap-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        muted={isMuted}
      />
      
      {!hasInteracted && (
        <div className="absolute bottom-full mb-3 left-0 bg-primary/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap animate-bounce shadow-lg">
          Hacé click para activar música 🎵
        </div>
      )}

      <button
        onClick={toggleMute}
        className={`group relative p-3 rounded-full border backdrop-blur-md transition-all duration-500 shadow-2xl ${
          !isMuted 
            ? "bg-primary border-primary text-white scale-110 shadow-primary/40" 
            : "bg-black/50 border-white/10 text-white/60 hover:text-white hover:border-white/30"
        }`}
        title={isMuted ? "Activar música" : "Silenciar música"}
      >
        {!isMuted && isPlaying && (
          <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
        )}
        
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5 animate-pulse" />
        )}

        {/* Floating Notes Decoration */}
        {!isMuted && isPlaying && (
          <div className="absolute -top-1 -right-1">
            <Music className="h-3 w-3 text-primary animate-bounce" />
          </div>
        )}
      </button>
    </div>
  )
}
