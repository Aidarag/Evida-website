'use client';

import React from 'react';

type BadgeVariant = 'pending' | 'approved' | 'rejected' | 'info' | 'accent';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  pending: 'bg-[#FF5A1F]/10 text-[#FF5A1F] border-[#FF5A1F]/20',
  approved: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
  rejected: 'bg-gray-100 text-gray-500 border-gray-200/60',
  info: 'bg-[#4F7CFF]/10 text-[#4F7CFF] border-[#4F7CFF]/20',
  accent: 'bg-[#8257FF]/10 text-[#8257FF] border-[#8257FF]/20',
};

export default function Badge({ variant = 'info', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-3.5 py-0.5
        text-[10px] font-bold uppercase tracking-wider
        border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
