'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';
import { Event } from '@/lib/types';

export default function HomePage() {
  const handleWaitlist = () => {
    const element = document.getElementById('get-started');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Placeholder for featured events; replace with real data as needed
  const featuredEvents: Event[] = [];

  return (
    <LandingPage
      featuredEvents={featuredEvents}
      onExplore={handleWaitlist}
      onCreateEvent={handleWaitlist}
      onLogin={handleWaitlist}
    />
  );
}
