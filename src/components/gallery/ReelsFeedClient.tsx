'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  AtSign,
  Check,
  Copy,
  Heart,
  HelpCircle,
  MessageCircle,
  Music,
  Play,
  Send,
  Share2,
  Users,
  Video,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type { ReelsFilterParams } from '@/lib/slugs';
import { buildReelsUrl } from '@/lib/slugs';

export type ReelItem = {
  _id: string;
  slug: string;
  title: string;
  caption?: string;
  kind: string;
  tags?: string[];
  authorName?: string;
  authorAvatar?: string;
  viewCount?: number;
  charityName?: string;
  charityProfileImage?: string;
  media: {
    url: string;
    thumbnailUrl?: string;
    mediaType: string;
  };
  productId?: string;
  productSlug?: string;
};

type Comment = {
  id: number;
  user: string;
  avatarColor: string;
  text: string;
  time: string;
};

type CategoryTab = {
  id: string;
  label: string;
  tag?: string;
  kind?: string;
};

type ReelDisplay = {
  id: string;
  slug: string;
  author: string;
  description: string;
  song: string;
  category: string;
  likes: number;
  image: string;
  videoUrl?: string;
  isVideo: boolean;
  productSlug?: string;
  productId?: string;
};

const CATEGORIES: CategoryTab[] = [
  { id: 'all', label: 'All Impact' },
  { id: 'food', label: 'Food Relief', tag: 'food' },
  { id: 'healthcare', label: 'Healthcare', tag: 'healthcare' },
  { id: 'education', label: 'Education', tag: 'education' },
  { id: 'impact', label: 'Impact', tag: 'impact' },
];

const FALLBACK_IMAGES = {
  food: '/images/events/charity_event_hero.jpg',
  healthcare: '/images/events/donation_hands.jpg',
  education: '/images/events/community_poll_bg.jpg',
  default: '/images/events/charity_event_hero.jpg',
};

const DEMO_COMMENTS: Record<string, Comment[]> = {
  demo1: [
    {
      id: 1,
      user: 'Claire M.',
      avatarColor: 'bg-blue-100 text-blue-900',
      text: 'Thank you for distributing this directly! Verified grain bags look so wholesome! 🍲',
      time: '2m ago',
    },
    {
      id: 2,
      user: 'Marcus Vance',
      avatarColor: 'bg-slate-100 text-slate-800',
      text: 'Zero administrative leakage is why I trust Angelpage above traditional NGOs.',
      time: '1h ago',
    },
  ],
  demo2: [
    {
      id: 1,
      user: 'Dr. Jenkins',
      avatarColor: 'bg-blue-100 text-blue-900',
      text: 'The pediatric diagnostics machine is fully operational. Already treated 42 kids!',
      time: '12m ago',
    },
  ],
};

function filtersFromParams(params: ReelsFilterParams) {
  return {
    kind: params.kind || '',
    tag: params.tag || '',
    charityId: params.charityId || '',
    item: params.item || '',
  };
}

function inferCategory(item: ReelItem): string {
  const tags = (item.tags || []).map(t => t.toLowerCase());
  if (tags.some(t => t.includes('food'))) return 'Food Relief';
  if (tags.some(t => t.includes('health') || t.includes('medical'))) return 'Healthcare';
  if (tags.some(t => t.includes('education') || t.includes('school'))) return 'Education';
  if (tags.some(t => t.includes('impact'))) return 'Impact';
  if (item.kind === 'photo') return 'Impact';
  return 'All Impact';
}

function mapItemToReel(item: ReelItem): ReelDisplay {
  const category = inferCategory(item);
  const isVideo = ['video', 'reel'].includes(item.media.mediaType);
  const image =
    item.media.thumbnailUrl ||
    (isVideo ? item.media.url : item.media.url) ||
    FALLBACK_IMAGES.default;

  return {
    id: item._id,
    slug: item.slug,
    author: item.authorName ? `@${item.authorName.replace(/\s+/g, '').toLowerCase()}` : '@angelpage',
    description: item.caption || item.title,
    song: `Original Audio - ${item.charityName || 'Angelpage Field Team'}`,
    category,
    likes: Math.max(0, Math.round(Number(item.viewCount || 0) / 10)) || 1200,
    image,
    videoUrl: isVideo ? item.media.url : undefined,
    isVideo,
    productSlug: item.productSlug,
    productId: item.productId,
  };
}

function buildDemoReels(): ReelDisplay[] {
  return [
    {
      id: 'demo1',
      slug: 'demo-food-relief',
      author: '@globalrelief',
      description:
        'Your donations at work! Distributing warm meals today directly in flood regions. Thank you Angelpage community! 🍲✨ #Impact #FoodRelief',
      song: 'Original Audio - Global Relief Field Depot',
      category: 'Food Relief',
      likes: 12400,
      image: FALLBACK_IMAGES.food,
      isVideo: false,
    },
    {
      id: 'demo2',
      slug: 'demo-healthcare',
      author: '@angelpage_healthcare',
      description:
        'Behind the scenes at our frontline Maternal Health Clinic. State-of-the-art equipment treating mothers! 🏥💙 #Transparency #Healthcare',
      song: 'Inspiring Hope - Cinematic Clinicians',
      category: 'Healthcare',
      likes: 8900,
      image: FALLBACK_IMAGES.healthcare,
      isVideo: false,
    },
    {
      id: 'demo3',
      slug: 'demo-education',
      author: '@education_forward',
      description:
        'Handing out certified school curriculum kits and pencils to students rebuilding their future. 🎒📝 #Education #DirectImpact',
      song: 'Acoustic Horizons - School Builders',
      category: 'Education',
      likes: 5400,
      image: FALLBACK_IMAGES.education,
      isVideo: false,
    },
  ];
}

interface ReelsFeedClientProps {
  initialItems: ReelItem[];
  initialFilters?: ReelsFilterParams;
}

const reelVariants = {
  enter: (dir: 'up' | 'down') => ({
    y: dir === 'up' ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 26,
      opacity: { duration: 0.22 },
    },
  },
  exit: (dir: 'up' | 'down') => ({
    y: dir === 'up' ? '-100%' : '100%',
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.22, ease: 'easeInOut' as const },
  }),
};

export default function ReelsFeedClient({
  initialItems,
  initialFilters = {},
}: ReelsFeedClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastScrollTimeRef = useRef(0);

  const [items, setItems] = useState<ReelItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down'>('up');
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(DEMO_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const filters = useMemo(
    () =>
      filtersFromParams({
        kind: searchParams?.get('kind') || initialFilters.kind || '',
        tag: searchParams?.get('tag') || initialFilters.tag || '',
        charityId: searchParams?.get('charityId') || initialFilters.charityId || '',
        item: searchParams?.get('item') || initialFilters.item || '',
      }),
    [searchParams, initialFilters],
  );

  const activeCategoryId = useMemo(() => {
    if (filters.tag === 'food') return 'food';
    if (filters.tag === 'healthcare') return 'healthcare';
    if (filters.tag === 'education') return 'education';
    if (filters.tag === 'impact') return 'impact';
    return 'all';
  }, [filters.tag]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.get(`${api}/gallery`, {
        params: {
          limit: 24,
          ...(filters.kind ? { kind: filters.kind } : {}),
          ...(filters.tag ? { tag: filters.tag } : {}),
          ...(filters.charityId ? { charityId: filters.charityId } : {}),
        },
      });
      setItems(res.data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters.kind, filters.tag, filters.charityId]);

  useEffect(() => {
    fetchItems();
    setActiveReelIndex(0);
  }, [fetchItems]);

  const mappedReels = useMemo(() => {
    const fromApi = items.map(mapItemToReel);
    return fromApi.length > 0 ? fromApi : buildDemoReels();
  }, [items]);

  const filteredReels = useMemo(() => {
    const cat = CATEGORIES.find(c => c.id === activeCategoryId);
    if (!cat || cat.id === 'all') return mappedReels;
    return mappedReels.filter(
      reel =>
        reel.category.toLowerCase().includes(cat.label.split(' ')[0].toLowerCase()) ||
        (cat.tag && reel.description.toLowerCase().includes(cat.tag)),
    );
  }, [mappedReels, activeCategoryId]);

  const currentReel = filteredReels[activeReelIndex] || filteredReels[0];

  useEffect(() => {
    if (!filters.item || !filteredReels.length) return;
    const index = filteredReels.findIndex(r => r.slug === filters.item);
    if (index >= 0) setActiveReelIndex(index);
  }, [filters.item, filteredReels]);

  useEffect(() => {
    if (!currentReel) return;
    setLikeCounts(prev => ({
      ...prev,
      [currentReel.id]: prev[currentReel.id] ?? currentReel.likes,
    }));
  }, [currentReel]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentReel?.isVideo) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, currentReel?.id, currentReel?.isVideo]);

  const handleNext = useCallback(() => {
    if (activeReelIndex < filteredReels.length - 1) {
      setSlideDirection('up');
      setActiveReelIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  }, [activeReelIndex, filteredReels.length]);

  const handlePrev = useCallback(() => {
    if (activeReelIndex > 0) {
      setSlideDirection('down');
      setActiveReelIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  }, [activeReelIndex]);

  useEffect(() => {
    const handleWindowWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 650) return;
      if (e.deltaY > 15 && activeReelIndex < filteredReels.length - 1) {
        lastScrollTimeRef.current = now;
        handleNext();
      } else if (e.deltaY < -15 && activeReelIndex > 0) {
        lastScrollTimeRef.current = now;
        handlePrev();
      }
    };
    window.addEventListener('wheel', handleWindowWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWindowWheel);
  }, [activeReelIndex, filteredReels.length, handleNext, handlePrev]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const applyCategory = (tab: CategoryTab) => {
    setActiveReelIndex(0);
    const next: ReelsFilterParams = {
      ...(filters.charityId ? { charityId: filters.charityId } : {}),
      ...(filters.kind ? { kind: filters.kind } : {}),
      ...(tab.tag ? { tag: tab.tag } : {}),
    };
    router.push(buildReelsUrl(next));
  };

  const handleLikeToggle = (reelId: string) => {
    const isLiked = likedReels[reelId];
    setLikedReels(prev => ({ ...prev, [reelId]: !isLiked }));
    setLikeCounts(prev => ({
      ...prev,
      [reelId]: (prev[reelId] ?? 0) + (isLiked ? -1 : 1),
    }));
  };

  const handleDoubleClickVideo = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!currentReel) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const heartId = Date.now();
    setFloatingHearts(prev => [...prev, { id: heartId, x, y }]);
    if (!likedReels[currentReel.id]) handleLikeToggle(currentReel.id);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== heartId));
    }, 1000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentReel) return;
    const newComment: Comment = {
      id: Date.now(),
      user: 'You (Verified Backer)',
      avatarColor: 'bg-blue-900 text-white font-bold',
      text: newCommentText,
      time: 'Just now',
    };
    setCommentsMap(prev => ({
      ...prev,
      [currentReel.id]: [newComment, ...(prev[currentReel.id] || [])],
    }));
    setNewCommentText('');
  };

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined' || !currentReel) return '/reels';
    return `${window.location.origin}${buildReelsUrl({
      ...(filters.charityId ? { charityId: filters.charityId } : {}),
      ...(filters.kind ? { kind: filters.kind } : {}),
      ...(filters.tag ? { tag: filters.tag } : {}),
      item: currentReel.slug,
    })}`;
  }, [currentReel, filters.charityId, filters.kind, filters.tag]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleSocialShare = (platform: string) => {
    if (!currentReel) return;
    const shareText = `Check out this verified direct-impact story on Angelpage by ${currentReel.author}`;
    let url = '';
    if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (
      touchStartY === null ||
      touchEndY === null ||
      touchStartX === null ||
      touchEndX === null
    ) {
      return;
    }
    const distanceY = touchStartY - touchEndY;
    const distanceX = touchStartX - touchEndX;
    if (Math.abs(distanceY) > Math.abs(distanceX)) {
      if (distanceY > 40) handleNext();
      else if (distanceY < -40) handlePrev();
    } else {
      if (distanceX > 40) handleNext();
      else if (distanceX < -40) handlePrev();
    }
  };

  const commentsList = currentReel ? commentsMap[currentReel.id] || [] : [];
  const activeCategory = CATEGORIES.find(c => c.id === activeCategoryId)?.label || 'All Impact';

  if (loading && items.length === 0) {
    return (
      <div className="fixed inset-0 z-[10070] flex items-center justify-center bg-[#0B0112]">
        <div className="flex flex-col items-center gap-4">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-[#611192]" />
          <p className="font-primary text-2xl text-white">Loading stories</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 mask-[radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
        aria-hidden
      />

      {/* Header overlay */}
      <div className="pointer-events-none absolute left-0 right-0 top-4 z-30 flex items-center justify-between px-4">
        <Link
          href="/"
          className="pointer-events-auto flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/45 px-3.5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-md transition-all hover:bg-black/75"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          <span className="inline sm:hidden">Home</span>
        </Link>

        <div className="pointer-events-auto flex max-w-[calc(100%-140px)] gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-black/35 p-1 backdrop-blur-md scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => applyCategory(cat)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategoryId === cat.id
                  ? 'bg-white font-black text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="pointer-events-none flex items-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 font-mono text-xs text-emerald-400 shadow-lg backdrop-blur-md md:hidden">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span>LIVE STORIES</span>
        </div>
      </div>

      {/* Player frame */}
      <div className="relative flex h-[86vh] w-full max-w-[420px] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 shadow-2xl sm:h-dvh sm:max-w-full sm:rounded-none sm:border-0">
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative h-full w-full touch-none select-none overflow-hidden"
        >
          {filteredReels.length > 0 && currentReel ? (
            <AnimatePresence mode="popLayout" custom={slideDirection}>
              <motion.div
                key={`${activeCategoryId}-${activeReelIndex}`}
                custom={slideDirection}
                variants={reelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
                onDoubleClick={handleDoubleClickVideo}
              >
                {currentReel.isVideo && currentReel.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={currentReel.videoUrl}
                    poster={currentReel.image}
                    className={`h-full w-full object-cover transition-transform duration-[20s] ease-out ${isPlaying ? 'scale-105' : 'scale-100'}`}
                    loop
                    playsInline
                    muted={isMuted}
                  />
                ) : (
                  <Image
                    src={currentReel.image}
                    alt={currentReel.description}
                    fill
                    className={`object-cover transition-transform duration-[20s] ease-out ${isPlaying ? 'scale-105' : 'scale-100'}`}
                    sizes="(max-width: 420px) 100vw, 420px"
                    priority
                  />
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/15 to-black/55" />

                <div
                  className="absolute inset-0 z-10 cursor-pointer"
                  onClick={() => setIsPlaying(p => !p)}
                  aria-hidden
                />

                {floatingHearts.map(heart => (
                  <motion.div
                    key={heart.id}
                    initial={{ scale: 0, opacity: 1, x: heart.x - 24, y: heart.y - 24 }}
                    animate={{
                      scale: [1, 1.8, 1.2],
                      opacity: [1, 1, 0],
                      y: heart.y - 140,
                      rotate: [-15, 15, -5],
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="pointer-events-none absolute z-30"
                  >
                    <Heart className="h-12 w-12 fill-red-500 text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
                  </motion.div>
                ))}

                {!isPlaying && (
                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/20 shadow-xl backdrop-blur-md"
                    >
                      <Play className="ml-1 h-6 w-6 text-white" fill="currentColor" aria-hidden />
                    </motion.div>
                  </div>
                )}

                <div className="pointer-events-none absolute bottom-0 left-0 right-16 z-20 p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-sm border border-blue-500/25 bg-blue-900 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white">
                      {currentReel.category}
                    </span>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    <span className="font-mono text-[10px] font-semibold uppercase text-emerald-400">
                      VERIFIED
                    </span>
                  </div>
                  <h3 className="mb-1.5 font-sans text-sm font-bold text-white drop-shadow-md">
                    {currentReel.author}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-xs font-light leading-relaxed text-slate-200 drop-shadow-md">
                    {currentReel.description}
                  </p>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-300">
                    <Music
                      className="h-3 w-3 animate-spin text-slate-400"
                      style={{ animationDuration: '6s' }}
                      aria-hidden
                    />
                    <span className="max-w-[140px] truncate">{currentReel.song}</span>
                  </div>
                  {currentReel.productId && (
                    <Link
                      href={`/product/${currentReel.productSlug || currentReel.productId}`}
                      className="pointer-events-auto mt-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs"
                    >
                      View linked product
                    </Link>
                  )}
                </div>

                <div className="absolute bottom-6 right-3.5 z-20 flex flex-col items-center gap-4.5">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleLikeToggle(currentReel.id);
                    }}
                    className="group flex flex-col items-center gap-0.5 transition-transform active:scale-95"
                    title="Like Story"
                  >
                    <div
                      className={`rounded-full border p-2.5 backdrop-blur-md transition-all duration-300 ${
                        likedReels[currentReel.id]
                          ? 'scale-110 border-red-500 bg-red-500/25 text-red-500 shadow-lg shadow-red-500/20'
                          : 'border-white/10 bg-black/45 text-white hover:border-red-400 hover:bg-red-500/25'
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${likedReels[currentReel.id] ? 'fill-red-500 text-red-500' : ''}`}
                        aria-hidden
                      />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-slate-200 drop-shadow-md">
                      {(likeCounts[currentReel.id] ?? currentReel.likes).toLocaleString()}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setIsCommentsOpen(true);
                    }}
                    className="group flex flex-col items-center gap-0.5 transition-transform active:scale-95"
                    title="Read Comments"
                  >
                    <div className="rounded-full border border-white/10 bg-black/45 p-2.5 text-white backdrop-blur-md transition-colors hover:border-blue-500/50 hover:bg-blue-900/40">
                      <MessageCircle className="h-5 w-5" aria-hidden />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-slate-200 drop-shadow-md">
                      {commentsList.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setIsShareOpen(true);
                    }}
                    className="group flex flex-col items-center gap-0.5 transition-transform active:scale-95"
                    title="Share Verified Link"
                  >
                    <div className="rounded-full border border-white/10 bg-black/45 p-2.5 text-white backdrop-blur-md transition-colors hover:border-indigo-500/50 hover:bg-indigo-900/40">
                      <Share2 className="h-5 w-5" aria-hidden />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-slate-200 drop-shadow-md">
                      Share
                    </span>
                  </button>
                </div>

                {(currentReel.isVideo) && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setIsMuted(m => !m);
                    }}
                    className="absolute right-4 top-18 z-20 rounded-full border border-white/10 bg-black/45 p-2.5 backdrop-blur-md transition-colors hover:bg-slate-800"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-slate-400" aria-hidden />
                    ) : (
                      <Volume2 className="h-4 w-4 text-white" aria-hidden />
                    )}
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <Video className="mb-3 h-12 w-12 text-slate-600" aria-hidden />
              <h4 className="mb-1 font-serif text-sm font-bold">No Videos in {activeCategory}</h4>
              <p className="mb-4 text-xs font-light text-slate-500">
                Our ground teams are uploading more telemetry logs. Check back soon!
              </p>
              <button
                type="button"
                onClick={() => applyCategory(CATEGORIES[0])}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 font-mono text-xs uppercase hover:bg-slate-800"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Desktop nav arrows */}
        <div className="absolute -left-16 top-1/2 flex -translate-y-1/2 flex-col gap-3 md:hidden">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeReelIndex === 0}
            className="rounded-full border border-white/10 bg-black/50 p-3 shadow-lg backdrop-blur-md transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-20"
            title="Previous Story"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="rotate-90 text-white">
              <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-center font-mono text-[8px] font-bold uppercase tracking-widest text-slate-400">
            PREV
          </span>
        </div>

        <div className="absolute -right-16 top-1/2 flex -translate-y-1/2 flex-col gap-3 md:hidden">
          <button
            type="button"
            onClick={handleNext}
            disabled={activeReelIndex >= filteredReels.length - 1}
            className="rounded-full border border-white/10 bg-black/50 p-3 shadow-lg backdrop-blur-md transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-20"
            title="Next Story"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="rotate-90 text-white">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-center font-mono text-[8px] font-bold uppercase tracking-widest text-slate-400">
            NEXT
          </span>
        </div>

        {/* Pagination dots */}
        <div className="pointer-events-none absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full border border-white/5 bg-black/35 px-2.5 py-1 backdrop-blur-xs">
          {filteredReels.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeReelIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Comments drawer */}
      <AnimatePresence>
        {isCommentsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:items-end sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCommentsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-50 flex h-[600px] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-white shadow-2xl sm:h-[70vh] sm:rounded-b-none sm:rounded-t-3xl sm:border-b-0"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 p-4 backdrop-blur-sm">
                <div>
                  <h4 className="flex items-center gap-2 font-serif text-base font-bold">
                    Verified Backer Comments
                    <span className="rounded-full border border-blue-500/20 bg-blue-900/50 px-2 py-0.5 font-mono text-[11px] text-blue-400">
                      {commentsList.length}
                    </span>
                  </h4>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-slate-400">
                    Audited for authenticity
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCommentsOpen(false)}
                  className="rounded-full border border-slate-800 p-2 text-slate-400 shadow-xs transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-950 p-4">
                {commentsList.map(comm => (
                  <motion.div
                    key={comm.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 rounded-2xl border border-slate-800/60 bg-slate-900 p-3.5"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${comm.avatarColor}`}
                    >
                      {comm.user[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-bold text-slate-200">{comm.user}</span>
                        <span className="font-mono text-[9px] uppercase text-slate-500">{comm.time}</span>
                      </div>
                      <p className="wrap-break-word text-xs font-light leading-relaxed text-slate-300">
                        {comm.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {commentsList.length === 0 && (
                  <div className="py-12 text-center text-slate-500">
                    <MessageCircle className="mx-auto mb-2 h-10 w-10 text-slate-700" aria-hidden />
                    <p className="font-mono text-xs uppercase">No comments yet</p>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleAddComment}
                className="flex items-center gap-2.5 border-t border-slate-800 bg-slate-900 p-4"
              >
                <input
                  type="text"
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  placeholder="Type an authentic comment..."
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-sans text-xs text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="flex items-center justify-center rounded-xl border border-blue-800/30 bg-blue-900 p-3 text-white transition-colors hover:bg-blue-950 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" aria-hidden />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share drawer */}
      <AnimatePresence>
        {isShareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:items-end sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-50 flex w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-white shadow-2xl sm:rounded-b-none sm:rounded-t-3xl sm:border-b-0"
            >
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 p-5">
                <div>
                  <h4 className="font-serif text-lg font-bold">Broadcast Impact</h4>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    Share directly to global networks
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShareOpen(false)}
                  className="rounded-full border border-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="space-y-5 bg-slate-950 p-6">
                <div className="space-y-2">
                  <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Copy Share URL
                  </span>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-2">
                    <span className="max-w-[260px] truncate pl-2 font-mono text-xs text-slate-400 select-all">
                      {shareUrl}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 font-mono text-xs font-bold transition-all ${
                        copyFeedback
                          ? 'border border-emerald-500 bg-emerald-500/25 text-emerald-400'
                          : 'border border-blue-800/30 bg-blue-900 text-white hover:bg-blue-950'
                      }`}
                    >
                      {copyFeedback ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[3px]" aria-hidden />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Share to Social Channels
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: 'twitter',
                        label: 'Twitter / X',
                        sub: 'Post Update',
                        icon: AtSign,
                        iconWrap: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
                      },
                      {
                        id: 'tiktok',
                        label: 'TikTok',
                        sub: 'Copy Link',
                        icon: Video,
                        iconWrap: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
                      },
                      {
                        id: 'linkedin',
                        label: 'LinkedIn',
                        sub: 'Post Update',
                        icon: Users,
                        iconWrap: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                      },
                      {
                        id: 'facebook',
                        label: 'Facebook',
                        sub: 'Feed Story',
                        icon: Share2,
                        iconWrap: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
                      },
                    ].map(platform => {
                      const Icon = platform.icon;
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => handleSocialShare(platform.id)}
                          className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3.5 text-left transition-all active:scale-95 hover:bg-slate-850"
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${platform.iconWrap}`}
                          >
                            <Icon className="h-5 w-5" aria-hidden />
                          </div>
                          <div>
                            <span className="block text-xs font-bold leading-none text-white">
                              {platform.label}
                            </span>
                            <span className="font-mono text-[9px] font-semibold uppercase text-slate-500">
                              {platform.sub}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2 flex gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900 p-3.5 text-[10px] font-light leading-relaxed text-slate-400">
                  <HelpCircle className="h-4.5 w-4.5 shrink-0 text-blue-500" aria-hidden />
                  <span>
                    Your share link preserves direct-impact references. Anyone clicking can immediately
                    pledge zero-leakage donations.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
