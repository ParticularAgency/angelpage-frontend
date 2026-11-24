import type { CommunityEventRecord } from '@/lib/server-api';

export type EventTypeKey = 'donation' | 'live_session' | 'general';

export type EventTiming = 'upcoming' | 'live' | 'ended' | 'open';

export const EVENT_TYPE_CONFIG: Record<
  EventTypeKey,
  {
    label: string;
    shortLabel: string;
    accent: string;
    bg: string;
    border: string;
    icon: 'heart' | 'broadcast' | 'users';
  }
> = {
  donation: {
    label: 'Donation drive',
    shortLabel: 'Giving',
    accent: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'heart',
  },
  live_session: {
    label: 'Live session',
    shortLabel: 'Live',
    accent: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'broadcast',
  },
  general: {
    label: 'Community',
    shortLabel: 'Community',
    accent: 'text-[#611192]',
    bg: 'bg-[#F2E8F8]',
    border: 'border-[#E8D4F4]',
    icon: 'users',
  },
};

export function getEventTypeConfig(eventType?: string) {
  const key = (eventType as EventTypeKey) || 'general';
  return EVENT_TYPE_CONFIG[key] ?? EVENT_TYPE_CONFIG.general;
}

export function getEventTiming(event: CommunityEventRecord): EventTiming {
  const now = Date.now();
  const start = event.startAt ? new Date(event.startAt).getTime() : null;
  const end = event.endAt ? new Date(event.endAt).getTime() : null;

  if (end && now > end) return 'ended';
  if (start && now < start) return 'upcoming';
  if (start && end && now >= start && now <= end) return 'live';
  if (start && !end && now >= start) return 'live';
  return 'open';
}

export function formatEventDate(iso?: string) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export function formatShortDate(iso?: string) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export function getDonationProgress(event: CommunityEventRecord) {
  const goal = Number(event.donationGoal) || 0;
  const raised = Number(event.donationRaised) || 0;
  if (!goal) return { raised, goal: 0, percent: 0 };
  return {
    raised,
    goal,
    percent: Math.min(100, Math.round((raised / goal) * 100)),
  };
}

export function hasActivePoll(event: CommunityEventRecord) {
  return Boolean(event.pollQuestion && (event.pollOptions?.length ?? 0) > 0);
}

export function filterEvents(
  events: CommunityEventRecord[],
  { search, eventType }: { search: string; eventType: string }
) {
  const term = search.trim().toLowerCase();
  return events.filter(event => {
    if (eventType && event.eventType !== eventType) return false;
    if (!term) return true;
    return (
      event.title.toLowerCase().includes(term) ||
      event.excerpt.toLowerCase().includes(term) ||
      (event.authorName || '').toLowerCase().includes(term)
    );
  });
}

export type DisplayEventType = 'donation' | 'poll' | 'live' | 'general';

export function getDisplayEventType(event: CommunityEventRecord): DisplayEventType {
  if (event.eventType === 'donation') return 'donation';
  if (event.eventType === 'live_session') return 'live';
  if (hasActivePoll(event)) return 'poll';
  return 'general';
}

export function toIcsDate(iso?: string) {
  if (!iso) return '20260715T150000Z';
  const d = new Date(iso);
  return `${d.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
}

export function getGoogleCalendarUrl(ev: {
  title: string;
  desc: string;
  start: string;
  end: string;
  location: string;
}) {
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${ev.start}/${ev.end}&details=${encodeURIComponent(ev.desc)}&location=${encodeURIComponent(ev.location)}`;
}

export function getAppleCalendarUrl(ev: {
  title: string;
  desc: string;
  start: string;
  end: string;
  location: string;
}) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${ev.start}`,
    `DTEND:${ev.end}`,
    `SUMMARY:${ev.title}`,
    `DESCRIPTION:${ev.desc}`,
    `LOCATION:${ev.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}

export function formatEventTime(iso?: string) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export function getCountdownLabel(startAt?: string) {
  if (!startAt) return null;
  const diff = new Date(startAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `Starts in ${days}d ${hours}h`;
  if (hours > 0) return `Starts in ${hours}h`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `Starts in ${mins}m`;
}

export type EventFundAllocation = {
  id: string;
  label: string;
  description?: string;
  percent?: number;
};

export const DEFAULT_EVENT_FUNDS: EventFundAllocation[] = [
  {
    id: 'direct-purchase',
    label: 'Direct Purchase',
    description: 'Direct sourcing of wholesome local supplies and nutrition.',
    percent: 85,
  },
  {
    id: 'safety-packs',
    label: 'Safety Packs',
    description: 'Maternal care, medical sanitization, and essential kits.',
    percent: 10,
  },
  {
    id: 'field-logistics',
    label: 'Field Logistics',
    description: 'Clean local transit and verified ground distribution.',
    percent: 5,
  },
];

export function resolveEventFunds(
  event?: { fundAllocations?: EventFundAllocation[] } | null,
): EventFundAllocation[] {
  if (event?.fundAllocations?.length) return event.fundAllocations;
  return DEFAULT_EVENT_FUNDS;
}
