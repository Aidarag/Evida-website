'use client';

import React from 'react';
import { Event } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface FeaturedEventCardProps {
  event: Event;
  onClick: () => void;
}

export default function FeaturedEventCard({ event, onClick }: FeaturedEventCardProps) {
  // If the cover image is a gradient (used in mock data), we handle it. 
  // Otherwise, we use it as a background image with grayscale filter.
  const isGradient = event.coverImage ? event.coverImage.includes('from-') : false;
  const bgClass = isGradient ? event.coverImage : (event.coverImage ? '' : 'bg-gray-800');
  const bgStyle = (!isGradient && event.coverImage) 
    ? { backgroundImage: `url(${event.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : {};

  // For styling the text, we parse the date to match the reference (e.g. SAT 26 JUN)
  const dateObj = new Date(event.date);
  const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dateStr = dateObj.getDate();
  const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <div 
      onClick={onClick} 
      className="group cursor-pointer flex flex-col bg-[#1A1A1E] rounded-[24px] overflow-hidden hover:bg-[#222226] transition-colors border border-white/5"
    >
      {/* Sharp image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
        {/* The actual image */}
        <div 
          className={`absolute inset-0 transition-transform duration-500 group-hover:scale-105 ${bgClass}`}
          style={bgStyle}
        />
        
        {/* Neon Badge top right */}
        <div className="absolute top-4 right-4 z-10 flex">
          <div className="bg-[var(--color-evida-lime)] px-3 py-1 text-[10px] font-black text-black tracking-widest uppercase rounded-full shadow-lg">
            {event.category === 'Art' ? 'Exhibition' : event.category}
          </div>
        </div>
      </div>

      {/* Content Below Image */}
      <div className="px-5 pb-5 pt-4 flex flex-col flex-1 gap-2">
        {/* Date text (neon) */}
        <div className="text-[var(--color-evida-lime)] text-[10px] font-black tracking-wider uppercase mb-1">
          {dayStr} {dateStr} {monthStr}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">
          {event.title}
        </h3>
        
        {/* Description */}
        <p className="text-[12px] text-gray-400 line-clamp-3 leading-relaxed mt-1 flex-1">
          {event.description || `Join us for the ${event.title}, happening at ${event.location}.`}
        </p>

        {/* Footer line */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <span className="text-[var(--color-evida-lime)] text-[12px] font-black tracking-wide">
            {event.status === 'approved' ? 'FREE' : 'TICKETED'}
          </span>
          <span className="text-white text-[11px] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
            Learn more <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
