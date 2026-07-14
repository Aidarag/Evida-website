'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, Organization } from '@/lib/types';
import { Building, Sparkles, UserCheck, Shield } from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface StudentProfileProps {
  currentUser: User;
  organizations: Organization[];
  totalRsvps: number;
  totalCreated: number;
  totalSaved: number;
}

export default function StudentProfile({
  currentUser,
  organizations,
  totalRsvps,
  totalCreated,
  totalSaved,
}: StudentProfileProps) {
  const router = useRouter();

  // Find organizations user belongs to
  const userOrgs = organizations.filter((org) =>
    currentUser.organizations.includes(org.id)
  );

  return (
    <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
      
      {/* Profile Card */}
      <div className="md:col-span-1 rounded-[28px] border border-[#D8D2BC]/30 bg-white p-6 flex flex-col items-center text-center relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-[#FD5C05]/10 blur-xl"></div>
        
        {/* Avatar */}
        <div className="h-20 w-20 rounded-3xl bg-[#FD5C05] text-[#2A2621] font-bold text-3xl flex items-center justify-center shadow-md shadow-[#FD5C05]/20 border border-[#D8D2BC]/40">
          {currentUser.avatar}
        </div>

        <h3 className="text-base font-extrabold text-[#2A2621] mt-4 uppercase">{currentUser.name}</h3>
        <span className="rounded-full bg-[#FD5C05]/25 border border-[#FD5C05]/35 px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#2A2621] mt-1.5 shadow-sm">
          {currentUser.role === 'student_leader' ? 'Student Leader' : 'Student Member'}
        </span>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 w-full pt-6 mt-6 border-t border-[#D8D2BC]/30 text-center">
          <div>
            <p className="text-sm font-bold text-[#2A2621]">{totalRsvps}</p>
            <p className="text-[9px] font-bold text-[#5A554E] uppercase tracking-wide">RSVPs</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#2A2621]">{totalCreated}</p>
            <p className="text-[9px] font-bold text-[#5A554E] uppercase tracking-wide">Posts</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#2A2621]">{totalSaved}</p>
            <p className="text-[9px] font-bold text-[#5A554E] uppercase tracking-wide">Saves</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Bio Data info */}
        <div className="rounded-[28px] border border-[#D8D2BC]/30 bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[9px] font-bold uppercase text-[#5A554E]">Education Details</span>
          
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wide">University School</p>
              <p className="font-extrabold text-[#2A2621] mt-1 uppercase">{currentUser.school || 'General Science Division'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wide">Major / Academic Study</p>
              <p className="font-extrabold text-[#2A2621] mt-1 uppercase">{currentUser.major}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#5A554E] uppercase tracking-wide">Class Graduation Year</p>
              <p className="font-extrabold text-[#2A2621] mt-1">{currentUser.gradYear}</p>
            </div>
          </div>
        </div>

        {/* Organization memberships */}
        <div className="rounded-[28px] border border-[#D8D2BC]/30 bg-white p-6 space-y-4 shadow-sm">
          <span className="text-[9px] font-bold uppercase text-[#5A554E]">Verified Group Memberships</span>

          <div className="space-y-2.5">
            {userOrgs.length === 0 ? (
              <p className="text-xs text-[#5A554E] italic">Not registered as a member of any campus group.</p>
            ) : (
              userOrgs.map((org) => (
                <div
                  key={org.id}
                  onClick={() => router.push(`/student/organizations/${org.id}`)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-black/[0.04] cursor-pointer hover:border-[#FD5C05] transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#FD5C05] border border-black/10 shadow-sm animate-pulse" />
                    <span className="text-xs font-bold text-[#2A2621] uppercase group-hover:underline">{org.name}</span>
                  </div>
                  {org.verified && (
                    <span className="flex items-center gap-0.5 text-emerald-600 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                      <VerifiedBadge className="h-3 w-3 mr-0.5" /> Verified Member
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
