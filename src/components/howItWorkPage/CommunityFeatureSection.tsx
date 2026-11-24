import React from 'react';
import { Button } from '../elements';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarHeart, Heart, Play, Star, UserRound } from 'lucide-react';

const SUPPORTING = [
  {
    title: 'Profiles',
    text: 'Follow the sellers and charity shops you support.',
    icon: UserRound,
  },
  {
    title: 'Favourites',
    text: 'Save listings so they are easy to find again.',
    icon: Heart,
  },
  {
    title: 'Reviews',
    text: 'Buyers and sellers rate each other and keep the shop accountable.',
    icon: Star,
  },
];

const CommunityFeatureSection = () => {
  return (
    <section className="bg-[#FCF2FF] py-16">
      <div className="custom-container">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
          Community features
        </p>
        <h2 className="font-primary mt-2 max-w-2xl text-[2.4rem] leading-none text-[#0B0112]">
          Reels and events sit with the shop
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5C5560]">
          The marketplace is where items change hands. Reels and events are where the same community watches a story and backs a cause.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-1">
          <article className="overflow-hidden rounded-3xl border border-[#E6E3E7] bg-white">
            <Link href="/reels" className="group relative block h-[280px]">
              <Image
                src="/images/design-events-giving/impact_reel_child_1783397355399.jpg"
                alt="A short story from the Angelpage community"
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0B0112]/80 via-[#0B0112]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#611192] px-3 py-1 text-[11px] font-medium">
                  <Play className="h-3 w-3" aria-hidden />
                  Reels
                </span>
                <p className="font-primary mt-3 text-4xl">Stories</p>
              </div>
            </Link>
            <div className="p-6">
              <h3 className="font-primary text-2xl text-[#0B0112]">Reels</h3>
              <p className="mt-2 text-sm leading-6 text-[#5C5560]">
                Short stories from charities and sellers. Watch what a gift looks like, then open the shop behind the story.
              </p>
              <ol className="mt-4 space-y-2 text-sm text-[#3B055C]">
                <li className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FCF2FF] text-xs font-medium text-[#611192]">
                    1
                  </span>
                  Open Reels and swipe through community stories.
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FCF2FF] text-xs font-medium text-[#611192]">
                    2
                  </span>
                  Follow the charity or seller in the story.
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FCF2FF] text-xs font-medium text-[#611192]">
                    3
                  </span>
                  Shop the listings connected to that story.
                </li>
              </ol>
              <Link
                href="/reels"
                className="mt-5 inline-flex rounded-full bg-[#611192] px-4 py-2 text-sm font-medium text-white"
              >
                Watch reels
              </Link>
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-[#E6E3E7] bg-white">
            <Link href="/events" className="group relative block h-[280px]">
              <Image
                src="/images/events/charity_event_hero.jpg"
                alt="A community giving event"
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0B0112]/80 via-[#0B0112]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#611192] px-3 py-1 text-[11px] font-medium">
                  <CalendarHeart className="h-3 w-3" aria-hidden />
                  Events
                </span>
                <p className="font-primary mt-3 text-4xl">Giving</p>
              </div>
            </Link>
            <div className="p-6">
              <h3 className="font-primary text-2xl text-[#0B0112]">Events</h3>
              <p className="mt-2 text-sm leading-6 text-[#5C5560]">
                Appeals, community votes, and live moments. Open an event to read the story, share it, or give.
              </p>
              <ol className="mt-4 space-y-2 text-sm text-[#3B055C]">
                <li className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FCF2FF] text-xs font-medium text-[#611192]">
                    1
                  </span>
                  Browse appeals, votes, and live moments.
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FCF2FF] text-xs font-medium text-[#611192]">
                    2
                  </span>
                  Share an event with someone who can help.
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FCF2FF] text-xs font-medium text-[#611192]">
                    3
                  </span>
                  Give to the appeal from the event page.
                </li>
              </ol>
              <Link
                href="/events"
                className="mt-5 inline-flex rounded-full border border-[#611192] px-4 py-2 text-sm font-medium text-[#611192]"
              >
                See events
              </Link>
            </div>
          </article>
        </div>

        <ul className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-1">
          {SUPPORTING.map(feature => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="rounded-2xl bg-white px-4 py-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FCF2FF] text-[#611192]">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-3 text-sm font-medium text-[#0B0112]">{feature.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#5C5560]">{feature.text}</p>
              </li>
            );
          })}
        </ul>

        <Link href="/auth/register" className="mt-8 inline-block">
          <Button variant="primary">Join the community</Button>
        </Link>
      </div>
    </section>
  );
};

export default CommunityFeatureSection;
