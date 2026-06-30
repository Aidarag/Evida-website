'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({ children, className = '', onClick, hover = true, glass = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-[24px]
        ${glass
          ? 'bg-white/80 backdrop-blur-xl border border-black/[0.05]'
          : 'bg-white border border-black/[0.04]'
        }
        shadow-[var(--shadow-premium-md)]
        transition-all duration-300
        ${hover ? 'hover:shadow-[var(--shadow-premium-lg)] hover:border-[#E8FF40]/10 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
