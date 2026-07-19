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
  Wifi,
  Battery,
  Signal,
  ArrowLeft,
  GraduationCap,
  Mail,
  Plus,
  Compass,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { Event } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import EvidaLogo from '@/components/ui/EvidaLogo';
import Link from 'next/link';
import { useEvents } from '@/lib/context/EventContext';

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
  const { events } = useEvents();
  const firstEvent = events.filter(e => e.status === 'approved')[0];
  const firstEventId = firstEvent?.id || 'event-1';

  // Navigation hamburger menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // FAQ Accordion State
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Waitlist form state
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistSubmitted(true);
  };

  const handleSeeHowItWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  // ── Guided Tour State ──────────────────────────────────────────────
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [tourStep, setTourStep] = useState(0);        // 0..3
  const [hasInteracted, setHasInteracted] = useState(true);
  const [currentPath, setCurrentPath] = useState('/student/dashboard');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const TOUR_STEPS = [
    {
      label: 'Explore Feed',
      emoji: '🏠',
      description: 'Your campus life starts here. Browse upcoming events from Livingstone College and your student community.',
      hint: 'Scroll inside the phone to explore your feed.',
    },
    {
      label: 'Select Event',
      emoji: '🔍',
      description: 'Find premium opportunities and mixers. Select Career Fair Networking Night to read more.',
      hint: 'Tap View Event to continue.',
    },
    {
      label: 'Event Details',
      emoji: '📋',
      description: 'Review details, date, locations, and roster. RSVP in one simple tap.',
      hint: 'Tap I\'m Going to continue.',
    },
    {
      label: "You're Going!",
      emoji: '🎉',
      description: 'Your spot is saved! Add to your native calendar directly and continue exploring.',
      hint: 'Tour complete — you\'re in!',
    },
  ];

  // Listen for route messages from the iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      const { type, pathname, step } = event.data;
      if (type === 'EVIDA_PREVIEW_ROUTE') {
        setCurrentPath(pathname);
      }
      if (type === 'EVIDA_TOUR_STEP_UPDATE') {
        setTourStep(step);
        setCompletedSteps(prev => {
          const next = new Set(prev);
          for (let i = 0; i <= step; i++) {
            if (i !== step) {
              next.add(i);
            }
          }
          return next;
        });
      }
      if (type === 'EVIDA_TOUR_COMPLETE') {
        setTourStep(3);
        setCompletedSteps(new Set([0, 1, 2]));
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  // Send EVIDA_TOUR_GOTO command to iframe when step changes
  const sendTourStep = (step: number) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'EVIDA_TOUR_GOTO', step }, '*');
    }
  };

  const goNext = () => {
    const next = Math.min(tourStep + 1, TOUR_STEPS.length - 1);
    setCompletedSteps(prev => new Set(prev).add(tourStep));
    setTourStep(next);
    sendTourStep(next);
  };

  const goBack = () => {
    const prev = Math.max(tourStep - 1, 0);
    setTourStep(prev);
    sendTourStep(prev);
  };

  const handlePhoneClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      sendTourStep(0);
    }
  };
  // ─────────────────────────────────────────────────────────────────────

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is Evida?",
      answer: "Evida is a premium, unified digital home for student life. It aggregates campus events, student organizations, promotions, and opportunities into a high-end, responsive feed."
    },
    {
      question: "How do I join the waitlist?",
      answer: "Click any 'Join Waitlist' button to reserve your spot. We are currently in private beta and will notify you as soon as access opens for your campus."
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
                  className="absolute right-3 xs:right-4 sm:right-6 md:right-8 top-16 z-40 w-[calc(100vw-24px)] max-w-xs rounded-[24px] border border-[#D8D2BC] bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-xl flex flex-col gap-4 text-left"
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

                  {/* Actions (Join Waitlist Button) */}
                  <div className="pt-1">
                    <button
                      onClick={(e) => {
                        setMenuOpen(false);
                        onLogin();
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
      <section className="mx-auto w-full max-w-7xl px-3.5 xs:px-5 sm:px-6 md:px-8 pt-16 sm:pt-24 pb-6 sm:pb-12 relative overflow-x-hidden">
        {/* Soft floating blurred gradient blobs for premium lighting */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#FB1C07] to-[#FC7C0B] opacity-[0.12] blur-[90px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-[24px] sm:rounded-[32px] md:rounded-[44px] overflow-hidden border border-white/10 shadow-2xl p-5 sm:p-8 md:p-14 text-white z-10 flex flex-col justify-between"
        >
          {/* Background image & overlays */}
          <div className="absolute inset-0 bg-cover bg-center z-0 filter blur-[8px] scale-[1.05]" style={{ backgroundImage: "url('/evida-hero-bg-orange.png')" }} />
          <div className="absolute inset-0 bg-[#2A2621]/45 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/95 via-[#2A2621]/40 to-[#2A2621]/60 z-10" />

          {/* Content Wrapper */}
          <div className="relative z-20 space-y-4 sm:space-y-5 max-w-xl text-left">
            
            {/* 1. Small "Now in private beta" Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-white/15 px-3 py-1 text-[10px] sm:text-xs font-semibold text-white/90 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FB1C07] animate-pulse" />
              Now in private beta
            </div>

            {/* 2. Headline: 3 lines on mobile, 2 lines on desktop */}
            <h1 className="text-[clamp(28px,8vw,36px)] sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              <span className="block sm:inline">Everything</span>{' '}
              <span className="block sm:inline">happening</span> <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] bg-clip-text text-transparent block sm:inline">
                on campus.
              </span>
            </h1>

            {/* 3. Short Evida Description */}
            <p className="text-xs sm:text-sm md:text-base text-gray-200/90 leading-relaxed font-medium max-w-md">
              Evida brings campus events, student organizations, promotions, and opportunities into one place. Discover what’s happening, connect with your community, and never miss campus life.
            </p>

            {/* 4. Full-Width Buttons */}
            <div className="flex flex-col gap-2.5 sm:gap-3 w-full pt-1">
              <button
                onClick={onLogin}
                className="w-full rounded-full bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] hover:brightness-110 py-3.5 px-6 text-xs sm:text-sm font-black text-white shadow-lg shadow-[#FB1C07]/25 transition-all duration-300 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Join Waitlist</span>
                <ArrowRight className="h-4 w-4 text-white" />
              </button>

              <button
                onClick={handleSeeHowItWorksClick}
                className="w-full rounded-full border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md py-3.5 px-6 text-xs sm:text-sm font-bold text-white transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                See How It Works
              </button>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ── Interactive Evida Product Demo ─────────────────────────────── */}
      <section id="experience" className="relative bg-[#1A1714] border-y border-white/[0.06] py-12 sm:py-16 md:py-24 overflow-hidden">

        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FD5C05]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 md:px-8">

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="rounded-full bg-[#FD5C05]/15 text-[#FD5C05] border border-[#FD5C05]/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest inline-block mb-3 sm:mb-4">
              Interactive Demo
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight md:tracking-tighter text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Experience Evida
            </h2>
            <p className="text-xs sm:text-sm text-white/50 font-medium max-w-md mx-auto mt-2 leading-relaxed">
              {hasInteracted
                ? 'Use Back & Next to navigate through the tour, or scroll freely inside the phone.'
                : 'Click inside the phone to begin the guided tour.'}
            </p>
          </div>

          {/* Main Layout: Progress | Phone | Context */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12">

            {/* ── Left: Tour Progress ───────────────────────────────────── */}
            <div className="hidden lg:flex flex-col gap-1 min-w-[200px]">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30 mb-4">Tour Progress</p>
              {TOUR_STEPS.map((step, idx) => {
                const isActive    = tourStep === idx;
                const isCompleted = completedSteps.has(idx) && !isActive;
                const isUpcoming  = !isActive && !isCompleted;
                return (
                  <div key={idx} className="flex items-start gap-3 group">
                    {/* Connector line above (except first) */}
                    <div className="flex flex-col items-center">
                      {idx > 0 && (
                        <div className={`w-px h-4 mb-1 transition-colors duration-500 ${isCompleted || isActive ? 'bg-[#FD5C05]/60' : 'bg-white/10'}`} />
                      )}
                      <div className={`
                        h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 transition-all duration-300 border
                        ${isActive    ? 'bg-[#FD5C05] border-[#FD5C05] text-[#2A2621] scale-110 shadow-[0_0_12px_rgba(253,92,5,0.5)]' : ''}
                        ${isCompleted ? 'bg-[#FD5C05]/20 border-[#FD5C05]/50 text-[#FD5C05]' : ''}
                        ${isUpcoming  ? 'bg-white/5 border-white/10 text-white/30' : ''}
                      `}>
                        {isCompleted ? <Check className="h-3 w-3" /> : idx + 1}
                      </div>
                    </div>
                    <div className="pt-0.5 pb-4">
                      <p className={`text-[11px] font-black uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : isCompleted ? 'text-[#FD5C05]/70' : 'text-white/25'}`}>
                        {step.label}
                      </p>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-[10px] text-white/40 mt-0.5 leading-relaxed max-w-[160px]"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Center: Smartphone Shell ──────────────────────────────── */}
            <div className="flex flex-col items-center gap-4 sm:gap-5 w-full max-w-full">

              {/* Phone Device */}
              <div
                onClick={handlePhoneClick}
                className="relative cursor-pointer w-[280px] min-[380px]:w-[290px] sm:w-[310px] md:w-[320px] mx-auto transition-all duration-300"
                style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.65))' }}
              >
                {/* Phone Shell */}
                <div className="relative w-full h-[560px] min-[380px]:h-[590px] sm:h-[620px] md:h-[640px] rounded-[38px] min-[380px]:rounded-[42px] sm:rounded-[44px] border-[7px] min-[380px]:border-[9px] sm:border-[10px] border-[#0A0805] bg-[#D8D2BC] overflow-hidden select-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">

                  {/* Gloss overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent z-40 pointer-events-none rounded-[32px] sm:rounded-[34px]" />

                  {/* Dynamic Island */}
                  <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 w-[76px] min-[380px]:w-[84px] sm:w-[88px] h-[22px] sm:h-[26px] bg-[#0A0805] rounded-full z-50 pointer-events-none shadow-inner" />

                  {/* Status Bar */}
                  <div className={`absolute top-2 sm:top-2.5 inset-x-4 sm:inset-x-5 z-50 flex items-center justify-between text-[7px] sm:text-[8px] font-bold select-none pointer-events-none transition-colors duration-500 ${currentPath.startsWith('/events/') ? 'text-white/80' : 'text-[#2A2621]/70'}`}>
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <Signal className="h-2 w-2" />
                      <Wifi className="h-2 w-2" />
                      <Battery className="h-2 w-3" />
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-[3px] rounded-full z-50 pointer-events-none transition-colors duration-500 ${currentPath.startsWith('/events/') ? 'bg-white/30' : 'bg-[#2A2621]/20'}`} />

                  {/* Live Iframe — the real Evida app */}
                  <iframe
                    ref={iframeRef}
                    src="/student/dashboard?preview=true"
                    className="absolute inset-0 w-full h-full border-none bg-[#D8D2BC] touch-pan-y"
                    style={{ borderRadius: '32px' }}
                    title="Evida App Demo"
                  />
                </div>
              </div>

              {/* ── Back / Next Controls ───────────────────────────────── */}
              <div className="flex items-center gap-4">
                <button
                  onClick={goBack}
                  disabled={tourStep === 0 || !hasInteracted}
                  className="h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Step dots */}
                <div className="flex items-center gap-2">
                  {TOUR_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded-full transition-all duration-300 ${
                        tourStep === idx
                          ? 'w-5 h-2 bg-[#FD5C05]'
                          : completedSteps.has(idx)
                          ? 'w-2 h-2 bg-[#FD5C05]/40'
                          : 'w-2 h-2 bg-white/15'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={goNext}
                  disabled={tourStep === TOUR_STEPS.length - 1 || !hasInteracted}
                  className="h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Next step"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Responsive Mobile Step Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tourStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden w-full max-w-[280px] min-[380px]:max-w-[290px] sm:max-w-[310px] bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-center space-y-2 mt-1"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-xl">{TOUR_STEPS[tourStep].emoji}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#FD5C05]">
                      Step {tourStep + 1} of {TOUR_STEPS.length} — {TOUR_STEPS[tourStep].label}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                    {TOUR_STEPS[tourStep].description}
                  </p>
                  <p className="text-[9px] font-bold text-[#FD5C05]/70 uppercase tracking-wider pt-0.5">
                    {TOUR_STEPS[tourStep].hint}
                  </p>
                  {tourStep === TOUR_STEPS.length - 1 && (
                    <div className="pt-1.5">
                      <a
                        href="#get-started"
                        className="block w-full text-center bg-[#FD5C05] hover:bg-[#e84e00] text-[#2A2621] font-black text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all shadow-[0_0_16px_rgba(253,92,5,0.3)]"
                      >
                        Join Waitlist →
                      </a>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Right: Contextual Step Info ───────────────────────────── */}
            <div className="hidden lg:flex flex-col gap-3 max-w-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tourStep}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-5 py-4 space-y-3"
                >
                  <span className="text-3xl block">{TOUR_STEPS[tourStep].emoji}</span>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#FD5C05] mb-1">
                      Step {tourStep + 1} of {TOUR_STEPS.length}
                    </p>
                    <h3 className="text-sm font-black text-white leading-snug">
                      {TOUR_STEPS[tourStep].label}
                    </h3>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    {TOUR_STEPS[tourStep].description}
                  </p>
                  <div className="pt-1 border-t border-white/[0.06]">
                    <p className="text-[9px] font-bold text-[#FD5C05]/70 uppercase tracking-wider">
                      {TOUR_STEPS[tourStep].hint}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* CTA after last step */}
              {tourStep === TOUR_STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <a
                    href="#get-started"
                    className="block w-full text-center bg-[#FD5C05] hover:bg-[#e84e00] text-[#2A2621] font-black text-[10px] uppercase tracking-wider py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(253,92,5,0.3)] hover:shadow-[0_0_30px_rgba(253,92,5,0.5)]"
                  >
                    Join Waitlist →
                  </a>
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Problem Statistics Section */}
      <section id="why-evida" className="bg-white border-b border-[#D8D2BC]/30 py-10 xs:py-12 sm:py-20 md:py-28 w-full relative z-10">
        <div className="mx-auto max-w-7xl px-3.5 xs:px-5 sm:px-6 md:px-8 space-y-8 xs:space-y-10 sm:space-y-16">
          
          <div className="text-center space-y-2.5 xs:space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Why Evida</span>
            <h2 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight md:tracking-tighter text-[#2A2621] leading-tight sm:leading-[0.95]" style={{ fontFamily: 'var(--font-display)' }}>
              One Campus. One Platform. Every Opportunity.
            </h2>
            <p className="text-xs text-[#5A554E] font-medium leading-relaxed max-w-lg mx-auto break-words">
              Campus life is scattered across emails, group chats, flyers, and social media. Evida brings events, organizations, promotions, and your campus calendar together in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 text-left max-w-5xl mx-auto border-y border-[#D8D2BC]/30">
            
            {/* Card 1 */}
            <div className="p-4 xs:p-5 sm:p-8 border-b sm:border-r border-[#D8D2BC]/30 flex flex-col space-y-1.5">
              <span className="text-3xl xs:text-4xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                89%
              </span>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Miss important opportunities
              </h3>
              <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium block mt-1 break-words">
                Students have missed important campus events, deadlines, and opportunities because information is scattered across multiple channels.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 xs:p-5 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#D8D2BC]/30 flex flex-col space-y-1.5">
              <span className="text-3xl xs:text-4xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                36%
              </span>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Never participate
              </h3>
              <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium block mt-1 break-words">
                More than one-third of students don't participate in a single extracurricular or co-curricular activity during the academic year.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 xs:p-5 sm:p-8 border-b sm:border-b-0 sm:border-r border-[#D8D2BC]/30 flex flex-col space-y-1.5">
              <span className="text-3xl xs:text-4xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                31%
              </span>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Don't know what's happening
              </h3>
              <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium block mt-1 break-words">
                Many students say they miss campus activities simply because they never hear about them or discover them too late.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-4 xs:p-5 sm:p-8 flex flex-col space-y-1.5">
              <span className="text-3xl xs:text-4xl sm:text-5xl font-black text-brand-gradient tracking-tight block" style={{ fontFamily: 'var(--font-display)' }}>
                26%
              </span>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#2A2621] leading-snug">
                Check campus email daily
              </h3>
              <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium block mt-1 break-words">
                Only about one in four students regularly check their university email — making email alone unreliable.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#D8D2BC]/35 border-y border-[#D8D2BC]/30 py-10 xs:py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-3.5 xs:px-5 sm:px-6 md:px-8 space-y-8 sm:space-y-12">
          <div className="text-center space-y-2.5 xs:space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Built for Everyone</span>
            <h2 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight md:tracking-tighter text-[#2A2621] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              One Platform. Two Ways to Connect.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xs:gap-6 sm:gap-8">
            
            {/* Students Card */}
            <div className="rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border border-black/[0.04] bg-white overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
              <div className="relative h-36 xs:h-44 sm:h-48 w-full bg-[url('/pexels-maorattias-5191958.jpg')] bg-cover bg-center" />
              <div className="p-4 xs:p-6 sm:p-8 space-y-3.5 xs:space-y-4 text-left">
                <span className="text-[9px] font-black text-[#5A554E] uppercase tracking-widest block">For Students</span>
                <h3 className="text-sm xs:text-base sm:text-lg font-extrabold text-[#2A2621] uppercase tracking-tight leading-tight break-words">
                  Discover events, join groups, and promote your initiatives.
                </h3>
                <ul className="space-y-2 xs:space-y-2.5 text-[11px] xs:text-xs text-[#5A554E] font-medium pt-1">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    <span>Discover campus events and stay in the loop.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    <span>Join organizations and meet new people.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    <span>RSVP to campus activities in one tap.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    <span>Create your own independent student events.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    <span>Promote local businesses, tutoring services, photography, food sales, and other student initiatives.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* School & Org Card */}
            <div className="rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border border-black/[0.04] bg-white overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-all">
              <div className="relative h-36 xs:h-44 sm:h-48 w-full bg-[url('/pexels-gu-ko-2150570603-31827067.jpg')] bg-cover bg-center" />
              <div className="p-4 xs:p-6 sm:p-8 space-y-3.5 xs:space-y-4 text-left">
                <span className="text-[9px] font-black text-[#5A554E] uppercase tracking-widest block">For Schools & Organizations</span>
                <h3 className="text-sm xs:text-base sm:text-lg font-extrabold text-[#2A2621] uppercase tracking-tight leading-tight break-words">
                  Publish events, coordinate groups, and monitor engagement.
                </h3>
                <ul className="space-y-2 xs:space-y-2.5 text-[11px] xs:text-xs text-[#5A554E] font-medium pt-1">
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    <span>Publish official events and share group announcements.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    <span>Manage organization members and assign specific moderation roles.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    <span>Approve group membership requests seamlessly.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FD5C05] mt-1.5 shrink-0 border border-black/10" />
                    <span>Increase student engagement across all departments.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#D8D2BC]/35 border-t border-[#D8D2BC]/30 py-10 xs:py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-3.5 xs:px-5 sm:px-6 md:px-8 space-y-8 sm:space-y-12">
          
          <div className="text-center space-y-2.5 xs:space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">How It Works</span>
            <h2 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight md:tracking-tighter text-[#2A2621] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Four Steps. One Outcome: Being Connected.
            </h2>
            <p className="text-xs text-[#5A554E] break-words">We simplify communication and activities for everyone on campus.</p>
          </div>

          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 border border-[#D8D2BC]/30 rounded-[20px] xs:rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white shadow-sm max-w-4xl mx-auto">
            
            {/* Step 1 */}
            <div className="p-4 xs:p-6 sm:p-8 space-y-2.5 xs:space-y-3 text-left border-b min-[500px]:border-r border-[#D8D2BC]/30">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 01</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Mail className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-xs xs:text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug break-words">
                Sign up with your school email
              </h3>
              <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium break-words">
                Students verify their identity using their official university email to ensure a secure, trusted environment.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 xs:p-6 sm:p-8 space-y-2.5 xs:space-y-3 text-left border-b border-[#D8D2BC]/30">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 02</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Search className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-xs xs:text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug break-words">
                Discover campus life
              </h3>
              <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium break-words">
                Browse events, student organizations, promotions, and opportunities personalized specifically to your campus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 xs:p-6 sm:p-8 space-y-2.5 xs:space-y-3 text-left border-b min-[500px]:border-b-0 min-[500px]:border-r border-[#D8D2BC]/30">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 03</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Users className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-xs xs:text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug break-words">
                Connect with peers
              </h3>
              <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium break-words">
                Join organizations, RSVP to events, interact with your campus community, and discover new experiences.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 xs:p-6 sm:p-8 space-y-2.5 xs:space-y-3 text-left">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#5A554E] block">Step 04</span>
              <div className="h-9 w-9 rounded-full bg-[#D8D2BC]/30 flex items-center justify-center text-[#2A2621] border border-[#D8D2BC]/40 shadow-inner">
                <Plus className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <h3 className="text-xs xs:text-sm sm:text-base font-extrabold text-[#2A2621] leading-snug break-words">
                Create new content
              </h3>
              <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium break-words">
                Allow every verified student to create events, promotions, and activities. Organization members simply receive additional management permissions.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="bg-[#EAE4CF] border-t border-[#D8D2BC] py-10 xs:py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-3.5 xs:px-5 sm:px-6 md:px-8 space-y-8 sm:space-y-12">
          
          <div className="text-center space-y-2.5 xs:space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Core Features</span>
            <h2 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight md:tracking-tighter text-[#2A2621] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Everything You Need for Campus Life
            </h2>
            <p className="text-xs text-[#5A554E] break-words">A modular, streetwear-inspired hub connecting your entire university community.</p>
          </div>

          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 border border-[#D8D2BC] rounded-[20px] xs:rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white shadow-sm">
            
            {/* Card 1: Campus Events */}
            <div className="group p-4 xs:p-6 sm:p-8 space-y-3 text-left border-b min-[500px]:border-r border-[#D8D2BC] flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-3">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 01</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs xs:text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug break-words">
                    Campus Events
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Discover everything happening on campus.
                  </h4>
                </div>
                <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium break-words">
                  Discover everything happening on campus in one place. Browse school events, organization activities, workshops, sports, cultural events, and more.
                </p>
              </div>
            </div>

            {/* Card 2: Student Organizations */}
            <div className="group p-4 xs:p-6 sm:p-8 space-y-3 text-left border-b border-[#D8D2BC] flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-3">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 02</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Users className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs xs:text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug break-words">
                    Student Organizations
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Explore clubs, teams, and student communities.
                  </h4>
                </div>
                <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium break-words">
                  Explore clubs, teams, and student communities. Join groups that match your interests, view their events, and discover members.
                </p>
              </div>
            </div>

            {/* Card 3: Event Creation */}
            <div className="group p-4 xs:p-6 sm:p-8 space-y-3 text-left border-b min-[500px]:border-b-0 min-[500px]:border-r border-[#D8D2BC] flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-3">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 03</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Plus className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs xs:text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug break-words">
                    Event Creation
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Create events in minutes.
                  </h4>
                </div>
                <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium break-words">
                  Create and manage campus events with an easy publishing flow. Share events and activities with the entire campus, whether you're a student or school administrator.
                </p>
              </div>
            </div>

            {/* Card 4: Promotions */}
            <div className="group p-4 xs:p-6 sm:p-8 space-y-3 text-left flex flex-col justify-between hover:bg-[#EAE4CF]/20 transition-all duration-300">
              <div className="space-y-3">
                <span className="inline-block text-[8px] font-black uppercase tracking-widest bg-[#D8D2BC]/40 text-[#5A554E] px-2.5 py-0.5 rounded-full w-fit">Feature 04</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FB1C07]/10 to-[#FC7C0B]/10 border border-[#FD5C05]/20 flex items-center justify-center text-[#FD5C05] shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs xs:text-sm font-extrabold text-[#2A2621] group-hover:text-[#FD5C05] transition-colors duration-300 leading-snug break-words">
                    Promotions
                  </h3>
                  <h4 className="text-[10px] font-bold text-[#5A554E]/60 uppercase tracking-wider">
                    Promote what you do.
                  </h4>
                </div>
                <p className="text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium break-words">
                  Advertise tutoring, photography, small businesses, food sales, student services, and campus initiatives. Share services and opportunities with the campus community.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-[#EAE4CF] border-t border-[#D8D2BC] py-10 xs:py-12 sm:py-20">
        <div className="mx-auto max-w-3xl px-3.5 xs:px-5 sm:px-6 md:px-8 space-y-6 xs:space-y-8 sm:space-y-12">
          <div className="text-center space-y-2.5 xs:space-y-3 max-w-lg mx-auto">
            <span className="text-[10px] font-black tracking-widest text-[#5A554E] uppercase">Questions</span>
            <h2 className="text-xl xs:text-2xl sm:text-4xl font-extrabold tracking-tight text-[#2A2621]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqData.map((item, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-[18px] xs:rounded-[20px] sm:rounded-[24px] border border-[#D8D2BC] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-3.5 xs:p-5 sm:p-6 text-left flex items-center justify-between gap-3 xs:gap-4 cursor-pointer focus:outline-none select-none"
                  >
                    <span className="text-[11px] xs:text-xs sm:text-sm font-extrabold text-[#2A2621] uppercase tracking-wide break-words">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
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
                        <div className="px-3.5 xs:px-5 sm:px-6 pb-4 sm:pb-6 pt-1 text-[11px] xs:text-xs text-[#5A554E] leading-relaxed font-medium border-t border-[#D8D2BC] text-left break-words">
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
      <section id="get-started" className="mx-auto max-w-7xl px-3.5 xs:px-4 md:px-6 py-10 xs:py-12 sm:py-16 md:py-24 w-full relative z-10">
        <div 
          className="relative w-full rounded-[20px] xs:rounded-[28px] sm:rounded-[32px] md:rounded-[44px] overflow-hidden border border-[#FD5C05]/20 shadow-2xl p-4 xs:p-6 sm:p-12 md:p-16 text-white text-center flex flex-col justify-center items-center min-h-[380px] xs:min-h-[440px] sm:min-h-[480px]"
          style={{ background: 'radial-gradient(circle at 20% 20%, rgba(251, 28, 7, 0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(252, 124, 11, 0.14) 0%, transparent 55%), linear-gradient(135deg, #2A2621 0%, #171512 100%)' }}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-[#FD5C05]/10 blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-20 space-y-4 xs:space-y-6 max-w-xl w-full flex flex-col items-center">
            {/* Top Sub-header Badge matching reference */}
            <span className="text-[9px] xs:text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#FC7C0B]/90">
              EARLY ACCESS — LIMITED SPOTS
            </span>

            {/* Main Title matching reference layout */}
            <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight md:tracking-tighter leading-[1.1] sm:leading-[1.08] text-white text-center break-words">
              Be first to experience <br />
              <span className="bg-gradient-to-r from-[#FB1C07] via-[#FD5C05] to-[#FC7C0B] bg-clip-text text-transparent inline-block">
                campus differently.
              </span>
            </h2>

            {/* Subtext description matching reference structure */}
            <p className="text-[11px] xs:text-xs sm:text-sm text-gray-300 leading-relaxed font-medium max-w-md mx-auto text-center break-words">
              Join students getting priority access at launch. <br className="hidden sm:inline" />
              Free to join, no spam, real campus connections.
            </p>
            
            {/* Waitlist Form matching reference image layout & rounded pill shape */}
            {waitlistSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/10 border border-white/15 rounded-[20px] xs:rounded-[24px] p-5 xs:p-6 text-center space-y-2 mt-2"
              >
                <div className="h-9 w-9 xs:h-10 xs:w-10 rounded-full bg-[#FD5C05]/20 text-[#FD5C05] flex items-center justify-center mx-auto mb-2">
                  <Check className="h-4 w-4 xs:h-5 xs:w-5" />
                </div>
                <h3 className="text-sm xs:text-base font-extrabold text-[#FC7C0B]">You're on the waitlist!</h3>
                <p className="text-[11px] xs:text-xs text-gray-300">We'll notify you as soon as access opens for your campus.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="w-full max-w-md space-y-3 xs:space-y-3.5 pt-2">
                {/* Input 1: Anonymous name (optional) / Name (optional) */}
                <div className="relative">
                  <input
                    type="text"
                    value={waitlistName}
                    onChange={(e) => setWaitlistName(e.target.value)}
                    placeholder="Name (optional)"
                    className="w-full rounded-full bg-white/[0.07] hover:bg-white/[0.1] focus:bg-white/[0.12] border border-white/15 focus:border-[#FD5C05] px-4 xs:px-6 py-3 xs:py-4 text-xs sm:text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 text-center font-medium shadow-inner"
                  />
                </div>

                {/* Input 2: Email */}
                <div className="relative">
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-full bg-white/[0.07] hover:bg-white/[0.1] focus:bg-white/[0.12] border border-white/15 focus:border-[#FD5C05] px-4 xs:px-6 py-3 xs:py-4 text-xs sm:text-sm text-white placeholder:text-white/40 outline-none transition-all duration-200 text-center font-medium shadow-inner"
                  />
                </div>

                {/* Pill CTA Button matching reference */}
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#EAE4CF] hover:bg-white hover:-translate-y-0.5 py-3 xs:py-4 px-4 xs:px-6 text-xs sm:text-sm font-black text-[#2A2621] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Join waitlist</span>
                  <ArrowRight className="h-4 w-4 text-[#2A2621] group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2621] border-t border-white/5 py-10 xs:py-12 sm:py-16 md:py-20 text-white relative z-10">
        <div className="mx-auto max-w-7xl px-3.5 xs:px-5 sm:px-6 md:px-8 space-y-8 xs:space-y-10 sm:space-y-12">
          
          {/* Top row: Column Grid */}
          <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-12 gap-6 xs:gap-8 text-left">
            
            {/* Left Description Column */}
            <div className="min-[450px]:col-span-2 md:col-span-6 space-y-3.5 xs:space-y-4">
              <EvidaLogo size={36} lightMode={false} text="EVIDA" />
              <p className="text-xs text-[#5A554E] leading-relaxed max-w-xs font-semibold break-words">
                Bringing students, organizations, and schools together through one connected campus experience.
              </p>
              
              {/* Connect icons */}
              <div className="flex items-center gap-3.5 pt-1 xs:pt-2">
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
            <div className="min-[450px]:col-span-1 md:col-span-2 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-white block">Product</span>
              <ul className="flex flex-col gap-2 text-xs text-[#5A554E] font-semibold">
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
                  <a href="#get-started" className="hover:text-[#FD5C05] transition-colors">Join Waitlist</a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="min-[450px]:col-span-1 md:col-span-2 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-white block">Company</span>
              <ul className="flex flex-col gap-2 text-xs text-[#5A554E] font-semibold">
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
            <div className="min-[450px]:col-span-1 md:col-span-2 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-white block">Legal</span>
              <ul className="flex flex-col gap-2 text-xs text-[#5A554E] font-semibold">
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
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] xs:text-xs text-[#5A554E] font-medium text-center md:text-left">
            <span>© 2026 Evida. Built for campus life.</span>
          </div>

        </div>
      </footer>
    </div>
  );
}
