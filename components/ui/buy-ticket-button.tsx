"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BuyTicketButtonProps extends React.ComponentProps<typeof Button> {
  // Add any extra props if needed
}

export function BuyTicketButton({ className, children, ...props }: BuyTicketButtonProps) {
  return (
    <div className="relative inline-block w-full sm:w-auto overflow-visible group/btn">
      <Button
        className={cn(
          "relative z-10 w-full sm:w-auto transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </Button>
      
      {/* Animated Pointing Hand - Only visible on hover/active or permanently if requested? 
          The user said "quiero que pongamos un dedo asi que esta en el boton", 
          implying it should be visible to attract attention. I'll make it always visible with a smooth animation.
      */}
      <div className="absolute -right-6 -bottom-6 z-20 pointer-events-none select-none animate-hand-bounce pointer-events-none">
        <div className="relative">
          {/* Hand SVG - Inspired by the user image */}
          <svg
            width="50"
            height="50"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transform -rotate-12"
          >
            {/* Click Rays */}
            <g className="animate-rays-pulse">
              <line x1="40" y1="20" x2="40" y2="5" stroke="white" strokeWidth="4" strokeLinecap="round" />
              <line x1="25" y1="25" x2="15" y2="15" stroke="white" strokeWidth="4" strokeLinecap="round" />
              <line x1="55" y1="25" x2="65" y2="15" stroke="white" strokeWidth="4" strokeLinecap="round" />
            </g>
            
            {/* Hand Path */}
            <path
              d="M40 30V80C40 85.5228 44.4772 90 50 90H60C71.0457 90 80 81.0457 80 70V55C80 49.4772 75.5228 45 70 45H65L65 40C65 34.4772 60.5228 30 55 30H40Z"
              fill="white"
              stroke="black"
              strokeWidth="2.5"
            />
            {/* Index Finger */}
            <rect
              x="38"
              y="20"
              width="14"
              height="35"
              rx="7"
              fill="white"
              stroke="black"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>

      <style jsx global>{`
        @keyframes hand-bounce {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-6px, -6px) scale(1.05);
          }
        }
        .animate-hand-bounce {
          animation: hand-bounce 2s ease-in-out infinite;
        }
        @keyframes rays-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-rays-pulse {
          animation: rays-pulse 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
