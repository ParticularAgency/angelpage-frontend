'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import LanguageSwitch from './LanguageSwitch';
import { categoriesData } from '@/libs/categoriesData';
import { fetchCategories, type Category } from '@/lib/categories';

const fallback = categoriesData.categories as Category[];

export function categoryHref(categoryId: string, subcategoryId?: string) {
  const params = new URLSearchParams({ category: categoryId });
  if (subcategoryId) params.set('subcategory', subcategoryId);
  return `/product?${params.toString()}`;
}

function useCatalog() {
  const [categories, setCategories] = useState<Category[]>(fallback);

  useEffect(() => {
    fetchCategories()
      .then(list => {
        if (list.length > 0) setCategories(list);
      })
      .catch(() => undefined);
  }, []);

  return categories;
}

const BottomNavMegamenu = () => {
  const pathname = usePathname();
  const categories = useCatalog();
  const [openId, setOpenId] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);
  const open = categories.find(category => category.id === openId) || null;

  useEffect(() => {
    setOpenId(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null);
    };
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpenId(null);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenId(null), 180);
  };

  const reveal = (id: string) => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    cancelClose();
    setOpenId(id);
  };

  return (
    <nav
      ref={rootRef}
      className="header-bottom-navbar navbar-megamenu-area relative"
      onMouseLeave={scheduleClose}
    >
      <div className="custom-container flex items-center justify-between gap-4">
        <ul className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
          {categories.map(category => {
            const active = openId === category.id;
            return (
              <li key={category.id} onMouseEnter={() => reveal(category.id)}>
                <button
                  type="button"
                  aria-expanded={active}
                  aria-controls="catalog-mega-panel"
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 font-secondary text-[11px] uppercase tracking-[0.08em] transition ${
                    active
                      ? 'bg-[#611192] text-white'
                      : 'text-[#3A343C] hover:bg-[#FCF2FF] hover:text-[#611192]'
                  }`}
                  onClick={() => {
                    cancelClose();
                    setOpenId(active ? null : category.id);
                  }}
                >
                  {category.name}
                </button>
              </li>
            );
          })}
        </ul>
        <LanguageSwitch />
      </div>

      {open && (
        <div
          id="catalog-mega-panel"
          className="absolute left-0 right-0 top-full z-[80] border-y border-[#E6E3E7] bg-white shadow-[0_28px_48px_rgba(11,1,18,0.08)]"
          onMouseEnter={cancelClose}
        >
          <div className="custom-container grid grid-cols-12 gap-8 py-8">
            <div className="col-span-3 rounded-3xl bg-[#FCF2FF] p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
                Shop
              </p>
              <h3 className="font-primary mt-2 text-[2rem] leading-none text-[#0B0112]">
                {open.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#5C5560]">
                {open.subCategories.length} sections. Each purchase supports a charity.
              </p>
              <Link
                href={categoryHref(open.id)}
                onClick={() => setOpenId(null)}
                className="mt-5 inline-flex rounded-full bg-[#611192] px-4 py-2.5 text-sm font-medium text-white"
              >
                Shop all {open.name}
              </Link>
            </div>
            <ul className="col-span-9 grid grid-cols-3 content-start gap-1">
              {open.subCategories.map(sub => (
                <li key={sub.id}>
                  <Link
                    href={categoryHref(open.id, sub.id)}
                    onClick={() => setOpenId(null)}
                    className="block rounded-xl px-3 py-2.5 text-sm capitalize text-[#0B0112] transition hover:bg-[#FCF2FF] hover:text-[#611192]"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export function MobileCatalogMenu() {
  const categories = useCatalog();
  const [openId, setOpenId] = useState<string | null>(null);

  const closeDrawer = () => {
    const input = document.getElementById('my-drawer-mobile-menu') as HTMLInputElement | null;
    if (input) input.checked = false;
  };

  return (
    <div className="px-4 pb-8">
      <p className="px-1 pb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
        Shop
      </p>
      <ul className="flex flex-col">
        {categories.map(category => {
          const open = openId === category.id;
          return (
            <li key={category.id} className="border-b border-[#E6E3E7]">
              <button
                type="button"
                aria-expanded={open}
                className="flex w-full items-center justify-between py-4 text-left font-primary text-2xl text-[#0B0112]"
                onClick={() => setOpenId(open ? null : category.id)}
              >
                {category.name}
                <span className="text-lg text-[#611192]">{open ? '–' : '+'}</span>
              </button>
              {open && (
                <div className="pb-4">
                  <Link
                    href={categoryHref(category.id)}
                    onClick={closeDrawer}
                    className="mb-2 block rounded-full bg-[#611192] px-4 py-2 text-center text-sm font-medium text-white"
                  >
                    Shop all {category.name}
                  </Link>
                  <ul className="grid grid-cols-2 gap-1">
                    {category.subCategories.map(sub => (
                      <li key={sub.id}>
                        <Link
                          href={categoryHref(category.id, sub.id)}
                          onClick={closeDrawer}
                          className="block rounded-xl px-2 py-2 text-sm capitalize text-[#0B0112]"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BottomNavMegamenu;
