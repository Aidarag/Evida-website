'use client';

import React from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useEvents } from '@/lib/context/EventContext';
import EventCard from '@/components/student/EventCard';
import { useRouter } from 'next/navigation';
import { Calendar, Bell, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function StudentDashboardPage() {
  const { currentUser } = useUser();
  const { events, notifications } = useEvents();
  const router = useRouter();

  if (!currentUser) return null;

  // Filter events
  const approvedEvents = events.filter(e => e.status === 'approved');
  const upcomingEvents = approvedEvents.slice(0, 3); // mock upcoming
  const myRsvps = approvedEvents.filter(e => e.attendees.includes(currentUser.name));
  
  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome back, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-[#4F5666]">Here is what is happening on campus today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/student/events">
            <Button variant="secondary" icon={<Calendar className="h-4 w-4" />}>
              Find Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between h-32" hover={true}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4F5666] uppercase tracking-wider">Upcoming RSVPs</span>
            <Calendar className="h-5 w-5 text-[#FF5A1F]" />
          </div>
          <div className="text-3xl font-bold text-[#121212]">{myRsvps.length}</div>
        </Card>
        
        <Card className="p-5 flex flex-col justify-between h-32" hover={true}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4F5666] uppercase tracking-wider">Unread Alerts</span>
            <Bell className="h-5 w-5 text-[#8257FF]" />
          </div>
          <div className="text-3xl font-bold text-[#121212]">{unreadNotifs.length}</div>
        </Card>
        
        <Card className="p-5 flex flex-col justify-between h-32 md:col-span-2" hover={false}>
           <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4F5666] uppercase tracking-wider">Campus Activity</span>
            <Activity className="h-5 w-5 text-[#FF5A1F]" />
          </div>
          <div className="flex items-end gap-2">
             <div className="text-3xl font-bold text-[#121212]">{events.length}</div>
             <span className="text-sm text-[#4F5666] mb-1">active events across {currentUser.school}</span>
          </div>
        </Card>
      </div>

      {/* Recommended Events */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#121212]" style={{ fontFamily: 'var(--font-display)' }}>Recommended for you</h2>
          <Link href="/student/events" className="text-sm text-[#FF5A1F] hover:text-[#e04b12] flex items-center gap-1 transition-colors font-semibold">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <EventCard 
              key={event.id}
              event={event}
              onClick={() => router.push(`/events/${event.id}`)}
              isSaved={event.savedBy?.includes(currentUser.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
