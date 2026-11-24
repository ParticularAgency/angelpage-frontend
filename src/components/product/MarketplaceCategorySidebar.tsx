'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { categoriesData } from '@/libs/categoriesData';
import { fetchCategories, type Category } from '@/lib/categories';

const MarketplaceCategorySidebar = () => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get('category') || '';
  const activeSubcategory = searchParams?.get('subcategory') || '';
  const [categories, setCategories] = useState<Category[]>(
    categoriesData.categories as Category[]
  );

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  return (
    <nav
      className="marketplace-category-sidebar bg-mono-0 rounded-xl border border-mono-40 p-3"
      aria-label="Browse categories"
    >
      <p className="eyebrow-small text-mono-70 px-2 py-2 mb-1">Categories</p>
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/product"
            className={`block rounded-lg px-3 py-2 body-small capitalize transition-colors ${
              !activeCategory
                ? 'bg-[#FCF2FF] text-primary-color-100 font-medium'
                : 'text-mono-90 hover:bg-[#FCF2FF] hover:text-primary-color-100'
            }`}
          >
            All products
          </Link>
        </li>
        {categories.map(cat => {
          const isActive =
            activeCategory === cat.id || activeCategory === cat.name;
          return (
            <li key={cat.id}>
              <Link
                href={`/product?category=${encodeURIComponent(cat.id)}`}
                className={`block rounded-lg px-3 py-2 body-small capitalize transition-colors ${
                  isActive && !activeSubcategory
                    ? 'bg-[#FCF2FF] text-primary-color-100 font-medium'
                    : 'text-mono-90 hover:bg-[#FCF2FF] hover:text-primary-color-100'
                }`}
              >
                {cat.name}
              </Link>
              {isActive && cat.subCategories.length > 0 && (
                <ul className="ml-2 mt-1 mb-2 flex flex-col gap-0.5 border-l border-mono-40 pl-2">
                  {cat.subCategories.map(sub => {
                    const subActive = activeSubcategory === sub.id;
                    return (
                      <li key={sub.id}>
                        <Link
                          href={`/product?category=${encodeURIComponent(cat.id)}&subcategory=${encodeURIComponent(sub.id)}`}
                          className={`block rounded-md px-2 py-1.5 caption capitalize ${
                            subActive
                              ? 'text-primary-color-100 font-medium'
                              : 'text-mono-70 hover:text-primary-color-100'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MarketplaceCategorySidebar;
