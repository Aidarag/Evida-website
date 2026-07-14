import React from 'react';
import { DesktopNav, DesktopSidebar, MobileBottomNav } from '@/components/Navbar';
import EvidaLogo from '@/components/ui/EvidaLogo';

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#D8D2BC] text-[#2A2621] flex flex-col md:flex-row">
      {/* Mobile Top Nav (visible only on small screens) */}
      <div className="md:hidden sticky top-0 z-40 w-full h-14 border-b border-black/[0.04] bg-[#D8D2BC]/90 backdrop-blur-xl flex items-center justify-center">
        <span className="text-lg font-bold tracking-tight text-[#2A2621] flex items-center gap-2">
          <EvidaLogo size={22} showText={true} lightMode={true} />
          <span className="text-[10px] bg-[#FD5C05] text-[#2A2621] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
        </span>
      </div>

      <DesktopSidebar variant="school" />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DesktopNav variant="school" />
        
        <main className="flex-1 pb-32 md:pb-8 relative">
          {children}
        </main>
      </div>

      <MobileBottomNav variant="school" />
    </div>
  );
}
