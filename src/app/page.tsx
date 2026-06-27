'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Compass, Megaphone, Shield, MousePointer2, UserCheck, CalendarDays, LineChart, ArrowRight } from 'lucide-react';
import { DesktopNav } from '@/components/Navbar';
import EventCard from '@/components/student/EventCard';
import FeaturedEventCard from '@/components/student/FeaturedEventCard';
import AboutEvidaSection from '@/components/student/AboutEvidaSection';
import { useEvents } from '@/lib/context/EventContext';

export default function LandingPage() {
  const { events } = useEvents();
  
  // Map the specific featured events and their uploaded images
  const featuredEventsData = [
    { title: "Fall Welcome Orientation", image: "/pexels-amar-20025867.jpg" },
    { title: "Homecoming Football Game", image: "/pexels-maorattias-5191958.jpg" },
    { title: "Annual Career Fair", image: "/pexels-rdne-7648057.jpg" },
    { title: "Blue Bears Basketball Game", image: "/pexels-nick-rush-2508183-11211233.jpg" },
    { title: "STEM Club Workshop", image: "/pexels-rdne-7648057.jpg" },
    { title: "Varsity Tennis Match", image: "/pexels-gasparzaldo-13464806.jpg" }
  ];

  const approvedEvents = events.filter(e => e.status === 'approved');
  
  const displayEvents = featuredEventsData.map((data, i) => {
    // Pick a base event to copy details from
    const baseEvent = approvedEvents[i % approvedEvents.length] || {};
    return {
      ...baseEvent,
      id: `featured-${i}`,
      title: data.title,
      coverImage: data.image,
    };
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans overflow-x-hidden">
      <DesktopNav variant="public" />

      {/* Full-Screen Cinematic Hero Section */}
      <section className="relative w-full h-[100vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-[#0F0F13]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-[url('/pexels-maorattias-5191958.jpg')] bg-cover bg-center opacity-50 grayscale contrast-125"
        />
        
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F13]/80 via-transparent to-[#0F0F13] z-0" />

        {/* Hero Content (Centered) */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto -mt-16">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-wide mb-8" style={{ fontFamily: 'var(--font-lufga)' }}>
            Discover Evida, the digital home of campus life and community connection
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/student/events" className="bg-[var(--color-evida-blue)] text-[#111827] font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-[var(--color-evida-coral)] hover:text-white transition-colors flex items-center gap-2 rounded-sm shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
              Explore Events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#how-it-works" className="bg-transparent border-2 border-[var(--color-evida-blue)] text-[var(--color-evida-blue)] font-black uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-[var(--color-evida-blue)] hover:text-[#111827] transition-colors flex items-center gap-2 rounded-sm">
              How Evida Works <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Scrolling Category Marquee (Bottom of Hero) */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="relative w-full overflow-hidden bg-[#0F0F13]/90 backdrop-blur-sm py-5 flex items-center border-t border-white/5 shadow-2xl">
            <div className="animate-marquee flex gap-12 text-[var(--color-evida-coral)] font-black text-xl tracking-[0.2em] uppercase opacity-90">
              <span>ORIENTATION</span>
              <span>HOMECOMING</span>
              <span>CAREER FAIR</span>
              <span>SPORTS</span>
              <span>WORKSHOPS</span>
              <span>STUDENT LIFE</span>
              <span>ORGANIZATIONS</span>
              <span>CULTURAL EVENTS</span>
              {/* Duplicate for infinite effect */}
              <span>ORIENTATION</span>
              <span>HOMECOMING</span>
              <span>CAREER FAIR</span>
              <span>SPORTS</span>
              <span>WORKSHOPS</span>
              <span>STUDENT LIFE</span>
              <span>ORGANIZATIONS</span>
              <span>CULTURAL EVENTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Evida Section */}
      <AboutEvidaSection />

      {/* Why Evida Section */}
      <section className="w-full bg-gray-50 py-24 mt-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-heading-2 text-gray-900">Why Evida?</h2>
            <p className="text-subtitle text-gray-600 leading-relaxed">
              Students miss events because information is scattered across emails, flyers, and group chats. Schools struggle to track engagement. Evida centralizes campus life into one unified platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[var(--color-evida-coral)]/10 flex items-center justify-center text-[var(--color-evida-coral)]">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="text-title text-gray-900">Discover Events</h3>
              <p className="text-subtitle text-gray-500">Find exactly what you're looking for. Filter by category, date, or organization.</p>
            </div>
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[var(--color-evida-coral)]/10 flex items-center justify-center text-[var(--color-evida-coral)]">
                <Megaphone className="h-7 w-7" />
              </div>
              <h3 className="text-title text-gray-900">Create & Promote</h3>
              <p className="text-subtitle text-gray-500">Launch events or promotions for your club and track RSVPs instantly.</p>
            </div>
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-[var(--color-evida-coral)]/10 flex items-center justify-center text-[var(--color-evida-coral)]">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-title text-gray-900">Built for Schools</h3>
              <p className="text-subtitle text-gray-500">Administrators can review events, feature content, and monitor engagement analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-16">
          <h2 className="text-heading-2 text-gray-900">How It Works</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
            
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="h-16 w-16 rounded-full bg-white border-[4px] border-[var(--color-evida-coral)] flex items-center justify-center shadow-lg">
                <Search className="h-6 w-6 text-[var(--color-evida-coral)]" />
              </div>
              <h4 className="text-title text-gray-900">1. Discover</h4>
            </div>
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="h-16 w-16 rounded-full bg-white border-[4px] border-gray-200 flex items-center justify-center">
                <MousePointer2 className="h-6 w-6 text-gray-400" />
              </div>
              <h4 className="text-title text-gray-900">2. Create</h4>
            </div>
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="h-16 w-16 rounded-full bg-white border-[4px] border-gray-200 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-gray-400" />
              </div>
              <h4 className="text-title text-gray-900">3. Attend</h4>
            </div>
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="h-16 w-16 rounded-full bg-white border-[4px] border-gray-200 flex items-center justify-center">
                <LineChart className="h-6 w-6 text-gray-400" />
              </div>
              <h4 className="text-title text-gray-900">4. Engage</h4>
            </div>
          </div>
        </div>
      </section>

      {/* For Students & Schools */}
      <section className="w-full py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8">
          
          <div className="rounded-[32px] bg-gradient-to-br from-[var(--color-evida-blue)] to-[#3B82F6] p-10 text-white shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-heading-2">For Students</h3>
              <p className="text-subtitle text-white/80 leading-relaxed">
                Stop missing out. Everything happening on campus, curated just for you.
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-white/60" /> Discover campus events</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-white/60" /> RSVP and save events</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-white/60" /> Create your own promotions</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-white/60" /> Connect with campus life</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[32px] bg-white border-2 border-[var(--color-evida-blue)]/30 p-10 text-gray-900 shadow-md flex flex-col justify-between">
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-xl bg-[var(--color-evida-blue)]/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-[var(--color-evida-blue)]" />
              </div>
              <h3 className="text-heading-2">For Schools</h3>
              <p className="text-subtitle text-gray-600 leading-relaxed">
                Take control of your campus narrative. Manage, review, and track engagement.
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-2 text-gray-700"><div className="h-1.5 w-1.5 rounded-full bg-[var(--color-evida-blue)]/50" /> Review and approve events</li>
                <li className="flex items-center gap-2 text-gray-700"><div className="h-1.5 w-1.5 rounded-full bg-[var(--color-evida-blue)]/50" /> Feature official events</li>
                <li className="flex items-center gap-2 text-gray-700"><div className="h-1.5 w-1.5 rounded-full bg-[var(--color-evida-blue)]/50" /> Manage student organizations</li>
                <li className="flex items-center gap-2 text-gray-700"><div className="h-1.5 w-1.5 rounded-full bg-[var(--color-evida-blue)]/50" /> View engagement analytics</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Events Section (Grungy Dark Theme) */}
      <section className="relative w-full bg-[#0F0F13] py-24 mt-20 mb-12">
        {/* Torn Paper Edges */}
        <div className="absolute top-[-10px] left-0 w-full h-10 bg-[#0F0F13] edge-top z-10" />
        <div className="absolute bottom-[-10px] left-0 w-full h-10 bg-white edge-bottom z-10" />
        <div className="absolute bottom-0 left-0 w-full h-10 bg-[#0F0F13]" /> {/* Block behind bottom edge */}

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-20">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div>
              <h2 className="text-heading-2 text-white mb-2">College end, memories don't</h2>
              <p className="text-subtitle text-white/70">Discover the biggest events happening this week on your campus.</p>
            </div>
            <Link href="/student/events" className="flex items-center gap-2 text-[12px] font-bold text-white hover:text-[var(--color-evida-lime)] transition-colors uppercase tracking-widest self-start md:self-center mt-2 md:mt-0">
              View All Events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-sm mb-12">
            <input 
              type="text" 
              placeholder="Search events" 
              className="w-full bg-[#1A1A1E] border border-white/10 text-white placeholder-gray-500 text-sm px-4 py-3 rounded-none focus:outline-none focus:border-[var(--color-evida-lime)] transition-colors"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event, i) => (
              <FeaturedEventCard 
                key={`${event.id}-${i}`}
                event={event}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        {/* Scrolling Marquee */}
        <div className="relative mt-20 w-full overflow-hidden border-y border-white/5 bg-[#141417] py-4 flex items-center z-20">
          <div className="animate-marquee flex gap-12 text-[var(--color-evida-lime)] font-black text-xl tracking-[0.2em] uppercase opacity-80">
            <span>ORIENTATION</span>
            <span>HOMECOMING</span>
            <span>CAREER FAIR</span>
            <span>SPORTS</span>
            <span>WORKSHOPS</span>
            <span>STUDENT LIFE</span>
            <span>ORGANIZATIONS</span>
            <span>CULTURAL EVENTS</span>
            {/* Duplicate for infinite effect */}
            <span>ORIENTATION</span>
            <span>HOMECOMING</span>
            <span>CAREER FAIR</span>
            <span>SPORTS</span>
            <span>WORKSHOPS</span>
            <span>STUDENT LIFE</span>
            <span>ORGANIZATIONS</span>
            <span>CULTURAL EVENTS</span>
          </div>
        </div>
      </section>
      
      {/* Grungy Footer / Lower Landing Section */}
      <footer className="relative w-full bg-[#0F0F13] pt-24 pb-12 mt-20">
        {/* Torn Paper Top Edge */}
        <div className="absolute top-[-10px] left-0 w-full h-10 bg-[#0F0F13] edge-top z-10" />
        
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 z-20 flex flex-col items-center">
          
          {/* Logo / Title above cards */}
          <div className="mb-12 flex justify-center w-full">
             <span className="text-4xl font-black tracking-widest text-white uppercase" style={{ fontFamily: 'var(--font-lufga)' }}>
               Evida.
             </span>
          </div>

          {/* 2 Campus Cards */}
          <div className="grid md:grid-cols-2 gap-8 w-full mb-16">
            
            {/* Card 1: Discover Campus Life */}
            <div className="flex flex-col bg-[#1A1A1E] rounded-none overflow-hidden border border-white/5 group">
              {/* Header (Evida Blue) */}
              <div className="bg-[var(--color-evida-blue)] p-4 flex justify-between items-center text-[#111827]">
                <div className="pr-4">
                  <h3 className="text-xl font-black uppercase tracking-wide" style={{ fontFamily: 'var(--font-lufga)' }}>Discover Campus Life</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Explore everything happening on your campus.</p>
                </div>
                <Link href="/student/events" className="text-[11px] font-bold flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-wider shrink-0">
                  Explore Events <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {/* Body / Preview */}
              <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F13] via-[#0F0F13]/60 to-transparent opacity-90" />
                <div className="absolute bottom-6 left-6">
                  <ul className="space-y-2 text-white font-bold tracking-widest uppercase text-xs opacity-90">
                    <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[var(--color-evida-blue)] rounded-full"/>Events</li>
                    <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[var(--color-evida-blue)] rounded-full"/>Student Organizations</li>
                    <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[var(--color-evida-blue)] rounded-full"/>Workshops</li>
                    <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[var(--color-evida-blue)] rounded-full"/>Sports</li>
                    <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[var(--color-evida-blue)] rounded-full"/>Homecoming</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 2: Create & Share */}
            <div className="flex flex-col bg-[#1A1A1E] rounded-none overflow-hidden border border-white/5 group">
              {/* Header (Evida Coral) */}
              <div className="bg-[var(--color-evida-coral)] p-4 flex justify-between items-center text-[#111827]">
                <div className="pr-4">
                  <h3 className="text-xl font-black uppercase tracking-wide" style={{ fontFamily: 'var(--font-lufga)' }}>Create & Share</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1 max-w-[200px]">Bring your campus to life.</p>
                </div>
                <Link href="/login" className="text-[11px] font-bold flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-wider shrink-0 text-right">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {/* Body / Preview */}
              <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494112-071d169408fc?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F13] via-[#0F0F13]/60 to-transparent opacity-90" />
                <div className="absolute bottom-6 left-6">
                  <ul className="space-y-2 text-white font-bold tracking-widest uppercase text-xs opacity-90">
                    <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[var(--color-evida-coral)] rounded-full"/>Create Events</li>
                    <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[var(--color-evida-coral)] rounded-full"/>Promote Initiatives</li>
                    <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[var(--color-evida-coral)] rounded-full"/>Manage Organizations</li>
                    <li className="flex items-center gap-3"><div className="h-1.5 w-1.5 bg-[var(--color-evida-coral)] rounded-full"/>Grow Your Community</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scrolling Category Marquee */}
        <div className="relative w-full overflow-hidden border-y border-white/5 bg-[#141417] py-4 flex items-center z-20 mb-16">
          <div className="animate-marquee flex gap-12 text-[var(--color-evida-lime)] font-black text-xl tracking-[0.2em] uppercase opacity-80">
            <span>ORIENTATION</span>
            <span>CAREER FAIR</span>
            <span>SPORTS</span>
            <span>HOMECOMING</span>
            <span>WORKSHOPS</span>
            <span>STUDENT LIFE</span>
            <span>ORGANIZATIONS</span>
            <span>CULTURAL EVENTS</span>
            {/* Duplicate for infinite effect */}
            <span>ORIENTATION</span>
            <span>CAREER FAIR</span>
            <span>SPORTS</span>
            <span>HOMECOMING</span>
            <span>WORKSHOPS</span>
            <span>STUDENT LIFE</span>
            <span>ORGANIZATIONS</span>
            <span>CULTURAL EVENTS</span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-4 gap-12 text-white/70 mb-12">
          
          {/* Left Column */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Contact</h4>
            <div className="space-y-1 text-sm font-medium">
              <p className="text-white font-black text-lg mb-2 tracking-wide" style={{ fontFamily: 'var(--font-lufga)' }}>EVIDA</p>
              <p>Campus Event & Engagement Platform</p>
              <p className="pt-2 hover:text-[var(--color-evida-coral)] transition-colors cursor-pointer">Email: hello@evida.app</p>
            </div>
          </div>

          {/* Middle Column */}
          <div>
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Discover</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="#why-evida" className="hover:text-white transition-colors">Why Evida</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#featured-events" className="hover:text-white transition-colors">Featured Events</Link></li>
              <li><Link href="#for-students" className="hover:text-white transition-colors">For Students</Link></li>
              <li><Link href="#for-schools" className="hover:text-white transition-colors">For Schools</Link></li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Platform</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/student/events" className="hover:text-white transition-colors">Explore Events</Link></li>
              <li><Link href="/student/create" className="hover:text-white transition-colors">Create Event</Link></li>
              <li><Link href="/student/create" className="hover:text-white transition-colors">Create Promotion</Link></li>
              <li><Link href="/student/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link href="/school/dashboard" className="hover:text-white transition-colors">School Dashboard</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[var(--color-evida-blue)] font-bold uppercase tracking-widest text-xs mb-4">Stay Social</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-[var(--color-evida-lime)] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[var(--color-evida-lime)] transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="relative text-center border-t border-white/5 pt-8 pb-4">
          <p className="text-[var(--color-evida-lime)] font-black text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-lufga)' }}>
            Evida — Campus life, all in one place.
          </p>
        </div>
      </footer>
    </div>
  );
}
