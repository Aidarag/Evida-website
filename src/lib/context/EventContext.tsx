'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Event, Organization, Notification } from '@/lib/types';
import { useUser } from './UserContext';
import { usePathname, useRouter } from 'next/navigation';

interface EventContextType {
  events: Event[];
  organizations: Organization[];
  notifications: Notification[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  // Mutations
  saveToggle: (eventId: string) => Promise<void>;
  rsvpToggle: (eventId: string, action: 'rsvp' | 'interested') => Promise<void>;
  createEvent: (payload: unknown) => Promise<boolean>;
  updateEvent: (id: string, payload: unknown) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  reviewEvent: (id: string, status: 'approved' | 'rejected', feedback?: string) => Promise<void>;
  toggleVerifyOrg: (id: string) => Promise<void>;
  createOrg: (orgData: unknown) => Promise<unknown>;
  markNotificationRead: (id: string) => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
  resetDatabase: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const { currentUser, setCurrentUser } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Handle route change notifications inside the preview iframe
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('preview') === 'true') {
        document.body.classList.add('preview-mode');
        window.parent.postMessage({ type: 'EVIDA_PREVIEW_ROUTE', pathname }, '*');
      }
    }
  }, [pathname]);

  // Handle EVIDA_TOUR_GOTO navigation commands from the parent landing page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('preview') !== 'true') return;

      const handleMessage = (event: MessageEvent) => {
        const { type, step } = event.data;
        if (type !== 'EVIDA_TOUR_GOTO') return;

        const approved = events.filter(e => e.status === 'approved');
        const firstEvent = approved[0];

        if (step === 0) {
          // Home Feed — navigate to dashboard, scroll to top
          if (pathname !== '/student/dashboard') {
            router.push('/student/dashboard?preview=true');
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else if (step === 1) {
          // Select Event — stay on dashboard, scroll down to show event cards
          if (pathname !== '/student/dashboard') {
            router.push('/student/dashboard?preview=true');
            // Scroll will happen after navigation via the route effect
          } else {
            const target = document.querySelector('[data-tour="event-card"]') as HTMLElement;
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              window.scrollTo({ top: 250, behavior: 'smooth' });
            }
          }
        } else if (step === 2) {
          // Event Details — navigate to first approved event
          if (firstEvent) {
            router.push(`/events/${firstEvent.id}?preview=true`);
          }
        } else if (step === 3) {
          // Event Confirmation — scroll to RSVP / confirmation section
          if (pathname.startsWith('/events/')) {
            const target = document.querySelector('[data-tour="rsvp-section"]') as HTMLElement;
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
            }
          } else if (firstEvent) {
            router.push(`/events/${firstEvent.id}?preview=true`);
          }
        }

        // Notify parent of current path after navigation
        setTimeout(() => {
          window.parent.postMessage({ type: 'EVIDA_PREVIEW_ROUTE', pathname: window.location.pathname }, '*');
        }, 300);
      };

      window.addEventListener('message', handleMessage);
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [pathname, events, router]);
  const fetchData = useCallback(async () => {
    try {
      const [eventsRes, orgsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/organizations'),
      ]);
      const [eventsData, orgsData] = await Promise.all([eventsRes.json(), orgsRes.json()]);
      setEvents(eventsData || []);
      setOrganizations(orgsData || []);

      if (currentUser) {
        const notifRes = await fetch(`/api/notifications?username=${currentUser.username}`);
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifications(notifData || []);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveToggle = useCallback(async (eventId: string) => {
    if (!currentUser) return;

    // 1. Optimistic Update
    setEvents(prevEvents =>
      prevEvents.map(evt => {
        if (evt.id === eventId) {
          const savedBy = evt.savedBy || [];
          const idx = savedBy.indexOf(currentUser.name);
          const newSavedBy = idx > -1
            ? savedBy.filter(name => name !== currentUser.name)
            : [...savedBy, currentUser.name];
          return { ...evt, savedBy: newSavedBy };
        }
        return evt;
      })
    );

    try {
      const res = await fetch('/api/events/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name: currentUser.name }),
      });
      if (res.ok) {
        const data = await res.json();
        // Sync with official backend response event state
        setEvents(prevEvents =>
          prevEvents.map(evt => (evt.id === eventId ? data.event : evt))
        );
      } else {
        // Rollback
        await fetchData();
      }
    } catch (e) {
      console.error(e);
      // Rollback
      await fetchData();
    }
  }, [currentUser, fetchData]);

  const rsvpToggle = useCallback(async (eventId: string, action: 'rsvp' | 'interested') => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentUser.name, action }),
      });
      if (res.ok) await fetchData();
    } catch (e) {
      console.error(e);
    }
  }, [currentUser, fetchData]);

  const createEvent = useCallback(async (payload: unknown): Promise<boolean> => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [fetchData]);

  const updateEvent = useCallback(async (id: string, payload: unknown): Promise<boolean> => {
    // Optimistic update
    setEvents(prev => prev.map(evt =>
      evt.id === id ? { ...evt, ...(payload as object) } : evt
    ));
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setEvents(prev => prev.map(evt => evt.id === id ? updated : evt));
        return true;
      }
      await fetchData(); // rollback
      return false;
    } catch (e) {
      console.error(e);
      await fetchData();
      return false;
    }
  }, [fetchData]);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    // Optimistic removal
    setEvents(prev => prev.filter(evt => evt.id !== id));
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizerName: currentUser?.name }),
      });
      if (res.ok) return true;
      await fetchData(); // rollback
      return false;
    } catch (e) {
      console.error(e);
      await fetchData();
      return false;
    }
  }, [currentUser, fetchData]);

  const reviewEvent = useCallback(async (id: string, status: 'approved' | 'rejected', feedback?: string) => {
    try {
      const res = await fetch(`/api/events/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedback }),
      });
      if (res.ok) await fetchData();
    } catch (e) {
      console.error(e);
    }
  }, [fetchData]);

  const toggleVerifyOrg = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-verify', id }),
      });
      if (res.ok) await fetchData();
    } catch (e) {
      console.error(e);
    }
  }, [fetchData]);

  const createOrg = useCallback(async (orgData: unknown) => {
    if (!currentUser) return null;
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(orgData as any), member: currentUser.name }),
      });
      if (res.ok) {
        const newOrg = await res.json();
        
        // Update currentUser's local organizations list in context
        const updatedUser = {
          ...currentUser,
          organizations: [...(currentUser.organizations || []), newOrg.id]
        };
        setCurrentUser(updatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('evida-user', JSON.stringify(updatedUser));
        }

        await fetchData();
        return newOrg;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [currentUser, setCurrentUser, fetchData]);

  const markNotificationRead = useCallback(async (id: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-read', username: currentUser.username, id }),
      });
      if (res.ok) {
        const list = await res.json();
        setNotifications(list);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const clearNotification = useCallback(async (id: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear', username: currentUser.username, id }),
      });
      if (res.ok) {
        const list = await res.json();
        setNotifications(list);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const resetDatabase = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      if (res.ok) await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  return (
    <EventContext.Provider
      value={{
        events,
        organizations,
        notifications,
        isLoading,
        refetch: fetchData,
        saveToggle,
        rsvpToggle,
        createEvent,
        updateEvent,
        deleteEvent,
        reviewEvent,
        toggleVerifyOrg,
        createOrg,
        markNotificationRead,
        clearNotification,
        resetDatabase,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within EventProvider');
  return context;
}
