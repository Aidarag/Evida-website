'use client';

import React, { useState, useEffect } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/student/EventCard';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Search, Compass, Shield, Users, GraduationCap, Megaphone, Calendar, MapPin, Mail, X, Heart, Plus, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event, Promotion } from '@/lib/types';

import VerifiedBadge from '@/components/ui/VerifiedBadge';

type OwnershipFilter = 'school' | 'organization' | 'student' | 'promotion';

export default function StudentEventsFeed() {
  const { events, organizations, saveToggle } = useEvents();
  const { currentUser } = useUser();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwnership, setSelectedOwnership] = useState<OwnershipFilter>('school');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [feedMode, setFeedMode] = useState<'grid' | 'tiktok'>('tiktok');
  const [isMobile, setIsMobile] = useState(false);
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);

  // TikTok feed states
  const [tiktokTab, setTiktokTab] = useState<'foryou' | 'school' | 'organization'>('foryou');
  const [searchOpen, setSearchOpen] = useState(false);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, { user: string; text: string; time: string }[]>>({});
  const [followedOrganizers, setFollowedOrganizers] = useState<Record<string, boolean>>({});
  const [commentsOpenItem, setCommentsOpenItem] = useState<(Event | Promotion) | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<'details' | 'comments'>('details');

  const getMockComments = (id: string, title: string) => {
    const commentsPool = [
      "Can't wait for this! Count me in!",
      "Is this open to non-majors?",
      "Finally, an event like this on campus!",
      "Who wants to go together? Let's make a group chat.",
      "Last year was super fun, definitely going again.",
      "Highly recommended! 🔥",
      "Is RSVP required or can we just show up?",
      "Will there be free food?",
      "So excited for this!"
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = (hash % 3) + 2; // 2 to 4 comments
    const selected: { user: string; text: string; time: string }[] = [];
    const names = ["Alex Smith", "Emma Watson", "John Doe", "Sophia Lee", "Michael Chen", "Olivia Taylor"];
    for (let i = 0; i < count; i++) {
      const nameIndex = (hash + i) % names.length;
      const commentIndex = (hash * (i + 1)) % commentsPool.length;
      selected.push({
        user: names[nameIndex],
        text: commentsPool[commentIndex],
        time: `${(hash + i) % 12 + 1}h ago`
      });
    }
    return selected;
  };

  useEffect(() => {
    if (events.length === 0 && promotions.length === 0) return;

    const storedLikes = localStorage.getItem('evida_feed_likes');
    const storedLikedItems = localStorage.getItem('evida_feed_liked_items');
    const storedComments = localStorage.getItem('evida_feed_comments');
    const storedFollowed = localStorage.getItem('evida_feed_followed');

    let parsedLikes = storedLikes ? JSON.parse(storedLikes) : {};
    let parsedLikedItems = storedLikedItems ? JSON.parse(storedLikedItems) : {};
    let parsedComments = storedComments ? JSON.parse(storedComments) : {};
    let parsedFollowed = storedFollowed ? JSON.parse(storedFollowed) : {};

    events.forEach(e => {
      if (parsedLikes[e.id] === undefined) {
        parsedLikes[e.id] = Math.max(3, Math.floor(e.views * 0.3) + (e.title.length % 7));
      }
      if (parsedComments[e.id] === undefined) {
        parsedComments[e.id] = getMockComments(e.id, e.title);
      }
    });

    promotions.forEach(p => {
      if (parsedLikes[p.id] === undefined) {
        parsedLikes[p.id] = Math.max(5, (p.title.length * 2) % 35 + 4);
      }
      if (parsedComments[p.id] === undefined) {
        parsedComments[p.id] = getMockComments(p.id, p.title);
      }
    });

    setLikesCounts(parsedLikes);
    setLikedItems(parsedLikedItems);
    setCommentsMap(parsedComments);
    setFollowedOrganizers(parsedFollowed);
  }, [events, promotions]);

  const handleLikeToggle = (itemId: string) => {
    const isLiked = !likedItems[itemId];
    const newLikedItems = { ...likedItems, [itemId]: isLiked };
    const newLikesCounts = {
      ...likesCounts,
      [itemId]: (likesCounts[itemId] || 0) + (isLiked ? 1 : -1)
    };

    setLikedItems(newLikedItems);
    setLikesCounts(newLikesCounts);

    localStorage.setItem('evida_feed_liked_items', JSON.stringify(newLikedItems));
    localStorage.setItem('evida_feed_likes', JSON.stringify(newLikesCounts));
  };

  const handleFollowToggle = (organizer: string) => {
    const isFollowed = !followedOrganizers[organizer];
    const newFollowed = { ...followedOrganizers, [organizer]: isFollowed };
    setFollowedOrganizers(newFollowed);
    localStorage.setItem('evida_feed_followed', JSON.stringify(newFollowed));
  };

  const handleAddComment = (itemId: string) => {
    if (!newCommentText.trim() || !currentUser) return;
    const userComments = commentsMap[itemId] || [];
    const newComment = {
      user: currentUser.name,
      text: newCommentText.trim(),
      time: 'Just now'
    };
    const newComments = { ...commentsMap, [itemId]: [newComment, ...userComments] };
    setCommentsMap(newComments);
    setNewCommentText('');
    localStorage.setItem('evida_feed_comments', JSON.stringify(newComments));
  };

  const handleShare = (item: Event | Promotion) => {
    const isEvent = 'ownershipType' in item;
    const link = isEvent 
      ? `${window.location.origin}/events/${item.id}`
      : `mailto:${item.contactInfo}?subject=Check out this promotion: ${item.title}`;
    
    if (isEvent) {
      navigator.clipboard.writeText(link);
      setCopiedItemId(item.id);
      setTimeout(() => setCopiedItemId(null), 2000);
    } else {
      window.location.href = link;
    }
  };

  // Compute combined/filtered items for the TikTok feed tab
  const tiktokFeedItems = (() => {
    let items: (Event | Promotion)[] = [];
    if (tiktokTab === 'foryou') {
      // Combined approved student events and promotions
      const studentEvents = events.filter(e => e.status === 'approved' && e.ownershipType === 'student');
      const approvedPromos = promotions;
      items = [...studentEvents, ...approvedPromos];
    } else if (tiktokTab === 'school') {
      items = events.filter(e => e.status === 'approved' && e.ownershipType === 'school');
    } else if (tiktokTab === 'organization') {
      items = events.filter(e => e.status === 'approved' && e.ownershipType === 'organization');
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => {
        const title = item.title.toLowerCase();
        const desc = item.description.toLowerCase();
        const org = 'ownershipType' in item 
          ? (item.organizationName || item.organizer || '').toLowerCase() 
          : item.organizer.toLowerCase();
        const loc = 'ownershipType' in item ? (item.location || '').toLowerCase() : '';
        return title.includes(q) || desc.includes(q) || org.includes(q) || loc.includes(q);
      });
    }

    return [...items].sort((a, b) => {
      const aFeat = ('ownershipType' in a) && (a.featured || a.isFeatured) ? 1 : 0;
      const bFeat = ('ownershipType' in b) && (b.featured || b.isFeatured) ? 1 : 0;
      if (aFeat !== bFeat) return bFeat - aFeat;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  })();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch('/api/promotions');
        if (res.ok) {
          const data = await res.json();
          // Only show approved promotions
          setPromotions(data.filter((p: Promotion) => p.status === 'approved') || []);
        }
      } catch (e) {
        console.error('Failed to fetch promotions', e);
      }
    };
    fetchPromotions();
  }, []);

  const ownershipFilters: { id: OwnershipFilter; label: string; icon: React.ComponentType<any>; color: string }[] = [
    { id: 'school', label: 'Official School Events', icon: Shield, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
    { id: 'organization', label: 'Organization Events', icon: Users, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
    { id: 'student', label: 'Student Events', icon: GraduationCap, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'promotion', label: 'Promotions', icon: Megaphone, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  ];

  const categories = ['All', 'Academic', 'Career', 'Sports', 'Social', 'Culture', 'Arts', 'Volunteer', 'Networking'];

  // Prioritize Featured Event
  const getFeaturedEvent = () => {
    const approvedEvents = events.filter(e => e.status === 'approved');
    
    // 1. Official School Featured
    const schoolFeatured = approvedEvents.find(e => e.isFeatured && e.ownershipType === 'school');
    if (schoolFeatured) return schoolFeatured;
    
    // 2. Organization Featured
    const orgFeatured = approvedEvents.find(e => e.isFeatured && e.ownershipType === 'organization');
    if (orgFeatured) return orgFeatured;
    
    // 3. Student Featured
    const studentFeatured = approvedEvents.find(e => e.isFeatured && e.ownershipType === 'student');
    if (studentFeatured) return studentFeatured;

    // Fallback to first available approved event based on ownership priority
    const schoolFallback = approvedEvents.find(e => e.ownershipType === 'school');
    if (schoolFallback) return schoolFallback;

    const orgFallback = approvedEvents.find(e => e.ownershipType === 'organization');
    if (orgFallback) return orgFallback;

    const studentFallback = approvedEvents.find(e => e.ownershipType === 'student');
    if (studentFallback) return studentFallback;

    return null;
  };

  const featuredEvent = getFeaturedEvent();

  // Category matching helper
  const matchesCategory = (item: Event | Promotion) => {
    if (selectedCategory === 'All') return true;

    const itemCat = item.category?.toLowerCase() || '';
    const selCat = selectedCategory.toLowerCase();

    // Map promotions to main categories
    if (!('ownershipType' in item)) {
      if (selCat === 'academic' && itemCat === 'tutoring') return true;
      if (selCat === 'arts' && itemCat === 'photography') return true;
      if (selCat === 'social' && (itemCat === 'food' || itemCat === 'initiative')) return true;
      if (selCat === 'volunteer' && itemCat === 'initiative') return true;
      if (selCat === 'career' && itemCat === 'tutoring') return true;
      return false;
    }

    // Direct event category match or sub-matches
    if (itemCat === selCat) return true;
    if (selCat === 'academic' && itemCat.includes('acad')) return true;
    if (selCat === 'career' && (itemCat.includes('career') || itemCat.includes('work'))) return true;
    if (selCat === 'social' && (itemCat.includes('social') || itemCat.includes('party') || itemCat.includes('homecoming') || itemCat.includes('greek'))) return true;
    if (selCat === 'culture' && itemCat.includes('cult')) return true;
    if (selCat === 'arts' && itemCat.includes('art')) return true;

    return false;
  };

  // Filtered items based on active selections
  const filteredItems: (Event | Promotion)[] = (() => {
    if (selectedOwnership === 'promotion') {
      return promotions.filter((promo) => {
        const matchesSearch = 
          promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          promo.organizer.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch && matchesCategory(promo);
      });
    } else {
      return events.filter((e) => {
        if (e.status !== 'approved') return false;
        if (e.ownershipType !== selectedOwnership) return false;

        const matchesSearch = 
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.organizationName || '').toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch && matchesCategory(e);
      });
    }
  })();

  const sortedFilteredItems = [...filteredItems].sort((a, b) => {
    // 1. Featured pins at top
    const aFeat = ('ownershipType' in a) && (a.featured || a.isFeatured) ? 1 : 0;
    const bFeat = ('ownershipType' in b) && (b.featured || b.isFeatured) ? 1 : 0;
    if (aFeat > bFeat) return -1;
    if (aFeat < bFeat) return 1;

    // 2. Default by date
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const matchedOrgs = searchQuery.trim() !== '' 
    ? organizations.filter(org => org.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleCardClick = (item: Event | Promotion) => {
    if ('ownershipType' in item) {
      router.push(`/events/${item.id}`);
    } else {
      setSelectedPromo(item as Promotion);
    }
  };

  const handleWebFeedScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const index = Math.round(target.scrollTop / target.clientHeight);
    if (index >= 0 && index < sortedFilteredItems.length && index !== activeFeedIndex) {
      setActiveFeedIndex(index);
    }
  };

  return (
    <div className={`space-y-8 max-w-7xl mx-auto ${feedMode === 'tiktok' && isMobile ? 'p-0 overflow-hidden' : 'p-6 md:p-10'}`}>
      {/* Search & Filter Header */}
      {!(feedMode === 'tiktok' && isMobile) && (
        <div className="space-y-4 py-4 -mx-6 px-6 md:mx-0 md:px-0 border-b border-black/[0.04]">
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-[#191919] tracking-tight flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                Explore
              </h1>
              <p className="text-sm text-[#4F5666] mt-1">Discover what's happening around campus</p>
            </div>
            
            {/* View Mode Toggle - Immediately below the short description */}
            <div className="flex bg-black/[0.04] p-1 rounded-full border border-black/[0.04] shrink-0 w-fit">
              <button
                type="button"
                onClick={() => setFeedMode('tiktok')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  feedMode === 'tiktok' 
                    ? 'bg-[#191919] text-white shadow-sm' 
                    : 'text-[#4F5666] hover:text-[#191919]'
                }`}
              >
                Feed
              </button>
              <button
                type="button"
                onClick={() => setFeedMode('grid')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  feedMode === 'grid' 
                    ? 'bg-[#191919] text-white shadow-sm' 
                    : 'text-[#4F5666] hover:text-[#191919]'
                }`}
              >
                Grid
              </button>
            </div>
          </div>

          {/* Conditional Filters: Only visible in Grid Mode */}
          {feedMode === 'grid' && (
            <div className="space-y-4 pt-2">
              <div className="w-full md:w-96">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search events, organizers, or keywords..."
                    className="pl-12 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Matched Organizations */}
              {matchedOrgs.length > 0 && (
                <div className="space-y-2 mt-2 max-w-md">
                  <span className="text-[9px] font-bold text-[#4F5666] uppercase tracking-[0.2em] block pl-1">// MATCHED ORGANIZATIONS</span>
                  {matchedOrgs.map(org => (
                    <div 
                      key={org.id} 
                      onClick={() => router.push(`/student/organizations/${org.id}`)}
                      className="bg-white rounded-2xl p-3 flex items-center justify-between border border-black/[0.04] shadow-sm hover:border-[#BDFB04] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-[#BDFB04]/10 border border-[#BDFB04]/20 flex items-center justify-center text-[#191919] font-extrabold uppercase text-xs shadow-sm">
                          {org.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-[#191919] uppercase tracking-tight flex items-center group-hover:text-[#BDFB04] transition-colors">
                            {org.name}
                            {org.verified && <VerifiedBadge className="h-3 w-3 ml-1" />}
                          </h4>
                          <p className="text-[9px] text-[#4F5666]">{org.members.length} members • Campus Group</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-[#7B8290] group-hover:text-[#191919] transition-colors uppercase">View →</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Row 1: Organizer Filters */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-[#4F5666] uppercase tracking-[0.2em] block pl-1">// Organizer</span>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                  {ownershipFilters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = selectedOwnership === filter.id;
                    return (
                      <motion.button
                        key={filter.id}
                        onClick={() => {
                          setSelectedOwnership(filter.id);
                          setSelectedCategory('All');
                        }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`relative shrink-0 flex items-center justify-center gap-2 px-4 py-2 h-9.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border cursor-pointer select-none transition-all duration-200 ${
                          isActive
                            ? 'border-[#BDFB04] text-[#191919] shadow-md shadow-[#BDFB04]/10'
                            : 'border-black/[0.06] bg-black/[0.01] text-[#4F5666] hover:border-black/15'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeOrganizerBg"
                            className="absolute inset-0 bg-[#BDFB04] rounded-full z-0"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 relative z-10 ${isActive ? 'text-[#191919]' : 'text-[#4F5666]'}`} />
                          <span className="relative z-10">{filter.label}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Category Filters */}
              <div className="space-y-3 pt-1">
                <span className="text-[9px] font-bold text-[#4F5666] uppercase tracking-[0.2em] block pl-1">// Category</span>
                <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <motion.button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        whileHover={{ y: -1.5, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`relative shrink-0 px-5.5 py-2.5 h-9.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer select-none transition-colors duration-200 ${
                          isActive
                            ? 'text-[#191919]'
                            : 'bg-black/[0.02] border border-black/[0.06] text-[#4F5666] hover:bg-black/[0.04] hover:text-[#191919]'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeCategoryBg"
                            className="absolute inset-0 bg-[#BDFB04] rounded-full z-0"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{cat}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Featured Hero (Only show in Grid mode if no search/filter applied and featured exists) */}
      {feedMode === 'grid' && featuredEvent && searchQuery === '' && selectedCategory === 'All' && selectedOwnership === 'school' && (
        <div 
          onClick={() => router.push(`/events/${featuredEvent.id}`)}
          className="relative rounded-[32px] overflow-hidden aspect-[16/9] md:aspect-[21/9] cursor-pointer group border border-black/[0.04] shadow-md"
        >
          <div 
            className="absolute inset-0 opacity-45 group-hover:opacity-55 transition-opacity duration-500"
            style={featuredEvent.coverImage.startsWith('/') 
              ? { backgroundImage: `url(${featuredEvent.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: `linear-gradient(to top right, var(--tw-gradient-stops))` }
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10" />
          
          <div className="absolute inset-x-8 bottom-8 z-20 flex flex-col items-start gap-3">
            <span className="rounded-full bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              Featured Official Event
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight line-clamp-3" style={{ fontFamily: 'var(--font-display)' }}>
              {featuredEvent.title}
            </h2>
            <div className="flex items-center gap-4 text-sm font-medium text-white/80">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-white" />
                {new Date(featuredEvent.date).toLocaleDateString()}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-white" />
                {featuredEvent.location}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid or TikTok Feed */}
      {feedMode === 'tiktok' ? (
        tiktokFeedItems.length > 0 ? (
          isMobile ? (
            /* MOBILE SCREEN-FILLING TIKTOK SWIPE FEED */
            <div className="fixed inset-0 z-[60] bg-[#151515] flex flex-col w-screen h-screen overflow-hidden font-sans">
              
              {/* Floating Header Mode Toggle & Tabs for Mobile TikTok Feed */}
              <div className="absolute top-6 inset-x-0 z-50 flex items-center justify-between px-6">
                {/* Switch back to Grid view */}
                <button
                  type="button"
                  onClick={() => setFeedMode('grid')}
                  className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer shadow-lg pointer-events-auto"
                  title="Grid View"
                >
                  <Compass className="h-5 w-5" />
                </button>

                {/* TikTok Tabs */}
                <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 shrink-0 shadow-lg pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => setTiktokTab('school')}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      tiktokTab === 'school' ? 'bg-[#BDFB04] text-[#191919] font-black' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    School
                  </button>
                  <button
                    type="button"
                    onClick={() => setTiktokTab('organization')}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      tiktokTab === 'organization' ? 'bg-[#BDFB04] text-[#191919] font-black' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Orgs
                  </button>
                  <button
                    type="button"
                    onClick={() => setTiktokTab('foryou')}
                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      tiktokTab === 'foryou' ? 'bg-[#BDFB04] text-[#191919] font-black' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    For You
                  </button>
                </div>

                {/* Search icon */}
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer shadow-lg pointer-events-auto"
                  title="Search Feed"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>

              {/* Sliding Search Overlay for Mobile TikTok Feed */}
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-x-0 top-0 z-[70] bg-[#151515]/95 backdrop-blur-lg border-b border-white/10 p-6 pt-16 flex flex-col gap-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#BDFB04]" />
                        <input
                          type="text"
                          placeholder="Search events, promotions..."
                          className="w-full bg-white/10 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#BDFB04] placeholder-white/40"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSearchOpen(false);
                        }}
                        className="text-white text-xs font-bold hover:text-[#BDFB04]"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Swipe Container */}
              <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none flex flex-col items-center">
                {tiktokFeedItems.map((item) => {
                  const isSaved = 'ownershipType' in item ? item.savedBy?.includes(currentUser?.name || '') : false;
                  const cover = 'ownershipType' in item ? item.coverImage : '/pexels-markus-winkler-1430818-12199407.jpg';
                  const isGradient = cover ? cover.includes('from-') : false;
                  const bgClass = isGradient ? cover : '';
                  const bgStyle = (!isGradient && cover) ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
                  
                  const orgName = 'ownershipType' in item ? (item.organizationName || item.organizer) : item.organizer;
                  const isFollowed = followedOrganizers[orgName] || false;
                  
                  const isLiked = likedItems[item.id] || false;
                  const likesCount = likesCounts[item.id] || 0;
                  const commentsCount = (commentsMap[item.id] || []).length;
                  const savesCount = 'ownershipType' in item ? (item.savedBy?.length || 0) : 0;
                  const isCopied = copiedItemId === item.id;

                  return (
                    <div 
                      key={`mobile-feed-${item.id}`}
                      className="snap-start shrink-0 h-[100svh] w-full relative overflow-hidden flex flex-col justify-between text-white bg-[#191919]"
                    >
                      <div 
                        className={`absolute inset-0 opacity-55 z-0 bg-cover bg-center ${bgClass}`}
                        style={bgStyle}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/55 z-10" />

                      {/* Top Segment */}
                      <div className="relative z-20 flex justify-between items-center px-5 pt-24">
                        <span className="px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wider bg-[#BDFB04] text-[#191919] rounded-full border border-[#BDFB04]/20 shadow-sm">
                          {'ownershipType' in item ? item.category : 'Promotion'}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#BDFB04]/80">
                          {'ownershipType' in item ? item.ownershipType : 'Services'}
                        </span>
                      </div>

                      {/* Bottom segment and Right-side Action Column */}
                      <div className="relative z-20 flex items-end gap-4 px-5 pb-28">
                        {/* Left: Info Details */}
                        <div className="flex-1 space-y-3.5 text-left min-w-0">
                          <div className="space-y-2">
                            <div className="text-[#BDFB04] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {item.date} {('time' in item) && `• ${(item as any).time}`}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white leading-tight truncate" style={{ fontFamily: 'var(--font-display)' }}>
                              {item.title}
                            </h2>
                            <p className="text-xs text-gray-300 leading-relaxed font-light line-clamp-3">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                            <MapPin className="h-4 w-4 text-[#BDFB04]" />
                            <span className="truncate">{('location' in item) ? (item as any).location : (item as any).organizer}</span>
                          </div>

                          {/* Dynamic Search Banner styled like TikTok bottom search overlay */}
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchOpen(true);
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/45 text-[10px] font-bold text-white/95 border border-white/5 cursor-pointer hover:bg-black/60 transition-colors w-fit pointer-events-auto"
                          >
                            <Search className="h-3 w-3 text-[#BDFB04]" />
                            <span>Search · {item.title.split(' ')[0]}</span>
                          </div>

                          <div>
                            <Button 
                              variant="neon" 
                              size="sm" 
                              fullWidth
                              onClick={() => handleCardClick(item)}
                              className="h-10 shadow-lg shadow-[#BDFB04]/20 font-extrabold tracking-widest uppercase text-[10px]"
                            >
                              {'ownershipType' in item ? 'RSVP & Info' : 'Contact / Info'}
                            </Button>
                          </div>
                        </div>

                        {/* Right: Vertical TikTok Interaction Bar */}
                        <div className="flex flex-col gap-4 items-center pb-2 shrink-0 z-30 pointer-events-auto">
                          {/* Follow/Profile Avatar */}
                          <div className="relative mb-1">
                            <div className="h-11 w-11 rounded-full border-2 border-[#BDFB04] bg-zinc-800 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                              {orgName.charAt(0).toUpperCase()}
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFollowToggle(orgName);
                              }}
                              className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full border border-black/20 flex items-center justify-center transition-all ${
                                isFollowed ? 'bg-[#BDFB04] text-[#191919] rotate-45 scale-90' : 'bg-red-500 text-white'
                              }`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Likes (Heart) */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeToggle(item.id);
                            }}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className="h-11 w-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white shadow-md">
                              <Heart className={`h-5 w-5 transition-transform ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'}`} />
                            </div>
                            <span className="text-[9px] font-bold text-gray-300">{likesCount}</span>
                          </button>

                          {/* Comments (Speech Bubble) */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCommentsOpenItem(item);
                            }}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className="h-11 w-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white shadow-md">
                              <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-[9px] font-bold text-gray-300">{commentsCount}</span>
                          </button>

                          {/* Saves (Bookmark Ribbon) */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if ('ownershipType' in item) {
                                saveToggle(item.id);
                              } else {
                                handleLikeToggle(`promo-save-${item.id}`);
                              }
                            }}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className="h-11 w-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white shadow-md">
                              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-[#BDFB04] text-[#BDFB04]' : 'text-white'}`} />
                            </div>
                            <span className="text-[9px] font-bold text-gray-300">{savesCount}</span>
                          </button>

                          {/* Share (Curved Arrow) */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(item);
                            }}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className="h-11 w-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white shadow-md">
                              {isCopied ? (
                                <svg className="h-5 w-5 text-[#BDFB04]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
                                </svg>
                              )}
                            </div>
                            <span className="text-[9px] font-bold text-gray-300">{isCopied ? 'Copied' : 'Share'}</span>
                          </button>

                          {/* Rotating vinyl record */}
                          <div 
                            className="mt-1 h-9.5 w-9.5 rounded-full bg-gradient-to-tr from-zinc-800 to-black border border-white/20 flex items-center justify-center shadow-lg"
                            style={{ animation: 'spin 8s linear infinite' }}
                          >
                            <div className="h-4 w-4 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#BDFB04]" />
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TABLET / LAPTOP TIKTOK WEB SPLIT PLAYER VIEW */
            <div className="relative max-w-5xl mx-auto w-full h-[calc(100vh-14rem)] rounded-[32px] overflow-hidden border border-black/10 bg-[#121212] shadow-[var(--shadow-premium-xl)] flex flex-row">
              
              {/* Left Column: Visual Snap Player */}
              <div className="relative w-[400px] h-full shrink-0 overflow-hidden bg-black border-r border-white/5 flex flex-col">
                
                {/* Floating Tabs & Search overlay within Left Player Column */}
                <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
                  {/* Left: Switch feed mode button */}
                  <button
                    onClick={() => setFeedMode('grid')}
                    className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all pointer-events-auto cursor-pointer"
                    title="Switch to Grid View"
                  >
                    <Compass className="h-4.5 w-4.5" />
                  </button>

                  {/* Tabs */}
                  <div className="flex bg-black/60 backdrop-blur-md p-0.5 rounded-full border border-white/10 pointer-events-auto shrink-0 shadow-lg">
                    <button
                      onClick={() => setTiktokTab('school')}
                      className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                        tiktokTab === 'school' ? 'bg-[#BDFB04] text-[#191919] font-black' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      School
                    </button>
                    <button
                      onClick={() => setTiktokTab('organization')}
                      className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                        tiktokTab === 'organization' ? 'bg-[#BDFB04] text-[#191919] font-black' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      Orgs
                    </button>
                    <button
                      onClick={() => setTiktokTab('foryou')}
                      className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                        tiktokTab === 'foryou' ? 'bg-[#BDFB04] text-[#191919] font-black' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      For You
                    </button>
                  </div>

                  {/* Right: Search button overlay */}
                  <button
                    onClick={() => setSearchOpen(prev => !prev)}
                    className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all pointer-events-auto cursor-pointer"
                    title="Search"
                  >
                    <Search className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Left Column search sliding overlay */}
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute inset-x-0 top-0 z-40 bg-black/90 backdrop-blur-md p-4 pt-16 border-b border-white/5"
                    >
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search feed..."
                          className="w-full bg-white/10 border border-white/15 text-white pl-9 pr-8 py-1.5 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#BDFB04] placeholder-white/40"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-[10px] font-bold"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sync Feed Container */}
                <div 
                  onScroll={handleWebFeedScroll}
                  className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
                >
                  {tiktokFeedItems.map((item, idx) => {
                    const cover = 'ownershipType' in item ? item.coverImage : '/pexels-markus-winkler-1430818-12199407.jpg';
                    const isGradient = cover ? cover.includes('from-') : false;
                    const bgClass = isGradient ? cover : '';
                    const bgStyle = (!isGradient && cover) ? { backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
                    
                    const orgName = 'ownershipType' in item ? (item.organizationName || item.organizer) : item.organizer;
                    const isFollowed = followedOrganizers[orgName] || false;
                    const isLiked = likedItems[item.id] || false;
                    const likesCount = likesCounts[item.id] || 0;
                    const commentsCount = (commentsMap[item.id] || []).length;
                    const isSaved = 'ownershipType' in item ? item.savedBy?.includes(currentUser?.name || '') : false;
                    const savesCount = 'ownershipType' in item ? (item.savedBy?.length || 0) : 0;
                    const isCopied = copiedItemId === item.id;

                    const isCurrent = idx === activeFeedIndex;

                    return (
                      <div 
                        key={`web-feed-left-${item.id}`} 
                        className="h-full w-full snap-start shrink-0 relative overflow-hidden flex flex-row items-end justify-between p-6 text-white"
                      >
                        <div 
                          className={`absolute inset-0 opacity-45 z-0 bg-cover bg-center transition-all ${isCurrent ? 'scale-100 opacity-55' : 'scale-95 opacity-25'}`}
                          style={bgStyle}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 z-10" />
                        
                        {/* Title details & dynamic search banner on player */}
                        <div className="relative z-20 flex-1 text-left space-y-2 mt-auto min-w-0">
                          <span className="px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider bg-[#BDFB04] text-[#191919] rounded-full border border-[#BDFB04]/20 shadow-sm w-fit block">
                            {'ownershipType' in item ? item.category : 'Promotion'}
                          </span>
                          <h3 className="text-lg font-black uppercase tracking-tight text-white line-clamp-2 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            {item.title}
                          </h3>
                          <span className="text-[8.5px] text-[#BDFB04] font-black uppercase tracking-widest flex items-center gap-1">
                            <span className="inline-block animate-bounce">//</span> Swipe / scroll to browse
                          </span>
                          {/* Search Banner Overlay on Card */}
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 text-[9px] font-extrabold text-white/95 border border-white/10 cursor-pointer hover:bg-black/80 transition-colors w-fit pointer-events-auto"
                          >
                            <Search className="h-2.5 w-2.5 text-[#BDFB04]" />
                            <span>Search · {item.title.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Floating Interaction Column on Player */}
                        <div className="relative z-20 flex flex-col gap-3.5 items-center shrink-0 ml-3 pointer-events-auto">
                          {/* Profile Avatar + Follow */}
                          <div className="relative mb-0.5">
                            <div className="h-9 w-9 rounded-full border border-[#BDFB04] bg-zinc-800 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                              {orgName.charAt(0).toUpperCase()}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFollowToggle(orgName);
                              }}
                              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border border-black/20 flex items-center justify-center transition-all ${
                                isFollowed ? 'bg-[#BDFB04] text-[#191919] rotate-45 scale-90' : 'bg-red-500 text-white'
                              }`}
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>

                          {/* Heart Likes */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeToggle(item.id);
                            }}
                            className="flex flex-col items-center cursor-pointer group"
                          >
                            <div className="h-9 w-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all text-white shadow">
                              <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-rose-500 text-rose-500 scale-105' : 'text-white'}`} />
                            </div>
                            <span className="text-[8px] font-bold text-gray-300 mt-0.5">{likesCount}</span>
                          </button>

                          {/* Comments */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveRightTab('comments');
                            }}
                            className="flex flex-col items-center cursor-pointer group"
                          >
                            <div className="h-9 w-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all text-white shadow">
                              <MessageSquare className="h-4.5 w-4.5 text-white" />
                            </div>
                            <span className="text-[8px] font-bold text-gray-300 mt-0.5">{commentsCount}</span>
                          </button>

                          {/* Saved */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if ('ownershipType' in item) {
                                saveToggle(item.id);
                              } else {
                                handleLikeToggle(`promo-save-${item.id}`);
                              }
                            }}
                            className="flex flex-col items-center cursor-pointer group"
                          >
                            <div className="h-9 w-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all text-white shadow">
                              <Bookmark className={`h-4.5 w-4.5 ${isSaved ? 'fill-[#BDFB04] text-[#BDFB04]' : 'text-white'}`} />
                            </div>
                            <span className="text-[8px] font-bold text-gray-300 mt-0.5">{savesCount}</span>
                          </button>

                          {/* Share */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(item);
                            }}
                            className="flex flex-col items-center cursor-pointer group"
                          >
                            <div className="h-9 w-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all text-white shadow">
                              {isCopied ? (
                                <svg className="h-4 w-4 text-[#BDFB04]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
                                </svg>
                              )}
                            </div>
                            <span className="text-[8px] font-bold text-gray-300 mt-0.5">{isCopied ? 'Copied' : 'Share'}</span>
                          </button>

                          {/* Music spinner */}
                          <div 
                            className="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-800 to-black border border-white/20 flex items-center justify-center shadow"
                            style={{ animation: 'spin 8s linear infinite' }}
                          >
                            <div className="h-3 w-3 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                              <div className="h-1 w-1 rounded-full bg-[#BDFB04]" />
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Synced Info & Comments Drawer Panel */}
              {(() => {
                const activeItem = tiktokFeedItems[activeFeedIndex];
                if (!activeItem) return null;
                const isSaved = 'ownershipType' in activeItem ? activeItem.savedBy?.includes(currentUser?.name || '') : false;
                const itemComments = commentsMap[activeItem.id] || [];

                return (
                  <div className="flex-1 h-full bg-[#18181b] p-8 flex flex-col justify-between text-white text-left overflow-hidden">
                    
                    {/* Header Tabs */}
                    <div className="flex items-center gap-6 border-b border-white/5 pb-4 mb-4">
                      <button
                        onClick={() => setActiveRightTab('details')}
                        className={`text-sm font-extrabold uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
                          activeRightTab === 'details' ? 'text-[#BDFB04] border-b border-[#BDFB04]' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setActiveRightTab('comments')}
                        className={`text-sm font-extrabold uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
                          activeRightTab === 'comments' ? 'text-[#BDFB04] border-b border-[#BDFB04]' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Comments ({itemComments.length})
                      </button>
                    </div>

                    {/* Tab contents */}
                    <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin">
                      {activeRightTab === 'details' ? (
                        <div className="space-y-6 animate-fadeIn">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-[#BDFB04] uppercase tracking-[0.2em] block">// Event Details</span>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                              {activeItem.title}
                            </h2>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl space-y-1">
                                <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-gray-400 block">Date & Time</span>
                                <span className="font-bold text-white flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-[#BDFB04]" /> {activeItem.date} {('time' in activeItem) && `• ${(activeItem as any).time}`}
                                </span>
                              </div>
                              <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl space-y-1">
                                <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-gray-400 block">Location</span>
                                <span className="font-bold text-white flex items-center gap-1.5 truncate">
                                  <MapPin className="h-3.5 w-3.5 text-[#BDFB04]" /> {('location' in activeItem) ? (activeItem as any).location : (activeItem as any).organizer}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-gray-400 block">Description</span>
                              <p className="text-xs text-gray-300 leading-relaxed font-light whitespace-pre-wrap">
                                {activeItem.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Comments List & Posting inside Synced Right Panel */
                        <div className="flex flex-col h-full justify-between animate-fadeIn">
                          <div className="flex-1 space-y-4 overflow-y-auto pr-1 pb-4 scrollbar-thin text-left">
                            {itemComments.length === 0 ? (
                              <div className="text-center py-12 text-xs text-gray-500 font-medium">
                                No comments yet. Share your thoughts below!
                              </div>
                            ) : (
                              itemComments.map((c, i) => (
                                <div key={i} className="flex gap-2.5 items-start animate-fadeIn">
                                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-[10px] uppercase text-[#BDFB04] shrink-0">
                                    {c.user.charAt(0)}
                                  </div>
                                  <div className="flex-1 space-y-0.5 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-extrabold text-gray-300 truncate">{c.user}</span>
                                      <span className="text-[8.5px] text-gray-500 shrink-0">{c.time}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-200 font-light leading-relaxed break-words">{c.text}</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Write comment at the bottom of Right Comments Tab */}
                          <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                            <div className="h-7.5 w-7.5 rounded-full bg-[#BDFB04] text-[#191919] flex items-center justify-center font-bold text-xs">
                              {currentUser?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                placeholder="Add comment..."
                                className="w-full bg-white/5 border border-white/10 text-white pl-4 pr-10 py-2 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#BDFB04]"
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddComment(activeItem.id);
                                }}
                              />
                              <button
                                onClick={() => handleAddComment(activeItem.id)}
                                disabled={!newCommentText.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#BDFB04] disabled:text-white/20 hover:scale-105 transition-all cursor-pointer"
                              >
                                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions and buttons */}
                    <div className="pt-4 border-t border-white/5 flex items-center gap-4">
                      {'ownershipType' in activeItem && (
                        <button 
                          onClick={() => saveToggle(activeItem.id)}
                          className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-103 transition-all text-white shadow-md cursor-pointer"
                          title={isSaved ? 'Unsave Event' : 'Save Event'}
                        >
                          <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-[#BDFB04] text-[#BDFB04]' : 'text-white'}`} />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleShare(activeItem)}
                        className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-103 transition-all text-white shadow-md cursor-pointer"
                        title="Share Link"
                      >
                        <Mail className="h-5 w-5" />
                      </button>

                      <Button 
                        variant="neon" 
                        size="lg" 
                        onClick={() => handleCardClick(activeItem)}
                        className="flex-1 h-12 shadow-lg shadow-[#BDFB04]/15 uppercase tracking-widest font-extrabold text-xs"
                      >
                        {'ownershipType' in activeItem ? 'RSVP & Info' : 'Contact Organizer'}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )
        ) : (
          <EmptyState
            icon={<Compass className="h-8 w-8 text-gray-400" />}
            title="No events found"
            description="Try adjusting your search or category filters to discover campus activities."
          />
        )
      ) : (
        /* Original Grid view */
        sortedFilteredItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {sortedFilteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <EventCard
                    event={item}
                    onClick={() => handleCardClick(item)}
                    isSaved={'ownershipType' in item ? item.savedBy?.includes(currentUser?.name || '') : false}
                    onSave={'ownershipType' in item ? (e) => {
                      e.stopPropagation();
                      saveToggle(item.id);
                    } : undefined}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            icon={<Compass className="h-8 w-8 text-gray-400" />}
            title="No events found"
            description="Try adjusting your search or category filters to discover campus activities."
          />
        )
      )}

      {/* Custom Promotion Details Modal */}
      <AnimatePresence>
        {selectedPromo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPromo(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-black/[0.06] rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl relative z-10"
            >
              {/* Header Decorative Image Cover */}
              <div className="h-40 bg-gradient-to-tr from-purple-900 via-slate-900 to-violet-950 relative flex items-end p-6">
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setSelectedPromo(null)}
                    className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    Promotion Card
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white mt-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {selectedPromo.title}
                  </h2>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  {/* Category & Date */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#4F5666]">
                    <span className="bg-black/5 px-2.5 py-1 rounded-full text-[#191919] capitalize">
                      Category: {selectedPromo.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#BDFB04]" />
                      Posted: {new Date(selectedPromo.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">About this Promotion</h3>
                    <p className="text-sm text-[#4F5666] leading-relaxed whitespace-pre-wrap">
                      {selectedPromo.description}
                    </p>
                  </div>

                  {/* Organizer Contact Info */}
                  <div className="bg-black/5 border border-black/[0.04] p-4 rounded-2xl space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Organizer Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#191919]">
                        <span className="text-gray-400">Name:</span>
                        <span className="font-bold">{selectedPromo.organizer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#4F5666]">
                        <Mail className="h-3.5 w-3.5 text-[#BDFB04] shrink-0" />
                        <span className="break-all">{selectedPromo.contactInfo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => setSelectedPromo(null)}
                  >
                    Close
                  </Button>
                  <a 
                    href={`mailto:${selectedPromo.contactInfo}?subject=Inquiry about: ${selectedPromo.title}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#BDFB04] hover:bg-[#BDFB04]/90 text-[#191919] rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/10"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Organizer
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Slide-Up Comments Drawer Overlay */}
      <AnimatePresence>
        {commentsOpenItem && isMobile && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommentsOpenItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            
            {/* Drawer Body */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative z-10 w-full max-w-lg bg-[#18181b] border-t border-white/10 rounded-t-[32px] p-6 flex flex-col h-[70vh] text-white font-sans"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="w-8" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Comments ({(commentsMap[commentsOpenItem.id] || []).length})
                </h3>
                <button
                  onClick={() => setCommentsOpenItem(null)}
                  className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Comments Scroll Area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin text-left">
                {(commentsMap[commentsOpenItem.id] || []).length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-500 font-medium">
                    No comments yet. Share your thoughts!
                  </div>
                ) : (
                  (commentsMap[commentsOpenItem.id] || []).map((comment, idx) => (
                    <div key={idx} className="flex gap-3 items-start animate-fadeIn">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xs uppercase text-[#BDFB04] shrink-0">
                        {comment.user.charAt(0)}
                      </div>
                      <div className="flex-1 space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-gray-300 truncate">{comment.user}</span>
                          <span className="text-[9px] text-gray-500 shrink-0">{comment.time}</span>
                        </div>
                        <p className="text-xs text-gray-200 font-light leading-relaxed break-words">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#BDFB04] text-[#191919] flex items-center justify-center font-bold text-xs">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Add comment..."
                    className="w-full bg-white/5 border border-white/10 text-white pl-4 pr-12 py-2.5 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#BDFB04]"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(commentsOpenItem.id);
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(commentsOpenItem.id)}
                    disabled={!newCommentText.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#BDFB04] disabled:text-white/20 hover:scale-105 transition-all cursor-pointer"
                  >
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-screen TikTok overlay modal removed - TikTok mobile/web layouts are now rendered directly inline. */}
    </div>
  );
}
