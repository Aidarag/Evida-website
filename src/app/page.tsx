'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Compass, Megaphone, Shield, MousePointer2, UserCheck, CalendarDays, LineChart, ArrowRight, Briefcase, Sparkles, Music, Trophy, GraduationCap, Users, Palette, Heart, Code, Film } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { DesktopNav } from '@/components/Navbar';
import FeaturedEventCard from '@/components/student/FeaturedEventCard';
import AboutEvidaSection from '@/components/student/AboutEvidaSection';
import OurVisionSection from '@/components/student/OurVisionSection';
import { useEvents } from '@/lib/context/EventContext';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function LandingPage() {
  const router = useRouter();
  const { events } = useEvents();

  // Scroll-based parallax and zoom transforms for the hero background image
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 600], [0, 160]);
  const opacityBg = useTransform(scrollY, [0, 600], [0.45, 0.05]);
  const scaleBg = useTransform(scrollY, [0, 600], [1, 1.06]);

  const faqData = {
    students: [
      {
        question: "Can I create my own event?",
        answer: "Yes. Students can submit events through Evida. Depending on your school’s policies, some events may require approval before they are published."
      },
      {
        question: "Do I need to join a club or organization to use Evida?",
        answer: "No. Every student can discover, save, and RSVP to events. You don’t need to belong to an organization to enjoy campus life."
      },
      {
        question: "Will I miss events if I don’t check Evida every day?",
        answer: "No. Save events you’re interested in and receive reminders so you never miss important dates."
      }
    ],
    schools: [
      {
        question: "How does Evida help our campus?",
        answer: "Evida centralizes campus events into one platform, making it easier to communicate with students, increase participation, and manage campus activities."
      },
      {
        question: "Can schools review events before they are published?",
        answer: "Yes. Schools have an administrative dashboard where they can review, approve, reject, or feature events according to campus policies."
      },
      {
        question: "Does Evida provide insights about student engagement?",
        answer: "Yes. Schools can access analytics such as event participation, attendance trends, and engagement metrics to better understand campus life."
      }
    ]
  };

  const [faqTab, setFaqTab] = React.useState<'students' | 'schools'>('students');
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);
  
  const approvedEvents = events.filter(e => e.status === 'approved');
  const [selectedCategory, setSelectedCategory] = React.useState('Sports');
  const [calendarDate, setCalendarDate] = React.useState<Date>(new Date(2026, 9, 1)); // October 2026

  const mockEventsByCategory: Record<string, Array<any>> = {
    'Sports': [
      { id: 'mock-sports-1', title: 'Blue Bears Basketball Game', category: 'Sports', date: 'Oct 12, 2026', time: '7:00 PM', location: 'Campus Arena', coverImage: '/pexels-marwen-larafa-2159807713-37714941.jpg' },
      { id: 'mock-sports-2', title: 'Varsity Tennis Match', category: 'Sports', date: 'Oct 18, 2026', time: '3:00 PM', location: 'Tennis Courts', coverImage: '/pexels-hanna-elesha-abraham-1587801282-27498756.jpg' },
      { id: 'mock-sports-3', title: 'Intramural Soccer Finals', category: 'Sports', date: 'Oct 24, 2026', time: '5:00 PM', location: 'Athletic Field', coverImage: '/pexels-yaroslav-shuraev-8513385.jpg' },
    ],
    'Homecoming': [
      { id: 'mock-home-1', title: 'Homecoming Football Game', category: 'Homecoming', date: 'Oct 15, 2026', time: '2:00 PM', location: 'Memorial Stadium', coverImage: '/pexels-marwen-larafa-2159807713-37714941.jpg' },
      { id: 'mock-home-2', title: 'Homecoming Concert & Dance', category: 'Homecoming', date: 'Oct 16, 2026', time: '8:00 PM', location: 'Main Plaza', coverImage: '/pexels-franco-monsalvo-252430633-37980178.jpg' },
      { id: 'mock-home-3', title: 'Alumni Tailgate Party', category: 'Homecoming', date: 'Oct 15, 2026', time: '11:00 AM', location: 'West Lot', coverImage: '/pexels-gu-ko-2150570603-31827067.jpg' },
    ],
    'Career Fair': [
      { id: 'mock-career-1', title: 'Annual Fall Career Fair', category: 'Career Fair', date: 'Oct 20, 2026', time: '10:00 AM', location: 'Student Union Ballroom', coverImage: '/pexels-edward-jenner-4031319.jpg' },
      { id: 'mock-career-2', title: 'Tech Resume Review', category: 'Career Fair', date: 'Oct 21, 2026', time: '2:00 PM', location: 'Science Hall 101', coverImage: '/pexels-markus-winkler-1430818-12199407.jpg' },
      { id: 'mock-career-3', title: 'Mock Interview Blitz', category: 'Career Fair', date: 'Oct 22, 2026', time: '1:00 PM', location: 'Career Center', coverImage: '/pexels-cottonbro-5989925.jpg' },
    ],
    'Workshops': [
      { id: 'mock-work-1', title: 'STEM Club Code & Coffee', category: 'Workshops', date: 'Oct 10, 2026', time: '9:00 AM', location: 'Engineering Lab B', coverImage: '/pexels-tima-miroshnichenko-5439368.jpg' },
      { id: 'mock-work-2', title: 'Creative Writing Workshop', category: 'Workshops', date: 'Oct 14, 2026', time: '4:00 PM', location: 'Library Room 302', coverImage: '/pexels-cottonbro-5989925.jpg' },
      { id: 'mock-work-3', title: 'UI/UX Design Masterclass', category: 'Workshops', date: 'Oct 19, 2026', time: '6:00 PM', location: 'Design Studio', coverImage: '/pexels-markus-winkler-1430818-12199407.jpg' },
    ],
    'Orientation': [
      { id: 'mock-ori-1', title: 'Freshman Welcome Rally', category: 'Orientation', date: 'Oct 1, 2026', time: '9:00 AM', location: 'Quad', coverImage: '/pexels-ron-lach-8576102.jpg' },
      { id: 'mock-ori-2', title: 'Campus Scavenger Hunt', category: 'Orientation', date: 'Oct 2, 2026', time: '2:00 PM', location: 'Student Center', coverImage: '/pexels-gu-ko-2150570603-31827067.jpg' },
      { id: 'mock-ori-3', title: 'President\'s Ice Cream Social', category: 'Orientation', date: 'Oct 3, 2026', time: '4:00 PM', location: 'President\'s Lawn', coverImage: '/pexels-yaroslav-shuraev-8513385.jpg' },
    ],
    'Concerts': [
      { id: 'mock-concert-1', title: 'Acoustic Sunset Session', category: 'Concerts', date: 'Oct 9, 2026', time: '6:00 PM', location: 'Amphitheater', coverImage: '/pexels-amine-1285347-9371719.jpg' },
      { id: 'mock-concert-2', title: 'Battle of the Bands', category: 'Concerts', date: 'Oct 23, 2026', time: '8:00 PM', location: 'Campus Theatre', coverImage: '/pexels-franco-monsalvo-252430633-37980178.jpg' },
      { id: 'mock-concert-3', title: 'Jazz Ensemble Fall Show', category: 'Concerts', date: 'Oct 30, 2026', time: '7:30 PM', location: 'Music Hall', coverImage: '/pexels-franco-monsalvo-252430633-37980178.jpg' },
    ],
    'Parties': [
      { id: 'mock-party-1', title: 'Welcome Back Neon Rave', category: 'Parties', date: 'Oct 5, 2026', time: '9:00 PM', location: 'Student Plaza', coverImage: '/pexels-amine-1285347-9371719.jpg' },
      { id: 'mock-party-2', title: 'Halloween Costume Ball', category: 'Parties', date: 'Oct 31, 2026', time: '8:00 PM', location: 'Gymnasium', coverImage: '/pexels-ron-lach-8576102.jpg' },
    ],
    'Clubs': [
      { id: 'mock-club-1', title: 'Astronomy Club Stargazing', category: 'Clubs', date: 'Oct 12, 2026', time: '9:00 PM', location: 'Observatory Hill', coverImage: '/pexels-amine-1285347-9371719.jpg' },
      { id: 'mock-club-2', title: 'Chess Club Open Tournament', category: 'Clubs', date: 'Oct 17, 2026', time: '1:00 PM', location: 'Student Union', coverImage: '/pexels-tima-miroshnichenko-5439368.jpg' },
    ],
    'Academic Events': [
      { id: 'mock-acad-1', title: 'Distinguished Lecture Series', category: 'Academic Events', date: 'Oct 8, 2026', time: '4:00 PM', location: 'Auditorium A', coverImage: '/pexels-edward-jenner-4031319.jpg' },
      { id: 'mock-acad-2', title: 'Undergraduate Research Symposium', category: 'Academic Events', date: 'Oct 22, 2026', time: '10:00 AM', location: 'Science Center Lobby', coverImage: '/pexels-edward-jenner-4031319.jpg' },
    ],
  };

  const getEventsForCategory = (catName: string) => {
    const normalized = catName.toLowerCase();
    if (normalized.includes('sport') || normalized.includes('athlet')) {
      return mockEventsByCategory['Sports'];
    }
    if (normalized.includes('homecoming')) {
      return mockEventsByCategory['Homecoming'];
    }
    if (normalized.includes('career') || normalized.includes('network') || normalized.includes('develop')) {
      return mockEventsByCategory['Career Fair'];
    }
    if (normalized.includes('workshop') || normalized.includes('hackathon')) {
      return mockEventsByCategory['Workshops'];
    }
    if (normalized.includes('orientation') || normalized.includes('campus') || normalized.includes('volunteer')) {
      return mockEventsByCategory['Orientation'];
    }
    if (normalized.includes('concert') || normalized.includes('cultural')) {
      return mockEventsByCategory['Concerts'];
    }
    if (normalized.includes('party') || normalized.includes('greek')) {
      return mockEventsByCategory['Parties'];
    }
    if (normalized.includes('club') || normalized.includes('student org')) {
      return mockEventsByCategory['Clubs'];
    }
    return mockEventsByCategory['Academic Events'] || [];
  };

  const filteredEvents = approvedEvents.filter(
    (event) => event.category?.toLowerCase() === selectedCategory.toLowerCase()
  );

  const categoryEvents = [...filteredEvents, ...getEventsForCategory(selectedCategory)].slice(0, 3);

  // Dynamic Calendar Calculation
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const calendarDays = [];
  
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }
  
  const totalCells = calendarDays.length > 35 ? 42 : 35;
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  const highlightedDays = [3, 5, 8, 12, 15, 18, 20, 22, 26, 29];

  const getHighlightStyle = (day: number) => {
    if (day === 3 || day === 12 || day === 20 || day === 26) {
      const IconComp = day === 3 ? GraduationCap : day === 12 ? Music : day === 20 ? Palette : Sparkles;
      return {
        bgColor: 'bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/15',
        borderColor: 'border-[#FF5A1F]/35',
        textColor: 'text-[#FF5A1F]',
        icon: <IconComp className="h-4 w-4 text-[#FF5A1F] stroke-[2]" />,
      };
    }
    if (day === 5 || day === 15 || day === 22) {
      const IconComp = day === 5 ? Users : day === 15 ? Trophy : Heart;
      return {
        bgColor: 'bg-black/5 hover:bg-black/8',
        borderColor: 'border-black/20',
        textColor: 'text-[#121212]',
        icon: <IconComp className="h-4 w-4 text-[#121212] stroke-[2]" />,
      };
    }
    const IconComp = day === 8 ? Briefcase : day === 18 ? Code : Film;
    return {
      bgColor: 'bg-[#FF5A1F]/10 hover:bg-[#FF5A1F]/15',
      borderColor: 'border-[#FF5A1F]/35',
      textColor: 'text-[#FF5A1F]',
      icon: <IconComp className="h-4 w-4 text-[#FF5A1F] stroke-[2]" />,
    };
  };

  const getEventsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;
    return events.filter(e => e.date === dateString && e.status === 'approved');
  };

  const headlineLines = ["Discover Evida,", "the digital home", "of campus life"];

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#121212] flex flex-col font-sans overflow-x-hidden">
      <DesktopNav variant="public" />

      {/* Full-Screen Immersive Hero Section */}
      <section className="relative w-full h-[92vh] min-h-[650px] flex flex-col items-center justify-center overflow-hidden bg-[#121212]">
        
        {/* Animated Background Image */}
        <motion.div 
          style={{ y: yBg, opacity: opacityBg, scale: scaleBg }}
          className="absolute inset-0 w-full h-full bg-[url('/pexels-maorattias-5191958.jpg')] bg-cover bg-center pointer-events-none"
        />
        
        {/* Dark Elegant Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/75 via-[#121212]/50 to-[#121212] z-0" />

        {/* Ambient Gradient Blobs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#FF5A1F]/8 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto -mt-10">
          
          {/* Accent Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white/95 backdrop-blur-md">
              THE DIGITAL HOME OF CAMPUS LIFE
            </span>
          </motion.div>

          {/* Headline Word Reveal */}
          <h1 
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-8 select-none uppercase max-w-5xl mx-auto"
          >
            {headlineLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <br />}
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`inline-block ${idx === 2 ? "text-[#FF5A1F]" : "text-white"}`}
                >
                  {line}
                </motion.span>
              </React.Fragment>
            ))}
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm md:text-base text-white/70 max-w-xl mx-auto mb-8 font-light leading-relaxed"
          >
            Evida is a premium engagement experience. Students discover events, track RSVPs, and build communities, while universities manage activities with real-time analytics.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/student/events" 
              className="bg-[#FF5A1F] text-white font-bold uppercase tracking-widest text-[11px] px-8 py-4 hover:bg-[#e04b12] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 rounded-full shadow-[0_4px_18px_rgba(255,90,31,0.3)]"
            >
              Explore Events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/login" 
              className="bg-white/10 border border-white/15 text-white font-bold uppercase tracking-widest text-[11px] px-8 py-4 hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 rounded-full backdrop-blur-md"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Student Avatars Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center gap-3 mt-10 justify-center"
          >
            <div className="flex -space-x-2.5">
              <img className="w-8 h-8 rounded-full border-2 border-[#121212] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face" alt="Student" />
              <img className="w-8 h-8 rounded-full border-2 border-[#121212] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="Student" />
              <img className="w-8 h-8 rounded-full border-2 border-[#121212] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" alt="Student" />
              <img className="w-8 h-8 rounded-full border-2 border-[#121212] object-cover" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop&crop=face" alt="Student" />
            </div>
            <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider">Joined by 12,000+ active students</p>
          </motion.div>
        </div>

        {/* Bouncing Scroll Down Indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
          onClick={() => document.getElementById('about-evida')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[9px] font-bold tracking-[0.25em] text-white/30 uppercase">SCROLL TO EXPLORE</span>
          <div className="w-5 h-8 border-2 border-white/15 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-[#FF5A1F] rounded-full" />
          </div>
        </motion.div>

        {/* Scrolling Category Marquee (Bottom) */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="relative w-full overflow-hidden bg-[#121212]/90 backdrop-blur-md py-4.5 flex items-center border-t border-white/5 shadow-2xl">
            <div className="animate-marquee flex gap-12 text-white font-bold text-sm tracking-[0.2em] uppercase opacity-80 items-center">
              <span>ORIENTATION</span>
              <EvidaLogo size={18} showText={false} />
              <span>HOMECOMING</span>
              <EvidaLogo size={18} showText={false} />
              <span>CAREER FAIR</span>
              <EvidaLogo size={18} showText={false} />
              <span>SPORTS</span>
              <EvidaLogo size={18} showText={false} />
              <span>WORKSHOPS</span>
              <EvidaLogo size={18} showText={false} />
              <span>STUDENT LIFE</span>
              <EvidaLogo size={18} showText={false} />
              <span>ORGANIZATIONS</span>
              <EvidaLogo size={18} showText={false} />
              <span>CULTURAL EVENTS</span>
              <EvidaLogo size={18} showText={false} />
              
              {/* Duplicate for infinite effect */}
              <span>ORIENTATION</span>
              <EvidaLogo size={18} showText={false} />
              <span>HOMECOMING</span>
              <EvidaLogo size={18} showText={false} />
              <span>CAREER FAIR</span>
              <EvidaLogo size={18} showText={false} />
              <span>SPORTS</span>
              <EvidaLogo size={18} showText={false} />
              <span>WORKSHOPS</span>
              <EvidaLogo size={18} showText={false} />
              <span>STUDENT LIFE</span>
              <EvidaLogo size={18} showText={false} />
              <span>ORGANIZATIONS</span>
              <EvidaLogo size={18} showText={false} />
              <span>CULTURAL EVENTS</span>
              <EvidaLogo size={18} showText={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 1. About Evida Section */}
      <AboutEvidaSection />

      {/* 2. Our Mission (Vision) Section */}
      <OurVisionSection />

      {/* 3. How it Works Section */}
      <section className="w-full py-24 bg-[#FFFDF8] font-sans overflow-hidden" id="how-it-works">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center space-y-16">
          
          <div className="space-y-4">
            <span className="text-[#FF5A1F] font-bold uppercase text-xs tracking-[0.2em]">
              Process
            </span>
            <h2 className="text-[#121212] font-extrabold text-3xl md:text-5xl uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              How It Works
            </h2>
            <p className="text-[#4F5666] text-sm md:text-base max-w-2xl mx-auto font-light">
              Evida simplifies campus engagement in four simple steps. Here is how you can get started.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left">
            {[
              {
                number: "01",
                title: "Discover",
                icon: Search,
                color: "#FF5A1F",
                lightBg: "bg-[#FF5A1F]/8",
                description: "Find exactly what you're looking for. Filter by category, date, or organization to discover the best of campus life."
              },
              {
                number: "02",
                title: "Create",
                icon: MousePointer2,
                color: "#121212",
                lightBg: "bg-black/5",
                description: "Host your own event, workshop, or promotion. Customize the details and publish instantly for your club or community."
              },
              {
                number: "03",
                title: "Attend",
                icon: UserCheck,
                color: "#FF5A1F",
                lightBg: "bg-[#FF5A1F]/8",
                description: "RSVP to events, save them to your profile, and receive notifications. Show up and connect with your fellow students."
              },
              {
                number: "04",
                title: "Engage",
                icon: LineChart,
                color: "#FF5A1F",
                lightBg: "bg-[#FF5A1F]/8",
                description: "Track attendance, collect feedback, and analyze engagement. Administrators and student leaders get real-time analytics."
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="bg-white border border-black/[0.04] rounded-[24px] p-8 flex flex-col justify-between shadow-[var(--shadow-premium-sm)] hover:shadow-[var(--shadow-premium-md)] transition-all duration-300"
                >
                  {/* Top Row: Number & Icon */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-extrabold text-2xl" style={{ fontFamily: 'var(--font-display)', color: step.color }}>
                      {step.number}
                    </span>
                    <div className={`p-3.5 rounded-2xl border border-transparent ${step.lightBg}`} style={{ color: step.color }}>
                      <Icon className="h-5 w-5 stroke-[2]" />
                    </div>
                  </div>

                  {/* Bottom Area: Title & Description */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-base text-[#121212] uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                      {step.title}
                    </h3>
                    <p className="text-[#4F5666] text-xs sm:text-sm leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Explore by Category Section */}
      <section id="explore-categories" className="relative w-full bg-[#FFFDF8] py-24 border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 z-20 space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-[#FF5A1F] font-bold uppercase text-xs tracking-[0.2em]">
              Discovery
            </span>
            <h2 className="text-[#121212] font-extrabold text-3xl md:text-5xl uppercase tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>
              Explore<br />by Category
            </h2>
            <p className="text-[#4F5666] text-sm md:text-base max-w-2xl mx-auto font-light">
              Click on a category to filter campus events instantly. Discover what interests you the most.
            </p>
          </div>

          {/* Category Selector (Pills with sliding background animation) */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
            {Object.keys(mockEventsByCategory).map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                    isActive ? 'text-white' : 'text-[#4F5666] hover:text-[#121212]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {isActive && (
                    <motion.span 
                      layoutId="activeCategoryBg"
                      className="absolute inset-0 bg-[#FF5A1F] rounded-full z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {categoryEvents.map((event) => (
              <div 
                key={event.id}
                className="transform transition-all duration-500 animate-fade-in"
              >
                <FeaturedEventCard 
                  event={event}
                  onClick={() => router.push(`/events/${event.id}`)}
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4.5 Infinite Category Marquee */}
      <section className="relative w-full bg-[#121212] py-4 overflow-hidden border-t border-b border-white/5 shadow-2xl">
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="animate-marquee flex gap-12 text-white/90 font-bold text-sm tracking-[0.2em] uppercase items-center">
            <span>ORIENTATION</span>
            <EvidaLogo size={18} showText={false} />
            <span>HOMECOMING</span>
            <EvidaLogo size={18} showText={false} />
            <span>CAREER FAIR</span>
            <EvidaLogo size={18} showText={false} />
            <span>SPORTS</span>
            <EvidaLogo size={18} showText={false} />
            <span>WORKSHOPS</span>
            <EvidaLogo size={18} showText={false} />
            <span>STUDENT LIFE</span>
            <EvidaLogo size={18} showText={false} />
            <span>ORGANIZATIONS</span>
            <EvidaLogo size={18} showText={false} />
            <span>CULTURAL EVENTS</span>
            <EvidaLogo size={18} showText={false} />
            
            {/* Duplicate for infinite effect */}
            <span>ORIENTATION</span>
            <EvidaLogo size={18} showText={false} />
            <span>HOMECOMING</span>
            <EvidaLogo size={18} showText={false} />
            <span>CAREER FAIR</span>
            <EvidaLogo size={18} showText={false} />
            <span>SPORTS</span>
            <EvidaLogo size={18} showText={false} />
            <span>WORKSHOPS</span>
            <EvidaLogo size={18} showText={false} />
            <span>STUDENT LIFE</span>
            <EvidaLogo size={18} showText={false} />
            <span>ORGANIZATIONS</span>
            <EvidaLogo size={18} showText={false} />
            <span>CULTURAL EVENTS</span>
            <EvidaLogo size={18} showText={false} />
          </div>
        </div>
      </section>

      {/* 5. Calendar Section (Tactile Design) */}
      <section id="calendar" className="relative w-full bg-[#FFFDF8] py-24 border-t border-black/[0.04]">
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
            
            {/* Left side: Content */}
            <div className="space-y-6 lg:col-span-5 flex flex-col justify-center text-left">
              <span className="text-[#FF5A1F] font-bold uppercase text-xs tracking-[0.2em]">
                What's Happening Next
              </span>
              <h2 className="text-[#121212] font-extrabold text-3xl md:text-5xl uppercase tracking-tight leading-[1.08]" style={{ fontFamily: 'var(--font-display)' }}>
                <span className="block sm:whitespace-nowrap">Your Campus</span>
                <span className="block sm:whitespace-nowrap text-[#FF5A1F]">Calendar</span>
                <span className="block sm:whitespace-nowrap">At A Glance</span>
              </h2>
              <p className="text-[#4F5666] text-sm md:text-base leading-relaxed font-light">
                Never miss a beat. Discover upcoming campus events, connect with student organizations, and make the most of your college experience.
              </p>
              <div className="pt-2">
                <Link href="/student/events" className="inline-flex bg-[#FF5A1F] text-white font-bold uppercase tracking-widest text-[10px] px-7 py-4 hover:bg-[#e04b12] hover:scale-[1.02] active:scale-[0.98] transition-all items-center gap-2 rounded-full shadow-lg shadow-orange-500/20">
                  Explore Events <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right side: Illustrated Tactile Calendar */}
            <div className="lg:col-span-7 w-full">
              <div className="relative bg-white border border-black/[0.05] rounded-[24px] p-6 md:p-8 shadow-[var(--shadow-premium-md)] transition-all duration-500 hover:border-black/[0.08] hover:shadow-[var(--shadow-premium-lg)]">
                
                {/* Binder rings at the top */}
                <div className="absolute top-0 left-0 right-0 h-4 flex justify-around px-12 -translate-y-1/2 z-30">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2.5 h-6.5 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full border border-black/10 shadow-sm relative">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/30 rounded-full" />
                    </div>
                  ))}
                </div>

                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-6 pt-2 border-b border-black/[0.04] pb-4">
                  <div className="text-left">
                    <span className="text-[#FF5A1F] font-bold uppercase text-[9px] tracking-[0.25em]">CAMPUS LIFE</span>
                    <h4 className="text-[#121212] font-bold text-lg md:text-xl tracking-wide uppercase mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                      {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const prev = new Date(calendarDate);
                        prev.setMonth(prev.getMonth() - 1);
                        setCalendarDate(prev);
                      }}
                      className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-gray-400 hover:text-[#121212] hover:border-black/20 transition-all text-xs font-bold cursor-pointer"
                    >
                      &larr;
                    </button>
                    <button 
                      onClick={() => {
                        const next = new Date(calendarDate);
                        next.setMonth(next.getMonth() + 1);
                        setCalendarDate(next);
                      }}
                      className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-gray-400 hover:text-[#121212] hover:border-black/20 transition-all text-xs font-bold cursor-pointer"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 gap-2 mb-4 text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-2 md:gap-3">
                  {calendarDays.map((cell, idx) => {
                    const isHighlighted = cell.isCurrentMonth && highlightedDays.includes(cell.day);
                    const dayEvents = getEventsForDate(cell.date);
                    const hasEvents = dayEvents.length > 0;
                    
                    if (!cell.isCurrentMonth) {
                      return (
                        <div 
                          key={`offset-${idx}`}
                          className="aspect-square bg-gray-50/20 border border-black/[0.02] rounded-xl opacity-20 flex items-center justify-center text-[10px] text-gray-300"
                        >
                          {cell.day}
                        </div>
                      );
                    }
                    
                    if (isHighlighted) {
                      const style = getHighlightStyle(cell.day);
                      const eventTitle = hasEvents ? dayEvents[0].title : `Campus Event ${cell.day}`;
                      const eventId = hasEvents ? dayEvents[0].id : 'mock';
                      
                      return (
                        <div 
                          key={`day-${cell.day}`}
                          onClick={() => {
                            if (hasEvents) {
                              router.push(`/events/${eventId}`);
                            } else {
                              router.push(`/student/events?date=${cell.date.toISOString().split('T')[0]}`);
                            }
                          }}
                          className={`relative aspect-square ${style.bgColor} rounded-xl border ${style.borderColor} flex flex-col items-center justify-center text-[10px] sm:text-xs ${style.textColor} font-bold group/day cursor-pointer hover:scale-105 transition-all duration-300`}
                        >
                          <span className="absolute top-1 left-1.5 text-[8px] sm:text-[9px] font-bold">
                            {cell.day}
                          </span>
                          
                          <div className="mt-2 transform group-hover/day:scale-115 transition-transform duration-300 select-none">
                            {style.icon}
                          </div>
                          
                          {/* Premium Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#121212] border border-white/10 text-[9px] text-white font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/day:opacity-100 transition-opacity duration-300 shadow-[var(--shadow-premium-lg)] z-50">
                            {eventTitle}
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div 
                        key={`day-${cell.day}`}
                        className="aspect-square bg-white rounded-xl border border-black/[0.04] flex items-center justify-center text-[10px] sm:text-xs text-[#4F5666] font-bold hover:border-black/15 hover:text-[#121212] transition-colors"
                      >
                        {cell.day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="relative w-full bg-[#FFFDF8] py-24 border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title and overlapping brand circles */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center py-6">
            <h2 className="text-[#121212] font-extrabold text-5xl md:text-6xl uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
              FAQ
            </h2>
            
            {/* Overlapping Brand Circles */}
            <div className="relative w-24 h-12 flex items-center justify-center mt-6">
              <div className="w-11 h-11 rounded-full border-4 border-[#FF5A1F] opacity-90" />
              <div className="w-11 h-11 rounded-full border-4 border-[#121212] opacity-90 -ml-4" />
            </div>
          </div>

          {/* Right Column: Accordion with smooth transitions */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tab Selector (with sliding background) */}
            <div className="flex space-x-2 bg-white p-1 rounded-full border border-black/[0.04] w-fit shadow-[var(--shadow-premium-sm)] relative">
              <button
                onClick={() => {
                  setFaqTab('students');
                  setExpandedFaq(null);
                }}
                className={`relative px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                  faqTab === 'students' ? 'text-white' : 'text-[#4F5666] hover:text-[#121212]'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {faqTab === 'students' && (
                  <motion.span 
                    layoutId="activeFaqTabBg"
                    className="absolute inset-0 bg-[#FF5A1F] rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">For Students</span>
              </button>
              <button
                onClick={() => {
                  setFaqTab('schools');
                  setExpandedFaq(null);
                }}
                className={`relative px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                  faqTab === 'schools' ? 'text-white' : 'text-[#4F5666] hover:text-[#121212]'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {faqTab === 'schools' && (
                  <motion.span 
                    layoutId="activeFaqTabBg"
                    className="absolute inset-0 bg-[#FF5A1F] rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">For Schools</span>
              </button>
            </div>

            {/* Accordion Cards with Framer Motion Height Transition */}
            <div className="space-y-4">
              {faqData[faqTab].map((item, index) => {
                const isOpen = expandedFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-white border border-black/[0.04] rounded-[16px] overflow-hidden transition-all duration-300 hover:border-black/[0.08] shadow-[var(--shadow-premium-sm)]"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : index)}
                      className="w-full px-6 py-5 flex justify-between items-center text-left gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="text-[#121212] font-bold text-sm sm:text-base uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                        {item.question}
                      </span>
                      <span className="text-gray-400 text-xl font-medium shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 text-[#4F5666] text-xs sm:text-sm leading-relaxed font-light border-t border-black/[0.02] pt-4">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 7. Closing Statement Section (Deep Dark Immersive Theme) */}
      <section className="relative w-full bg-[#121212] pt-32 pb-48 overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
        
        {/* Soft Ambient Radial Glows */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[320px] bg-gradient-to-t from-[#FF5A1F]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center z-20 space-y-8">
          <h2 className="text-white font-extrabold text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            College Ends.<br />
            <span className="text-[#FF5A1F]">
              Memories Don’t.
            </span>
          </h2>
          
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Every event you attend, every connection you make, and every memory you create begins with a single place. Welcome to your campus life, reimagined.
          </p>
          
          <div className="pt-4">
            <Link 
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#121212] hover:bg-[#FF5A1F] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-[#FF5A1F]/10 cursor-pointer"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Get started
            </Link>
          </div>
        </div>

        {/* Giant Immersive EVIDA Wordmark in Background */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden select-none pointer-events-none z-10 leading-none">
          <div className="w-full text-center text-[18vw] font-extrabold tracking-tighter uppercase opacity-[0.03] text-[#FF5A1F] translate-y-[20%]">
            EVIDA
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative w-full bg-[#121212] pt-24 pb-12 border-t border-white/5">
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 z-20 flex flex-col items-center">
          
          {/* Logo / Title */}
          <div className="mb-16 flex justify-center w-full">
             <EvidaLogo size={44} lightMode={false} text="Join Evida" />
          </div>
        </div>

        {/* Footer Links */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 text-white/50 mb-16">
          
          {/* Contact Column */}
          <div className="md:col-span-3 space-y-4 text-left font-sans">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Contact</h4>
            <div className="space-y-1 text-xs font-semibold">
              <p className="text-white font-bold text-base mb-2 tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>EVIDA</p>
              <p>Campus Event & Engagement Platform</p>
              <p className="pt-2 hover:text-[#FF5A1F] transition-colors cursor-pointer">Email: hello@evida.app</p>
            </div>
          </div>

          {/* Discover Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Discover</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li><Link href="#about-evida" className="hover:text-white transition-colors">About Evida</Link></li>
              <li><Link href="#our-mission" className="hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="#explore-categories" className="hover:text-white transition-colors">Featured Events</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Platform</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li><Link href="/student/events" className="hover:text-white transition-colors">Explore Events</Link></li>
              <li><Link href="/student/create" className="hover:text-white transition-colors">Create Event</Link></li>
              <li><Link href="/student/create" className="hover:text-white transition-colors">Create Promotion</Link></li>
              <li><Link href="/student/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link href="/school/dashboard" className="hover:text-white transition-colors">School Dashboard</Link></li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Stay Social</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Newsletter</h4>
            <p className="text-white/40 text-xs leading-relaxed font-light">
              Stay updated on the latest campus events and club promotions.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 pt-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-[#FF5A1F] transition-colors"
                required
              />
              <button 
                type="submit"
                className="bg-[#FF5A1F] text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-[#121212] transition-all duration-300 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="relative text-center border-t border-white/5 pt-8 pb-4">
          <p className="text-[#FF5A1F] font-bold text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
            Evida — Campus life, all in one place.
          </p>
        </div>
      </footer>
    </div>
  );
}
