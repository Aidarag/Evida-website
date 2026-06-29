'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'neon' | 'accent' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FF5A1F] text-white font-bold shadow-[0_4px_14px_rgba(255,90,31,0.2)] hover:bg-[#e04b12] border border-transparent',
  secondary:
    'bg-[#121212] text-white font-bold shadow-[0_4px_14px_rgba(18,18,18,0.15)] hover:bg-black border border-transparent',
  accent:
    'bg-[#FF5A1F] text-white font-bold shadow-[0_4px_14px_rgba(255,90,31,0.2)] hover:bg-[#e04b12] border border-transparent',
  neon:
    'bg-[#FF5A1F] text-white font-bold shadow-[0_4px_14px_rgba(255,90,31,0.2)] hover:bg-[#e04b12] border border-transparent',
  ghost:
    'bg-transparent border border-[#121212]/10 hover:border-[#121212]/20 text-[#4F5666] hover:text-[#121212] hover:bg-[#121212]/[0.02] backdrop-blur-md',
  danger:
    'bg-[#FF5A1F] text-white font-bold hover:bg-red-600 border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-[11px] uppercase tracking-wider gap-1.5',
  md: 'px-6 py-2.5 text-xs uppercase tracking-wider gap-2',
  lg: 'px-8 py-3.5 text-sm uppercase tracking-wider gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, fullWidth, className = '', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          inline-flex items-center justify-center rounded-full cursor-pointer
          transition-all duration-200
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F]
          disabled:opacity-50 disabled:pointer-events-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...(props as any)}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
