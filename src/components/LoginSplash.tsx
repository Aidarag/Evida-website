'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import EvidaLogo from './ui/EvidaLogo';

interface LoginSplashProps {
  onStart: () => void;
}

export default function LoginSplash({ onStart }: LoginSplashProps) {
  const shouldReduceMotion = useReducedMotion();

  // Animating the blurry background blobs organically
  const blobVariants1 = {
    animate: {
      x: shouldReduceMotion ? 0 : [0, 60, -40, 30, 0],
      y: shouldReduceMotion ? 0 : [0, -50, 60, -30, 0],
      scale: shouldReduceMotion ? 1 : [1, 1.15, 0.9, 1.05, 1],
      rotate: shouldReduceMotion ? 0 : [0, 90, 180, 270, 360],
    }
  };

  const blobVariants2 = {
    animate: {
      x: shouldReduceMotion ? 0 : [0, -50, 40, -30, 0],
      y: shouldReduceMotion ? 0 : [0, 40, -50, 20, 0],
      scale: shouldReduceMotion ? 1 : [1, 0.9, 1.15, 0.95, 1],
      rotate: shouldReduceMotion ? 0 : [0, -90, -180, -270, -360],
    }
  };

  const blobVariants3 = {
    animate: {
      x: shouldReduceMotion ? 0 : [0, 30, -30, 40, 0],
      y: shouldReduceMotion ? 0 : [0, 30, -40, 30, 0],
      scale: shouldReduceMotion ? 1 : [1, 1.1, 0.85, 1.1, 1],
      rotate: shouldReduceMotion ? 0 : [0, 120, 240, 360],
    }
  };

  return (
    <div className="fixed inset-0 min-h-[100svh] w-full bg-white text-[#2A2621] flex flex-col justify-between overflow-hidden z-50 select-none">
      
      {/* Background Neon Glowing Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Blob 1: Lime Green */}
        <motion.div
          variants={blobVariants1}
          animate="animate"
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[10%] w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full bg-[#FD5C05] opacity-[0.35] blur-[90px] md:blur-[130px] will-change-transform"
        />

        {/* Blob 2: Silver Feather */}
        <motion.div
          variants={blobVariants2}
          animate="animate"
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-15%] right-[15%] w-[320px] md:w-[450px] h-[320px] md:h-[450px] rounded-full bg-[#D8D2BC] opacity-[0.45] blur-[90px] md:blur-[130px] will-change-transform"
        />

        {/* Blob 3: Light Lime Yellow Wash */}
        <motion.div
          variants={blobVariants3}
          animate="animate"
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[5%] left-[35%] w-[280px] md:w-[400px] h-[280px] md:h-[400px] rounded-full bg-[#e2fcc5] opacity-[0.4] blur-[80px] md:blur-[120px] will-change-transform"
        />

        {/* Blob 4: Darker Lime Green */}
        <motion.div
          variants={blobVariants1}
          animate="animate"
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-5%] left-[25%] w-[380px] md:w-[520px] h-[380px] md:h-[520px] rounded-full bg-[#7ca302] opacity-[0.16] blur-[100px] md:blur-[140px] will-change-transform"
        />

      </div>

      {/* Center-Left Content Block */}
      <div className="flex-1 flex items-center z-10 px-8 md:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="space-y-6 max-w-md text-left"
        >
          <div className="flex items-center -ml-1">
            <EvidaLogo size={60} showText={true} lightMode={true} />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-[#2A2621] leading-tight pl-0.5 tracking-tight">
            Campus life,<br />
            finally in one place.
          </p>
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="z-10 px-8 md:px-24 pb-12 md:pb-16 flex items-center justify-between w-full">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-[10px] font-black uppercase tracking-widest text-[#2A2621]/60"
        >
          Get Started
        </motion.span>

        <motion.button
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ 
            scale: shouldReduceMotion ? 1 : [1, 1.04, 1],
            opacity: 1,
            boxShadow: shouldReduceMotion 
              ? "0 4px 14px rgba(189, 251, 4, 0.3)" 
              : [
                  "0 0 0 0 rgba(189, 251, 4, 0.2)",
                  "0 0 20px 4px rgba(189, 251, 4, 0.45)",
                  "0 0 0 0 rgba(189, 251, 4, 0.2)"
                ]
          }}
          transition={{
            scale: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
            boxShadow: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
            opacity: { delay: 0.5, duration: 0.4 }
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="h-14 w-14 rounded-full bg-[#FD5C05] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(235,70,0,0.25)] cursor-pointer transition-colors hover:bg-[#CC3D00] border border-[#D8D2BC]/40"
        >
          <ArrowUpRight className="h-6 w-6 text-white stroke-[2.5]" />
        </motion.button>
      </div>

    </div>
  );
}
