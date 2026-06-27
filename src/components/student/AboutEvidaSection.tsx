'use client';

import React from 'react';
import Image from 'next/image';
import { GraduationCap, Music, Globe, CalendarDays, Users, Trophy } from 'lucide-react';

export default function AboutEvidaSection() {
  return (
    <section className="relative w-full bg-[#0F0F13] py-24 overflow-hidden border-y border-white/10 font-sans">
      {/* Background Texture / Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#15151A] to-[#0F0F13] opacity-50 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 relative">
          {/* Top Left Text */}
          <div className="rotate-[-6deg] mb-8 md:mb-0">
            <h2 className="text-white font-black text-3xl md:text-5xl uppercase tracking-widest leading-none" style={{ fontFamily: 'var(--font-lufga)' }}>
              About <br /> <span className="text-[var(--color-evida-lime)]">Evida</span>
            </h2>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
            <div className="flex items-center justify-center">
              <span className="text-white font-black text-2xl tracking-[0.3em] uppercase bg-gradient-to-r from-[var(--color-evida-blue)] to-[var(--color-evida-coral)] bg-clip-text text-transparent">
                EVIDA
              </span>
            </div>
            {/* Campus Icons row */}
            <div className="flex items-center gap-6 md:gap-12 mt-8 text-white/50">
              <GraduationCap className="h-6 w-6 hover:text-[var(--color-evida-lime)] transition-colors cursor-pointer" />
              <Music className="h-6 w-6 hover:text-[var(--color-evida-coral)] transition-colors cursor-pointer" />
              <Trophy className="h-6 w-6 hover:text-[var(--color-evida-blue)] transition-colors cursor-pointer" />
              <CalendarDays className="h-6 w-6 hover:text-[var(--color-evida-lime)] transition-colors cursor-pointer" />
              <Users className="h-6 w-6 hover:text-[var(--color-evida-coral)] transition-colors cursor-pointer" />
            </div>
          </div>
          
          {/* Top Right Decorative (optional) */}
          <div className="hidden md:block">
            <div className="text-white/20 font-black text-xl tracking-widest rotate-[4deg]">EST. 2024</div>
          </div>
        </div>

        {/* Central Purple-ish / Brand Block */}
        <div className="relative w-full max-w-5xl mx-auto mt-24">
          
          {/* The main block background */}
          <div className="bg-[var(--color-evida-blue)]/10 border border-[var(--color-evida-blue)]/20 rounded-[40px] p-12 md:p-24 text-center relative z-20 backdrop-blur-sm">
            
            <p className="text-[var(--color-evida-lime)] text-sm md:text-base font-black tracking-[0.3em] uppercase mb-8">
              Who We Are
            </p>

            <h3 className="text-white font-black text-3xl md:text-5xl uppercase leading-tight mb-8" style={{ fontFamily: 'var(--font-lufga)' }}>
              The Digital Home of Campus Life.
            </h3>
            
            <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
              Evida brings every campus event, organization, and opportunity into one place, helping students discover experiences, build connections, and create unforgettable college memories.
            </p>

          </div>

          {/* Absolute positioned polaroid photos */}
          
          {/* Top Left Photo */}
          <div className="absolute -top-16 -left-12 md:-left-24 z-30 rotate-[-8deg] hover:rotate-[-2deg] transition-transform duration-300">
            <div className="bg-white p-3 pb-10 rounded-sm shadow-2xl w-48 md:w-64 border border-gray-200">
              <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
                <Image src="/pexels-amar-20025867.jpg" alt="Campus Concert" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <p className="absolute bottom-3 left-0 w-full text-center text-black font-bold text-xs uppercase tracking-wider handwritten-font">Welcome Week</p>
            </div>
          </div>

          {/* Top Right Photo */}
          <div className="absolute -top-10 -right-8 md:-right-16 z-30 rotate-[6deg] hover:rotate-[0deg] transition-transform duration-300">
            <div className="bg-white p-3 pb-10 rounded-sm shadow-2xl w-40 md:w-56 border border-gray-200">
              <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
                <Image src="/pexels-nick-rush-2508183-11211233.jpg" alt="Basketball Game" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <p className="absolute bottom-3 left-0 w-full text-center text-black font-bold text-xs uppercase tracking-wider handwritten-font">Game Day</p>
            </div>
          </div>

          {/* Bottom Left Photo */}
          <div className="absolute -bottom-16 -left-4 md:-left-12 z-30 rotate-[4deg] hover:rotate-[-2deg] transition-transform duration-300">
            <div className="bg-white p-3 pb-10 rounded-sm shadow-2xl w-44 md:w-60 border border-gray-200">
              <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
                <Image src="/pexels-maorattias-5191958.jpg" alt="Party" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <p className="absolute bottom-3 left-0 w-full text-center text-black font-bold text-xs uppercase tracking-wider handwritten-font">Homecoming</p>
            </div>
          </div>

          {/* Bottom Right Photo */}
          <div className="absolute -bottom-12 -right-12 md:-right-24 z-30 rotate-[-5deg] hover:rotate-[2deg] transition-transform duration-300">
            <div className="bg-white p-3 pb-10 rounded-sm shadow-2xl w-48 md:w-64 border border-gray-200">
              <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
                <Image src="/pexels-rdne-7648057.jpg" alt="Career Fair" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
              <p className="absolute bottom-3 left-0 w-full text-center text-black font-bold text-xs uppercase tracking-wider handwritten-font">Career Fair</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
