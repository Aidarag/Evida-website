'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Shield, 
  Users, 
  Trophy,
  ChevronDown,
  Sparkles,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Search,
  MapPin,
  Clock,
  Check,
  Wifi,
  Battery,
  Signal,
  ArrowLeft,
  GraduationCap,
  Mail,
  Plus,
  Compass,
  Menu,
  X
} from 'lucide-react';
import { Event } from '@/lib/types';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import EvidaLogo from '@/components/ui/EvidaLogo';
import Link from 'next/link';

interface LandingPageProps {
  featuredEvents: Event[];
  onExplore: () => void;
  onCreateEvent: () => void;
  onLogin: () => void;
}

export default function LandingPage({
  featuredEvents,
  onExplore,
  onCreateEvent,
  onLogin,
}: LandingPageProps) {
  // Navigation hamburger menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Waitlist submission states
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  // FAQ Accordion State
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Scroll helpers for Hero CTAs
  const handleJoinWaitlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = document.getElementById('waitlist-email') as HTMLInputElement | null;
        if (input) input.focus();
      }, 800);
    }
  };

  const handleSeeHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Waitlist form handler
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) return;
    setWaitlistLoading(true);
    setTimeout(() => {
      setWaitlistLoading(false);
      setWaitlistSubmitted(true);
    }, 1000);
  };

  // Smartphone Showcase States
  const [phoneActive, setPhoneActive] = useState(false);
  const [currentView, setCurrentView] = useState<'feed' | 'explore' | 'details'>('feed');
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 100
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);

  const feedScrollRef = useRef<HTMLDivElement>(null);
  const detailsScrollRef = useRef<HTMLDivElement>(null);

  const handlePhoneClick = () => {
    if (!phoneActive) {
      setPhoneActive(true);
      setCurrentView('feed');
      setScrollProgress(0);
      setRsvpConfirmed(false);
      setTimeout(() => {
        if (feedScrollRef.current) feedScrollRef.current.scrollTop = 0;
        if (detailsScrollRef.current) detailsScrollRef.current.scrollTop = 0;
      }, 50);
    }
  };

  const handleCardTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('details');
    setScrollProgress(0);
    setTimeout(() => {
      if (detailsScrollRef.current) detailsScrollRef.current.scrollTop = 0;
    }, 50);
  };

  const handleBackTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('feed');
    setScrollProgress(0);
    setTimeout(() => {
      if (feedScrollRef.current) feedScrollRef.current.scrollTop = 0;
    }, 50);
  };

  const handleRsvpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (rsvpConfirmed) return;
    setRsvpConfirmed(true);
    setTimeout(() => {
      setPhoneActive(false);
      setRsvpConfirmed(false);
      setCurrentView('feed');
      setScrollProgress(0);
    }, 1500);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(progress);
  };

  const activeStep = currentView === 'feed'
    ? (scrollProgress < 30 ? 0 : (scrollProgress < 75 ? 1 : 2))
    : currentView === 'explore'
      ? 1
      : (scrollProgress < 50 ? 3 : 4);

  // References for scroll animations
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scale and Lift animations for the smartphone shell
  const phoneScale = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.9, 1.05, 1]);
  const phoneY = useTransform(scrollYProgress, [0, 0.4, 0.8], [60, -10, 0]);

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is Evida?",
      answer: "Evida is a premium, unified digital home for student life. It aggregates campus events, student organizations, promotions, and opportunities into a high-end, responsive feed."
    },
    {
      question: "How do I get started?",
      answer: "Click any 'Get Started' button to go to our access selection screen, select whether you are a Student or a School Administrator, and immediately explore the platforms and dashboards."
    },
    {
      question: "Can universities use Evida for administration?",
      answer: "Yes. Evida includes a school dashboard featuring advanced real-time attendance analytics, organization roster management, and smart approval workflows for student events."
    },
    {
      question: "What makes Evida different from other portals?",
      answer: "Unlike complex and fragmented administrative systems, Evida combines beautiful streetwear aesthetics, micro-interactions, fast loading, and modular design. We prioritize UX design and engagement above all."
    }
  ];

  return (
    <div className="min-h-screen bg-[#EAE4CF] text-[#2A2621] flex flex-col justify-between overflow-x-hidden font-sans scroll-smooth">
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#D8D2BC] bg-[#EAE4CF]/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 relative">
          <div className="flex items-center gap-2 shrink-0">
            <EvidaLogo size={32} lightMode={true} text="EVIDA" />
          </div>

          {/* Centered navigation links (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#why-evida" className="relative py-1.5 text-[10px] font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#FB1C07] after:to-[#FC7C0B] after:transition-all after:duration-300">
              Why Evida
            </a>
            <a href="#about" className="relative py-1.5 text-[10px] font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#FB1C07] after:to-[#FC7C0B] after:transition-all after:duration-300">
              About
            </a>
            <a href="#how-it-works" className="relative py-1.5 text-[10px] font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#FB1C07] after:to-[#FC7C0B] after:transition-all after:duration-300">
              How It Works
            </a>
            <a href="#features" className="relative py-1.5 text-[10px] font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#FB1C07] after:to-[#FC7C0B] after:transition-all after:duration-300">
              Core Features
            </a>
            <a href="#faq" className="relative py-1.5 text-[10px] font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#FB1C07] after:to-[#FC7C0B] after:transition-all after:duration-300">
              FAQ
            </a>
          </nav>

          {/* Right side circular hamburger menu button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-[#D8D2BC] flex items-center justify-center bg-[#EAE4CF] hover:bg-white shadow-sm transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-4.5 w-4.5 text-[#2A2621] transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="h-4.5 w-4.5 text-[#2A2621] transition-transform duration-200" />
              )}
            </button>
          </div>

          {/* Responsive Dropdown Menu */}
          <AnimatePresence>
            {menuOpen && (
              <>
                {/* Backdrop (closes menu when clicked) */}
                <div 
                  className="fixed inset-0 z-30 bg-transparent"
                  onClick={() => setMenuOpen(false)}
                />
                
                {/* Responsive Dropdown Menu */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-4 sm:right-6 md:right-8 top-16 z-40 w-72 rounded-[24px] border border-[#D8D2BC] bg-white/95 backdrop-blur-md p-6 shadow-xl flex flex-col gap-4 text-left"
                >
                  {/* Links */}
                  <div className="flex flex-col gap-3.5 border-b border-[#D8D2BC]/40 pb-4">
                    <a
                      href="#why-evida"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest py-1 transition-all"
                    >
                      Why Evida
                    </a>
                    <a
                      href="#about"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest py-1 transition-all"
                    >
                      About
                    </a>
                    <a
                      href="#how-it-works"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest py-1 transition-all"
                    >
                      How It Works
                    </a>
                    <a
                      href="#features"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest py-1 transition-all"
                    >
                      Core Features
                    </a>
                    <a
                      href="#faq"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-black text-[#5A554E] hover:text-[#FD5C05] uppercase tracking-widest py-1 transition-all"
                    >
                      FAQ
                    </a>
                  </div>

                  {/* Actions (Join Waitlist Button only) */}
                  <div className="pt-1">
                    <button
                      onClick={(e) => {
                        setMenuOpen(false);
                        handleJoinWaitlistClick(e);
                      }}
                      className="w-full rounded-full bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] hover:brightness-105 hover:-translate-y-0.5 text-white text-xs font-black py-3.5 transition-all duration-300 border border-white/10 cursor-pointer shadow-md shadow-[#FB1C07]/20 uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <span>Join Waitlist</span>
                      <ArrowRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section - Wenspire Visual Style */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pt-20 sm:pt-24 pb-12 w-full relative">
        {/* Soft floating blurred gradient blobs for premium lighting */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-gradient-to-br from-[#FB1C07] to-[#FC7C0B] opacity-[0.12] blur-[100px] md:blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-gradient-to-br from-[#FD4002] to-[#FC7C0B] opacity-[0.08] blur-[90px] md:blur-[130px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[24px] md:rounded-[48px] overflow-hidden border border-[#D8D2BC]/40 shadow-2xl min-h-[480px] md:min-h-[600px] flex flex-col justify-center p-6 sm:p-8 md:p-16 text-white z-10"
        >
          {/* Background image & overlays */}
          <div className="absolute inset-0 bg-cover bg-center z-0 filter blur-[12px] scale-[1.05]" style={{ backgroundImage: "url('/evida-hero-bg-orange.png')" }} />
          <div className="absolute inset-0 bg-[#2A2621]/25 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A2621]/90 via-[#2A2621]/15 to-[#2A2621]/45 z-10" />

          {/* Top Row: Floating Badge */}
          <div className="absolute top-6 sm:top-8 left-6 sm:left-8 md:top-16 md:left-16 z-20 flex items-center justify-start">
            <span className="flex items-center gap-2 rounded-full bg-black/35 border border-white/10 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-[#FD5C05] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FB1C07] animate-pulse" />
              Now in private beta
            </span>
          </div>

          {/* Middle Row: Content */}
          <div className="relative z-20 space-y-5 max-w-2xl text-left pt-12 pb-4 sm:pt-8 sm:pb-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.05] sm:leading-[0.95] text-white">
              Everything Happening <br />
              <span className="bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] bg-clip-text text-transparent inline-block">on Campus.</span>
            </h1>
            <p className="text-[11px] sm:text-sm text-gray-300 max-w-lg leading-relaxed font-medium">
              Evida brings campus events, student organizations, promotions, and opportunities into one place. Discover what’s happening, connect with your community, and never miss campus life.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs pt-2">
              <button
                onClick={handleJoinWaitlistClick}
                className="w-full rounded-full bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] hover:brightness-110 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(251,28,7,0.25)] hover:shadow-[0_6px_20px_rgba(251,28,7,0.35)] px-6 py-4 text-xs font-black text-white transition-all duration-300 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <span>Join the Waitlist</span>
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={handleSeeHowItWorksClick}
                className="w-full rounded-full border border-[#FD5C05] bg-[#EAE4CF] hover:bg-[#FD5C05] hover:text-white px-6 py-4 text-xs font-black text-[#FD5C05] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center"
              >
                See How It Works
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Evida Smartphone Experience */}
      <section id="experience" ref={sectionRef} className="py-16 md:py-24 bg-[#A2C2BE]/10 border-y border-[#D8D2BC] overflow-hidden flex flex-col items-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-3 mb-10">
          <span className="rounded-full bg-[#2A2621] text-[#FD5C05] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest inline-block shadow-sm">
            Take a tour
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
            Experience Evida
          </h2>
          <p className="text-xs text-[#5A554E] font-semibold max-w-md mx-auto leading-relaxed">
            Tap the phone below to unlock scroll controls and browse a live tour of the app interface.
          </p>
        </div>

        {/* Smartphone Container */}
        <div className="relative w-full max-w-[900px] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-4 sm:px-6">
          
          {/* Left Side: Demo Progress Indicators (Visible in interactive mode) */}
          <div className="hidden md:flex flex-col gap-4 text-left min-w-[160px]">
            <div className="space-y-1.5">
              <span className="block text-[8px] font-black uppercase tracking-wider text-[#5A554E]">Tour Progress</span>
              <div className="h-1 bg-black/10 rounded-full w-28 overflow-hidden">
                <motion.div 
                  className="h-full bg-[#2A2621]"
                  animate={{ width: `${(activeStep + 1) * 20}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeStep === 0 
                    ? 'bg-[#2A2621] border-[#2A2621] text-[#FD5C05] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-[#5A554E]'
                }`}>1</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 0 ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>Dashboard</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeStep === 1 
                    ? 'bg-[#2A2621] border-[#2A2621] text-[#FD5C05] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-[#5A554E]'
                }`}>2</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 1 ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>Discover</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeStep === 2 
                    ? 'bg-[#2A2621] border-[#2A2621] text-[#FD5C05] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-[#5A554E]'
                }`}>3</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 2 ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>Experiences</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeStep === 3 
                    ? 'bg-[#2A2621] border-[#2A2621] text-[#FD5C05] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-[#5A554E]'
                }`}>4</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 3 ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>Details</span>
              </div>

              <div className="flex items-center gap-3 transition-all duration-300">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                  activeStep === 4 
                    ? 'bg-[#2A2621] border-[#2A2621] text-[#FD5C05] scale-110 shadow-md' 
                    : 'bg-white border-black/10 text-[#5A554E]'
                }`}>5</div>
                <span className={`text-[9px] font-black uppercase tracking-wider ${activeStep === 4 ? 'text-[#2A2621]' : 'text-[#5A554E]'}`}>RSVP</span>
              </div>
            </div>
          </div>

          {/* Center: Smartphone Shell */}
          <motion.div
            style={{ scale: phoneScale, y: phoneY }}
            onClick={handlePhoneClick}
            className={`relative max-w-[310px] w-full aspect-[9/19.5] rounded-[44px] border-[10px] border-neutral-950 shadow-2xl bg-neutral-900 z-20 cursor-pointer overflow-hidden select-none ${
              phoneActive ? 'ring-4 ring-[#FD5C05]/30' : 'hover:scale-[1.02] transition-transform duration-300'
            }`}
          >
            {/* Gloss reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 z-40 pointer-events-none" />

            {/* Dynamic Island / Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-center shadow-inner">
              <div className="h-1.5 w-1.5 bg-neutral-900 rounded-full ml-auto mr-3 border border-neutral-800" />
            </div>

            {/* Internal Phone Status Bar */}
            <div className="absolute top-1.5 inset-x-6 z-50 flex items-center justify-between text-[8px] text-white font-bold select-none px-2 pointer-events-none">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="h-2 w-2" />
                <Wifi className="h-2 w-2" />
                <Battery className="h-2 w-3" />
              </div>
            </div>

            {/* Internal Phone Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />

            {/* Locked screen guide overlay */}
            {!phoneActive && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs z-30 flex flex-col items-center justify-center text-center p-6 text-white space-y-4">
                <div className="h-12 w-12 rounded-full bg-white border border-[#D8D2BC]/30 flex items-center justify-center shadow-lg animate-bounce">
                  <EvidaLogo size={22} showText={false} lightMode={true} />
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-[#FD5C05]">Take a tour</span>
                  <span className="block text-[11px] font-bold text-gray-200">Tap to unlock screen</span>
                </div>
              </div>
            )}

            {/* User Journey Screens (Native Scrollable Containers like Posh) */}
            <div className="w-full h-full relative z-10 overflow-hidden bg-[#121212] touch-none">
              
              {/* Bottom Tab Navigation */}
              <div className="absolute bottom-0 inset-x-0 bg-[#121212]/95 backdrop-blur-md border-t border-white/5 py-1.5 px-6 flex justify-between items-center z-30">
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentView('feed'); }}
                  className={`flex flex-col items-center gap-0.5 transition-colors duration-200 ${currentView === 'feed' ? 'text-[#FD5C05]' : 'text-[#5A554E]/80 hover:text-gray-300'}`}
                >
                  <Compass className="h-4.5 w-4.5" />
                  <span className="text-[6px] font-black uppercase tracking-wider">Feed</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentView('explore'); }}
                  className={`flex flex-col items-center gap-0.5 transition-colors duration-200 ${currentView === 'explore' ? 'text-[#FD5C05]' : 'text-[#5A554E]/80 hover:text-gray-300'}`}
                >
                  <Search className="h-4.5 w-4.5" />
                  <span className="text-[6px] font-black uppercase tracking-wider">Explore</span>
                </button>
                <div className="h-8 w-8 rounded-full bg-[#FD5C05] text-[#2A2621] flex items-center justify-center -translate-y-2 border-4 border-[#121212] shadow-lg">
                  <Plus className="h-4 w-4 stroke-[3]" />
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className="flex flex-col items-center gap-0.5 text-gray-600 cursor-not-allowed"
                >
                  <Calendar className="h-4.5 w-4.5" />
                  <span className="text-[6px] font-black uppercase tracking-wider">Calendar</span>
                </button>
              </div>

              {currentView === 'feed' && (
                <div 
                  ref={feedScrollRef}
                  onScroll={handleScroll}
                  className="w-full h-full overflow-y-auto scrollbar-none relative scroll-smooth pt-8 pb-14 text-white"
                >
                  {/* Mini Feed Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#121212] z-20">
                    <span className="text-[9px] font-black tracking-widest text-[#FD5C05]">EVIDA</span>
                    <div className="flex gap-2">
                      <span className="text-[7px] font-black uppercase text-[#FD5C05] border-b border-[#FD5C05] pb-0.5">For You</span>
                      <span className="text-[7px] font-bold uppercase text-[#5A554E]/80">Campus</span>
                    </div>
                  </div>

                  {/* Staggered Feed Cards */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.12 }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    className="p-3 space-y-4"
                  >
                    {/* Card 1: Rave */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 14 } }
                      }}
                      className="relative h-44 rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-end p-4 group"
                    >
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('/evida-hero-bg-orange.png')` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                      
                      {/* Sidebar buttons mockup */}
                      <div className="absolute right-3 bottom-14 flex flex-col gap-2 z-20 items-center">
                        <div className="h-6 w-6 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-rose-500 shadow"><Heart className="h-3 w-3 fill-rose-500" /></div>
                        <div className="h-6 w-6 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white shadow"><MessageCircle className="h-3 w-3" /></div>
                      </div>

                      <div className="relative z-10 space-y-1">
                        <span className="bg-[#FD5C05] text-[#2A2621] font-black px-1 py-0.5 rounded text-[5px] uppercase tracking-wider">Verified Org</span>
                        <h4 className="text-[10px] font-black uppercase tracking-tight text-white leading-tight">Welcome Back Neon Rave</h4>
                        <p className="text-[6px] text-gray-300 line-clamp-1">Campus Board • Oct 5 • Student Plaza</p>
                      </div>
                    </motion.div>

                    {/* Card 2: Career Fair (Action Card) */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 14 } }
                      }}
                      onClick={handleCardTap}
                      className="relative h-44 rounded-2xl overflow-hidden border-2 border-[#FD5C05] flex flex-col justify-end p-4 group cursor-pointer shadow-[0_0_12px_rgba(189,251,4,0.15)]"
                    >
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 animate-pulse-slow" style={{ backgroundImage: `url('/pexels-rdne-7648057.jpg')` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                      
                      {/* Pulse circle indicators */}
                      <div className="absolute top-3 right-3 bg-[#FD5C05] text-[#2A2621] text-[6px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow animate-bounce z-20">
                        Tap to Explore
                      </div>

                      <div className="relative z-10 space-y-1">
                        <span className="bg-[#FD5C05] text-[#2A2621] font-black px-1 py-0.5 rounded text-[5px] uppercase tracking-wider">Featured</span>
                        <h4 className="text-[10px] font-black uppercase tracking-tight text-white leading-tight">Career Fair Networking Night</h4>
                        <p className="text-[6px] text-gray-300 line-clamp-1">Business Club • Oct 12 • Student Center</p>
                      </div>
                    </motion.div>

                    {/* Card 3: Autumn Fest */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.95 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 14 } }
                      }}
                      className="relative h-44 rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-end p-4 group"
                    >
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('/pexels-yaroslav-shuraev-8513385.jpg')` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                      
                      <div className="relative z-10 space-y-1">
                        <span className="bg-neutral-800 text-[#5A554E] font-bold px-1 py-0.5 rounded text-[5px] uppercase tracking-wider">Greek Life</span>
                        <h4 className="text-[10px] font-black uppercase tracking-tight text-white leading-tight">Autumn Concert & Social</h4>
                        <p className="text-[6px] text-gray-300 line-clamp-1">Greek Council • Oct 18 • Fraternity Quad</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              )}

              {currentView === 'explore' && (
                <div 
                  ref={feedScrollRef}
                  onScroll={handleScroll}
                  className="w-full h-full overflow-y-auto scrollbar-none pt-8 pb-14 text-white bg-[#121212]"
                >
                  {/* Search Bar Block */}
                  <div className="px-3 pt-2 bg-[#121212] space-y-3 pb-3 border-b border-white/5">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#5A554E]/80" />
                      <input 
                        type="text" 
                        disabled 
                        placeholder="Search events, clubs..." 
                        className="w-full bg-neutral-900 border border-white/5 rounded-lg py-1 pl-8 text-[8px] text-white"
                      />
                    </div>
                    <div className="flex gap-1 overflow-x-auto scrollbar-none">
                      <span className="shrink-0 px-2.5 py-0.5 bg-[#FD5C05] text-[#2A2621] text-[6px] font-black rounded-full uppercase">All</span>
                      <span className="shrink-0 px-2.5 py-0.5 bg-white/5 border border-white/10 text-[#5A554E] text-[6px] font-bold rounded-full uppercase">Parties</span>
                      <span className="shrink-0 px-2.5 py-0.5 bg-white/5 border border-white/10 text-[#5A554E] text-[6px] font-bold rounded-full uppercase">Sports</span>
                      <span className="shrink-0 px-2.5 py-0.5 bg-white/5 border border-white/10 text-[#5A554E] text-[6px] font-bold rounded-full uppercase">Academic</span>
                    </div>
                  </div>

                  {/* Grid layout */}
                  <div className="p-3">
                    <span className="block text-[7px] font-black text-[#5A554E]/80 uppercase tracking-widest mb-2">Popular Events</span>
                    
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: { staggerChildren: 0.08 }
                        }
                      }}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-2 gap-2"
                    >
                      {/* Grid Item 1: Career Center (Target) */}
                      <motion.div 
                        variants={{
                          hidden: { opacity: 0, scale: 0.92 },
                          show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 14 } }
                        }}
                        onClick={handleCardTap}
                        className="bg-neutral-900/60 border border-[#FD5C05]/30 rounded-xl p-1.5 space-y-1.5 cursor-pointer hover:border-[#FD5C05] transition-all"
                      >
                        <div className="aspect-[4/3] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url('/pexels-rdne-7648057.jpg')` }} />
                        <div>
                          <h5 className="text-[7.5px] font-black text-white uppercase tracking-tight truncate leading-tight">Career Networking</h5>
                          <p className="text-[5.5px] text-[#5A554E]/80 truncate leading-none">Business Club</p>
                        </div>
                      </motion.div>

                      {/* Grid Item 2 */}
                      <motion.div 
                        variants={{
                          hidden: { opacity: 0, scale: 0.92 },
                          show: { opacity: 1, scale: 1 }
                        }}
                        className="bg-neutral-900/40 border border-white/5 rounded-xl p-1.5 space-y-1.5"
                      >
                        <div className="aspect-[4/3] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url('/pexels-yaroslav-shuraev-8513385.jpg')` }} />
                        <div>
                          <h5 className="text-[7.5px] font-black text-white uppercase tracking-tight truncate leading-tight">Autumn Social</h5>
                          <p className="text-[5.5px] text-[#5A554E]/80 truncate leading-none">Greek Council</p>
                        </div>
                      </motion.div>

                      {/* Grid Item 3 */}
                      <motion.div 
                        variants={{
                          hidden: { opacity: 0, scale: 0.92 },
                          show: { opacity: 1, scale: 1 }
                        }}
                        className="bg-neutral-900/40 border border-white/5 rounded-xl p-1.5 space-y-1.5"
                      >
                        <div className="aspect-[4/3] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url('/evida-hero-bg-orange.png')` }} />
                        <div>
                          <h5 className="text-[7.5px] font-black text-white uppercase tracking-tight truncate leading-tight">Welcome Rave</h5>
                          <p className="text-[5.5px] text-[#5A554E]/80 truncate leading-none">Campus Board</p>
                        </div>
                      </motion.div>

                      {/* Grid Item 4 */}
                      <motion.div 
                        variants={{
                          hidden: { opacity: 0, scale: 0.92 },
                          show: { opacity: 1, scale: 1 }
                        }}
                        className="bg-neutral-900/40 border border-white/5 rounded-xl p-1.5 space-y-1.5"
                      >
                        <div className="aspect-[4/3] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url('/pexels-rdne-7648057.jpg')` }} />
                        <div>
                          <h5 className="text-[7.5px] font-black text-white uppercase tracking-tight truncate leading-tight">Greek Tailgate</h5>
                          <p className="text-[5.5px] text-[#5A554E]/80 truncate leading-none">Greek Council</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              )}

              {currentView === 'details' && (
                <div 
                  ref={detailsScrollRef}
                  onScroll={handleScroll}
                  className="w-full h-full overflow-y-auto scrollbar-none pt-8 pb-14 text-white bg-[#121212]"
                >
                  {/* Hero Cover Header */}
                  <div className="relative h-36 w-full bg-cover bg-center" style={{ backgroundImage: `url('/pexels-rdne-7648057.jpg')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />
                    <button 
                      onClick={handleBackTap}
                      className="absolute top-2.5 left-2.5 h-6 w-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Staggered Content Details */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    className="p-3.5 space-y-4 text-left"
                  >
                    {/* Header Group */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15, scale: 0.97 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120 } }
                      }}
                      className="space-y-1.5"
                    >
                      <span className="bg-[#FD5C05] text-[#2A2621] font-black px-1.5 py-0.5 rounded text-[5px] uppercase tracking-wider w-fit block">Verified Host</span>
                      <h4 className="text-[12px] font-black uppercase tracking-tight leading-tight text-white">Career Fair Networking Night</h4>
                      <p className="text-[5.5px] text-[#5A554E]">HOSTED BY BUSINESS CLUB & CAREER CENTER</p>
                    </motion.div>

                    {/* Metadata Lists */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        show: { opacity: 1, y: 0 }
                      }}
                      className="space-y-2 border-y border-white/5 py-2.5 text-gray-300"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#FD5C05]" />
                        <span className="text-[6.5px] font-bold">WEDNESDAY, OCT 12 • 2:00 PM - 5:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#FD5C05]" />
                        <span className="text-[6.5px] font-bold">STUDENT CENTER MAIN HALL</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-3.5 w-3.5 text-[#FD5C05]" />
                        <span className="text-[6.5px] font-bold">FREE TICKET REQUIRED</span>
                      </div>
                    </motion.div>

                    {/* Description Paragraph */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        show: { opacity: 1, y: 0 }
                      }}
                      className="space-y-1"
                    >
                      <span className="block text-[7px] font-black text-[#5A554E]/80 uppercase tracking-widest">About Event</span>
                      <p className="text-[7.5px] text-gray-300 leading-relaxed font-light">
                        Connect with over 50 recruiters from leading tech, finance, and creative industries. Prepare your resume and dress professionally. First 100 check-ins receive a free portfolio binder.
                      </p>
                    </motion.div>

                    {/* RSVP Action Hotspot wrapper */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, scale: 0.95 },
                        show: { opacity: 1, scale: 1, transition: { delay: 0.2 } }
                      }}
                      className="pt-2"
                    >
                      <button
                        onClick={handleRsvpClick}
                        className={`w-full py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                          rsvpConfirmed 
                            ? 'bg-[#FD5C05] text-[#2A2621] animate-bounce shadow-[0_0_12px_rgba(189,251,4,0.35)]' 
                            : 'bg-white text-[#2A2621] hover:bg-[#FD5C05] hover:text-[#2A2621] border border-[#D8D2BC]/40 hover:shadow-[0_0_12px_rgba(189,251,4,0.25)]'
                        }`}
                      >
                        {rsvpConfirmed ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#2A2621] stroke-[3]" />
                            <span>Going!</span>
                          </>
                        ) : (
                          <span>RSVP NOW</span>
                        )}
                      </button>
                    </motion.div>

                  </motion.div>
                </div>
              )}

            </div>
          </motion.div>

          {/* Right Side: Tooltip & Swiping instructions */}
          <div className="relative flex flex-col gap-3 text-center md:text-left max-w-[200px]">
            <AnimatePresence mode="wait">
              {!phoneActive ? (
                <motion.div
                  key="inactive-tooltip"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-black text-[#FD5C05] border border-white/10 px-4 py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2 pointer-events-none"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider animate-pulse">
                    Click the phone to explore Evida
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="active-tooltip"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#2A2621] text-white border border-white/10 px-4 py-3 rounded-2xl shadow-xl space-y-2 pointer-events-none"
                >
                  <span className="block text-[8px] font-black uppercase tracking-widest text-[#FD5C05] animate-pulse">
                    Take a tour
                  </span>
                  <p className="text-[9px] text-gray-300 leading-snug">
                    Scroll naturally inside the phone screens or tap the interactive hotspots to complete the tour.
                  </p>
                  <span className="block text-[8px] text-[#5A554E]/80 font-bold uppercase pt-1">
                    {activeStep === 4 ? 'Confirm RSVP to exit →' : 'Scroll down to continue'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick exit fallback button */}
            {phoneActive && (
              <button 
                onClick={() => setPhoneActive(false)}
                className="mt-3 w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-wider rounded-xl border border-white/10 text-white transition-all backdrop-blur-md cursor-pointer text-center"
              >
                Exit Preview
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Problem Statistics Section */}
      <section id="why-evida" className="bg-white border-b border-[#D8D2BC]/30 py-20 md:py-28 w-full relative z-10">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Why Evida</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#2A2621] leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>
              ONE CAMPUS. ONE PLATFORM. EVERY OPPORTUNITY.
            </h2>
            <p className="text-xs text-[#5A554E] font-medium leading-relaxed max-w-lg mx-auto">
              Campus life is scattered across emails, group chats, flyers, and social media. Evida brings events, organizations, promotions, and your campus calendar together in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 text-left max-w-5xl mx-auto border-y border-[#D8D2BC]/30">
            
            {/* Card 1 */}
            <div className="p-4 sm:p-8 border-r border-b lg:border-b-0 border-[#D8D2BC]/30 flex flex-col space-y-1.5">
              <span className="text-3xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                89%
              </span>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Miss important opportunities
              </h3>
              <p className="text-[10px] sm:text-xs text-[#5A554E] leading-relaxed font-medium hidden sm:block">
                Students have missed important campus events, deadlines, and opportunities because information is scattered across multiple channels.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#D8D2BC]/30 flex flex-col space-y-1.5">
              <span className="text-3xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                36%
              </span>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Never participate
              </h3>
              <p className="text-[10px] sm:text-xs text-[#5A554E] leading-relaxed font-medium hidden sm:block">
                More than one-third of students don't participate in a single extracurricular or co-curricular activity during the academic year.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 sm:p-8 border-r border-[#D8D2BC]/30 flex flex-col space-y-1.5">
              <span className="text-3xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                31%
              </span>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Don't know what's happening
              </h3>
              <p className="text-[10px] sm:text-xs text-[#5A554E] leading-relaxed font-medium hidden sm:block">
                Many students say they miss campus activities simply because they never hear about them or discover them too late.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-4 sm:p-8 flex flex-col space-y-1.5">
              <span className="text-3xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                26%
              </span>
              <h3 className="text-[11px] sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Check campus email daily
              </h3>
              <p className="text-[10px] sm:text-xs text-[#5A554E] leading-relaxed font-medium hidden sm:block">
                Only about one in four students regularly check their university email — making email alone unreliable.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#D8D2BC]/35 border-y border-[#D8D2BC]/30 py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Built for Everyone</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
              One platform. Two ways to connect.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Students Card */}
            <div className="rounded-[28px] border border-black/[0.04] bg-white overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
              <div className="relative h-48 w-full bg-[url('/pexels-maorattias-5191958.jpg')] bg-cover bg-center" />
              <div className="p-8 space-y-4 text-left">
                <span className="text-[9px] font-black text-[#5A554E] uppercase tracking-widest block">For Students</span>
                <h3 className="text-lg font-extrabold text-[#2A2621] uppercase tracking-tight leading-tight">
                  Discover events, join groups, and promote your initiatives.
                </h3>
                <ul className="space-y-2.5 text-xs text-[#5A554E] font-medium pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Discover campus events and stay in the loop.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Join organizations and meet new people.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    RSVP to campus activities in one tap.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Create your own independent student events.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Promote local businesses, tutoring services, photography, food sales, and other student initiatives.
                  </li>
                </ul>
              </div>
            </div>

            {/* School & Org Card */}
            <div className="rounded-[28px] border border-black/[0.04] bg-white overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
              <div className="relative h-48 w-full bg-[url('/pexels-gu-ko-2150570603-31827067.jpg')] bg-cover bg-center" />
              <div className="p-8 space-y-4 text-left">
                <span className="text-[9px] font-black text-[#5A554E] uppercase tracking-widest block">For Schools & Organizations</span>
                <h3 className="text-lg font-extrabold text-[#2A2621] uppercase tracking-tight leading-tight">
                  Publish events, coordinate groups, and monitor engagement.
                </h3>
                <ul className="space-y-2.5 text-xs text-[#5A554E] font-medium pt-2">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Publish official events and share group announcements.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Manage organization members and assign specific moderation roles.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Approve group membership requests seamlessly.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    Increase student engagement across all departments.
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#D8D2BC]/35 border-t border-[#D8D2BC]/30 py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">How It Works</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
              Four steps. One outcome: being connected.
            </h2>
            <p className="text-xs text-[#5A554E]">We simplify communication and activities for everyone on campus.</p>
          </div>

          <div className="grid grid-cols-2 border border-[#D8D2BC]/30 rounded-[32px] overflow-hidden bg-white shadow-sm max-w-4xl mx-auto">
            
            {/* Step 1 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left border-r border-b border-[#D8D2BC]/30">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 01</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Mail className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug">
                Sign up with your school email
              </h3>
              <p className="text-[11px] sm:text-xs text-[#5A554E] leading-relaxed font-medium">
                Students verify their identity using their official university email to ensure a secure, trusted environment.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left border-b border-[#D8D2BC]/30">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 02</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Search className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug">
                Discover campus life
              </h3>
              <p className="text-[11px] sm:text-xs text-[#5A554E] leading-relaxed font-medium">
                Browse events, student organizations, promotions, and opportunities personalized specifically to your campus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left border-r border-[#D8D2BC]/30">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 03</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Users className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug">
                Connect with peers
              </h3>
              <p className="text-[11px] sm:text-xs text-[#5A554E] leading-relaxed font-medium">
                Join organizations, RSVP to events, interact with your campus community, and discover new experiences.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 sm:p-8 space-y-3.5 text-left">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 04</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Plus className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug">
                Create new content
              </h3>
              <p className="text-[11px] sm:text-xs text-[#5A554E] leading-relaxed font-medium">
              Allow every verified student to create events, promotions, and activities. Organization members simply receive additional management permissions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="bg-[#EAE4CF] border-t border-[#D8D2BC] py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Core Features</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#2A2621]" style={{ fontFamily: 'var(--font-display)' }}>
              Everything you need for Campus life
            </h2>
            <p className="text-xs text-[#5A554E]">A modular, streetwear-inspired hub connecting your entire university community.</p>
          </div>

          <div className="grid grid-cols-1 min-[450px]:grid-cols-2 border border-[#D8D2BC] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white shadow-sm">
            
            {/* Card 1: Campus Events */}
            <div className="group p-5 sm:p-8 space-y-4 text-left border-b min-[450px]:border-r border-[#D8D2BC] flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-4">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 01</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug">
                    Campus Events
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Discover everything happening on campus.
                  </h4>
                </div>
                <p className="text-xs text-[#5A554E] leading-relaxed font-medium">
                  Discover everything happening on campus in one place. Browse school events, organization activities, workshops, sports, cultural events, and more.
                </p>
              </div>
            </div>

            {/* Card 2: Student Organizations */}
            <div className="group p-5 sm:p-8 space-y-4 text-left border-b border-[#D8D2BC] flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-4">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 02</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Users className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug">
                    Student Organizations
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Explore clubs, teams, and student communities.
                  </h4>
                </div>
                <p className="text-xs text-[#5A554E] leading-relaxed font-medium">
                  Explore clubs, teams, and student communities. Join groups that match your interests, view their events, and discover members.
                </p>
              </div>
            </div>

            {/* Card 3: Event Creation */}
            <div className="group p-5 sm:p-8 space-y-4 text-left border-b min-[450px]:border-b-0 min-[450px]:border-r border-[#D8D2BC] flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-4">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 03</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug">
                    Event Creation
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Create events in minutes.
                  </h4>
                </div>
                <p className="text-xs text-[#5A554E] leading-relaxed font-medium">
                  Create and manage campus events with an easy publishing flow. Share events and activities with the entire campus, whether you're a student or school administrator.
                </p>
              </div>
            </div>

            {/* Card 4: Promotions */}
            <div className="group p-5 sm:p-8 space-y-4 text-left flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-4">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 04</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug">
                    Promotions
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Promote what you do.
                  </h4>
                </div>
                <p className="text-xs text-[#5A554E] leading-relaxed font-medium">
                  Advertise tutoring, photography, small businesses, food sales, student services, and campus initiatives. Share services and opportunities with the campus community.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-[#EAE4CF] border-t border-[#D8D2BC] py-20">
        <div className="mx-auto max-w-4xl px-6 space-y-12">
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Questions</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#2A2621] uppercase">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-[24px] border border-[#D8D2BC] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none"
                  >
                    <span className="text-xs md:text-sm font-extrabold text-[#2A2621] uppercase tracking-wide">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-gradient-to-r from-[#FB1C07] to-[#FC7C0B] text-white' : 'bg-[#D8D2BC]/30 text-[#2A2621]'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-xs text-[#5A554E] leading-relaxed font-medium border-t border-[#D8D2BC] text-left">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Get Started CTA Section */}
      <section id="waitlist" className="mx-auto max-w-7xl px-4 md:px-6 py-16 w-full relative z-10">
        <div 
          className="relative w-full rounded-[32px] md:rounded-[48px] overflow-hidden border border-[#FD5C05]/20 shadow-2xl p-8 sm:p-12 md:p-16 text-white text-center flex flex-col justify-center items-center min-h-[420px]"
          style={{ background: 'radial-gradient(circle at 15% 15%, rgba(251, 28, 7, 0.16) 0%, transparent 55%), radial-gradient(circle at 85% 85%, rgba(252, 124, 11, 0.12) 0%, transparent 60%), linear-gradient(135deg, #2A2621 0%, #171512 100%)' }}
        >
          {/* Content */}
          <div className="relative z-20 space-y-6 max-w-xl w-full">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#FC7C0B]">
              EARLY ACCESS — LIMITED SPOTS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight md:tracking-tighter uppercase leading-[1.05] md:leading-[0.95] text-white">
              Ready to Experience <br />
              <span className="bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] bg-clip-text text-transparent inline-block">Campus Differently?</span>
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-gray-300 leading-relaxed font-medium max-w-md mx-auto">
              Join the Evida waitlist and be among the first students to discover a simpler way to explore events, organizations, promotions, and opportunities across campus.
            </p>
            
            <AnimatePresence mode="wait">
              {!waitlistSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleWaitlistSubmit}
                  className="pt-4 flex flex-col gap-3.5 w-full max-w-xs mx-auto"
                >
                  <input
                    type="text"
                    value={waitlistName}
                    onChange={(e) => setWaitlistName(e.target.value)}
                    placeholder="Name (optional)"
                    className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#FD5C05]/50 focus:ring-1 focus:ring-[#FD5C05]/30 backdrop-blur-md transition-all font-semibold text-center"
                  />
                  <input
                    id="waitlist-email"
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#FD5C05]/50 focus:ring-1 focus:ring-[#FD5C05]/30 backdrop-blur-md transition-all font-semibold text-center"
                  />
                  <button
                    type="submit"
                    disabled={waitlistLoading}
                    className="w-full rounded-full bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] hover:brightness-110 hover:-translate-y-0.5 py-4 text-xs md:text-sm font-black text-white shadow-lg shadow-[#FB1C07]/25 hover:shadow-[0_6px_20px_rgba(251,28,7,0.35)] transition-all duration-300 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {waitlistLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Join waitlist</span>
                        <ArrowRight className="h-4 w-4 text-white" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pt-4 flex flex-col items-center gap-2"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#FB1C07]/20 to-[#FC7C0B]/20 text-[#FD5C05] flex items-center justify-center border border-[#FD5C05]/30 shadow shadow-[#FD5C05]/10">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-[#FD5C05] font-black text-sm uppercase tracking-wider">
                    You're on the list!
                  </p>
                  <p className="text-gray-300 text-[11px] font-semibold">
                    We've saved <span className="text-white font-bold">{waitlistEmail}</span>{waitlistName ? ` for ${waitlistName}` : ''}. Keep an eye on your inbox.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2621] border-t border-white/5 py-16 md:py-20 text-white relative z-10">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          
          {/* Top row: Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 text-left">
            
            {/* Left Description Column */}
            <div className="md:col-span-6 space-y-4">
              <EvidaLogo size={36} lightMode={false} text="EVIDA" />
              <p className="text-xs text-[#5A554E] leading-relaxed max-w-xs font-semibold">
                Bringing students, organizations, and schools together through one connected campus experience.
              </p>
              
              {/* Connect icons */}
              <div className="flex items-center gap-3.5 pt-2">
                <a href="mailto:info@myevida.app" className="text-[#5A554E] hover:text-[#FD5C05] transition-colors" title="Email Us">
                  <Mail className="h-4.5 w-4.5" />
                </a>
                <a href="https://instagram.com/myevida" target="_blank" rel="noopener noreferrer" className="text-[#5A554E] hover:text-[#FD5C05] transition-colors" title="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white block">Product</span>
              <ul className="flex flex-col gap-2.5 text-xs text-[#5A554E] font-semibold">
                <li>
                  <a href="#experience" className="hover:text-[#FD5C05] transition-colors">Experience Evida</a>
                </li>
                <li>
                  <a href="#why-evida" className="hover:text-[#FD5C05] transition-colors">Why Evida</a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#FD5C05] transition-colors">Core Features</a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#FD5C05] transition-colors">How it Works</a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#FD5C05] transition-colors">FAQ</a>
                </li>
                <li>
                  <a href="#waitlist" className="hover:text-[#FD5C05] transition-colors">Waitlist</a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white block">Company</span>
              <ul className="flex flex-col gap-2.5 text-xs text-[#5A554E] font-semibold">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#FD5C05] transition-colors">About</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#FD5C05] transition-colors">Vision</a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#FD5C05] transition-colors">Contact</a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white block">Legal</span>
              <ul className="flex flex-col gap-2.5 text-xs text-[#5A554E] font-semibold">
                <li>
                  <a href="#faq" className="hover:text-[#FD5C05] transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#FD5C05] transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#5A554E] font-medium text-center md:text-left">
            <span>© 2026 Evida. Built for campus life.</span>
          </div>

        </div>
      </footer>
    </div>
  );
}
