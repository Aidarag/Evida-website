'use client';

import React, { useState, useEffect } from 'react';
import { DesktopNav, DesktopSidebar, TabletDrawerSidebar, MobileBottomNav, ProfileSwitcher, NotificationBell } from '@/components/Navbar';
import EvidaLogo from '@/components/ui/EvidaLogo';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarState, setSidebarState] = useState<'expanded' | 'collapsed' | 'hidden'>('expanded');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const previewMode = urlParams.get('preview') === 'true' || sessionStorage.getItem('evida_preview') === 'true';
      setIsPreview(previewMode);
      if (previewMode) {
        sessionStorage.setItem('evida_preview', 'true');
      }
    }
  }, []);

  useEffect(() => {
    if (!isPreview) return;

    const updateStep = () => {
      const savedStep = sessionStorage.getItem('evida_onboarding_step');
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      } else if (pathname.includes('/events/')) {
        setCurrentStep(2);
      } else {
        setCurrentStep(0);
      }
    };

    updateStep();

    const handleReset = () => setCurrentStep(0);
    const handleRSVP = () => setCurrentStep(3);

    window.addEventListener('evida_reset_onboarding', handleReset);
    window.addEventListener('evida_trigger_rsvp', handleRSVP);

    const interval = setInterval(updateStep, 250);

    return () => {
      window.removeEventListener('evida_reset_onboarding', handleReset);
      window.removeEventListener('evida_trigger_rsvp', handleRSVP);
      clearInterval(interval);
    };
  }, [isPreview, pathname]);

  if (isPreview) {
    const steps = ['Explore', 'Details', 'RSVP'];
    let stepIdx = 0;
    if (currentStep === 2) stepIdx = 1;
    if (currentStep >= 3) stepIdx = 2;

    return (
      <div className="min-h-screen bg-[#D8D2BC] text-[#2A2621] flex flex-col font-sans w-full overflow-x-hidden pt-[76px] relative">
        {/* Top Onboarding Progress Bar */}
        <div className="fixed top-[32px] inset-x-0 z-50 bg-[#D8D2BC]/95 backdrop-blur-md border-b border-black/[0.04] py-2.5 px-4 flex flex-col gap-1 select-none">
          <div className="flex gap-2 w-full">
            {steps.map((label, idx) => {
              const isFilled = idx <= stepIdx;
              return (
                <div key={idx} className="flex-1 flex flex-col gap-1">
                  <div className={`h-[3px] rounded-full transition-all duration-300 ${isFilled ? 'bg-[#FD5C05]' : 'bg-black/10'}`} />
                  <span className={`text-[8px] font-black uppercase tracking-wider text-center transition-colors duration-300 ${isFilled ? 'text-[#FD5C05]' : 'text-[#2A2621]/30'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <main className="flex-1 w-full max-w-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D8D2BC] text-gray-900 flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Nav (visible only on small screens) */}
      <div className="md:hidden sticky top-0 z-40 w-full py-2.5 px-4 border-b border-black/[0.04] bg-[#D8D2BC]/95 backdrop-blur-xl flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight text-[#2A2621] flex items-center gap-2">
          <EvidaLogo size={30} showText={true} />
        </span>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Link 
            href="/student/settings" 
            className="h-8 w-8 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#2A2621] hover:bg-slate-50 transition-all shadow-sm shrink-0"
            title="Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </Link>
          <ProfileSwitcher />
        </div>
      </div>

      {/* Laptop collapsible sidebar */}
      <DesktopSidebar 
        variant="student" 
        state={sidebarState} 
        onChangeState={setSidebarState} 
      />

      {/* Tablet drawer sidebar */}
      <TabletDrawerSidebar 
        variant="student" 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DesktopNav 
          variant="student" 
          isSidebarHidden={sidebarState === 'hidden'} 
          onShowSidebar={() => setSidebarState('expanded')} 
          onOpenDrawer={() => setIsDrawerOpen(true)} 
        />
        
        <main className="flex-1 pb-32 md:pb-8 relative">
          {children}
        </main>
      </div>

      <MobileBottomNav variant="student" />
    </div>
  );
}
