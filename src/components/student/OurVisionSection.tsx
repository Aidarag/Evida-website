'use client';

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Shield, 
  Compass, 
  Users, 
  Globe, 
  Trophy, 
  ArrowRight 
} from 'lucide-react';

type VisionKey = 'Students' | 'Schools' | 'Discovery' | 'Connection' | 'Community' | 'Memories';

interface VisionContent {
  tagline: string;
  description: string;
}

const visionData: Record<VisionKey, VisionContent> = {
  Students: {
    tagline: "Your campus, all in one place.",
    description: "Evida gives every student a simple way to discover what’s happening on campus, stay informed, and never miss opportunities that matter."
  },
  Schools: {
    tagline: "A smarter way to engage your campus.",
    description: "Evida helps schools centralize events, improve communication, and better connect with students through one trusted platform."
  },
  Discovery: {
    tagline: "Find experiences, not just events.",
    description: "From career fairs to game nights, Evida makes it easy to explore opportunities based on your interests and campus life."
  },
  Connection: {
    tagline: "Meaningful connections start with shared experiences.",
    description: "Every event is a chance to meet new people, join organizations, and build relationships that last beyond college."
  },
  Community: {
    tagline: "One campus. One community.",
    description: "Evida brings students, organizations, and schools together in one connected ecosystem where everyone belongs."
  },
  Memories: {
    tagline: "College ends. Memories don’t.",
    description: "The best moments deserve to be remembered. Evida helps preserve the experiences, friendships, and milestones that define your college journey."
  }
};

const visionKeys: VisionKey[] = ['Students', 'Schools', 'Discovery', 'Connection', 'Community', 'Memories'];

const pillarIcons: Record<VisionKey, React.ComponentType<any>> = {
  Students: GraduationCap,
  Schools: Shield,
  Discovery: Compass,
  Connection: Users,
  Community: Globe,
  Memories: Trophy
};

const pillarColors: Record<VisionKey, { text: string; border: string; bg: string; hoverBg: string; accentColor: string }> = {
  Students: {
    text: 'text-[#2563EB]',
    border: 'border-blue-100',
    bg: 'bg-blue-50/40',
    hoverBg: 'hover:bg-[#2563EB]',
    accentColor: '#2563EB'
  },
  Schools: {
    text: 'text-slate-800',
    border: 'border-slate-200/60',
    bg: 'bg-slate-50/80',
    hoverBg: 'hover:bg-slate-900',
    accentColor: '#1e293b'
  },
  Discovery: {
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    bg: 'bg-emerald-50/40',
    hoverBg: 'hover:bg-emerald-600',
    accentColor: '#059669'
  },
  Connection: {
    text: 'text-[#2563EB]',
    border: 'border-blue-100',
    bg: 'bg-blue-50/40',
    hoverBg: 'hover:bg-[#2563EB]',
    accentColor: '#2563EB'
  },
  Community: {
    text: 'text-slate-800',
    border: 'border-slate-200/60',
    bg: 'bg-slate-50/80',
    hoverBg: 'hover:bg-slate-900',
    accentColor: '#1e293b'
  },
  Memories: {
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    bg: 'bg-emerald-50/40',
    hoverBg: 'hover:bg-emerald-600',
    accentColor: '#059669'
  }
};

const getLinkUrl = (item: VisionKey) => {
  switch (item) {
    case 'Students':
    case 'Schools':
      return '/login';
    case 'Discovery':
      return '/#explore-categories';
    case 'Connection':
      return '/#calendar';
    case 'Community':
      return '/student/dashboard';
    case 'Memories':
      return '/#faq';
  }
};

export default function OurVisionSection() {
  return (
    <section id="our-mission" className="w-full bg-white py-24 border-y border-gray-100 font-sans overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[#2563EB] font-bold uppercase text-xs tracking-[0.2em]">
            Foundations
          </span>
          <h2 className="text-slate-900 font-extrabold text-3xl md:text-5xl uppercase tracking-tight mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Our Vision
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto mt-4">
            The core pillars that shape the Evida experience for students, leaders, and universities.
          </p>
        </div>

        {/* Vertical Stack of Cards */}
        <div className="space-y-6">
          {visionKeys.map((item, index) => {
            const Icon = pillarIcons[item];
            const colors = pillarColors[item];
            const linkUrl = getLinkUrl(item);
            
            return (
              <div
                key={item}
                className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 md:p-8 rounded-[24px] border ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-300`}
              >
                {/* Left side: Icon and Number */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`font-mono text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                    Pillar 0{index + 1}
                  </span>
                  <div className={`p-3 rounded-2xl bg-white border ${colors.border} ${colors.text} shadow-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                {/* Center: Content */}
                <div className="flex-1 text-left space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <h3 className="text-slate-900 font-extrabold text-lg md:text-xl uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                      {item}
                    </h3>
                    <span className="text-slate-500 font-bold text-xs">
                      — {visionData[item].tagline}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-light">
                    {visionData[item].description}
                  </p>
                </div>

                {/* Right side: Action Link */}
                <div className="shrink-0 w-full md:w-auto flex justify-end">
                  <Link 
                    href={linkUrl}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 bg-white border ${colors.border} ${colors.text} hover:bg-slate-900 hover:text-white hover:border-transparent transition-all rounded-full shadow-sm cursor-pointer`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Explore <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
