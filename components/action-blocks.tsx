"use client"

import Link from "next/link"

export function ActionBlocks() {
  return (
    <section className="bg-black py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Next Shows Block */}
        <div
          className="group relative"
        >
          <Link href="#shows" className="block relative overflow-hidden rounded-2xl bg-[#EF4444] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(239,68,68,0.3)]">
            <div className="px-6 py-12 sm:py-16 flex items-center justify-center text-center">
              <h3 className="text-white text-2xl sm:text-4xl font-black italic tracking-tighter uppercase">
                PROXIMOS SHOWS
              </h3>
            </div>
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>

        {/* Buy Tickets Block */}
        <div
          className="group relative"
        >
          <Link href="#shows" className="block relative overflow-hidden rounded-2xl bg-[#EF4444] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(239,68,68,0.3)]">
            <div className="px-6 py-12 sm:py-16 flex flex-col items-center justify-center text-center">
              <h3 className="text-white text-2xl sm:text-4xl font-black italic tracking-tighter uppercase leading-tight">
                COMPRA TUS <br /> ENTRADAS
              </h3>
            </div>
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>
      </div>
    </section>
  )
}
