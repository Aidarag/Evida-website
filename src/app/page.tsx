'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';
import { Event } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();

  const handleExplore = () => router.push('/student/dashboard');
  const handleCreate = () => router.push('/student/create');
  const handleLogin = () => router.push('/login');

  // Placeholder for featured events; replace with real data as needed
  const featuredEvents: Event[] = [];

  return (
    <LandingPage
      featuredEvents={featuredEvents}
      onExplore={handleExplore}
      onCreateEvent={handleCreate}
      onLogin={handleLogin}
    />
  );
}
