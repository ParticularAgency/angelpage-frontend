'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../elements';
import Image from 'next/image';
import Link from 'next/link';
import { categoriesData } from '@/libs/categoriesData';
import { fetchCategories, type Category } from '@/lib/categories';

const TOPIC_IMAGES: Record<string, string> = {
  women: '/images/home/category/topics/women.jpg',
  men: '/images/home/category/topics/men.jpg',
  children: '/images/home/category/topics/children.jpg',
  clothing: '/images/home/category/topics/clothing.jpg',
  shoes: '/images/home/category/topics/shoes.jpg',
  bags: '/images/home/category/topics/bags.jpg',
  accessories: '/images/home/category/topics/accessories.jpg',
  jewellery: '/images/home/category/topics/jewellery.jpg',
  homeware: '/images/home/category/topics/homeware.jpg',
  books: '/images/home/category/topics/books.jpg',
  electronics: '/images/home/category/topics/electronics.jpg',
};

function categoryBlurb(category: Category) {
  const names = category.subCategories
    .slice(0, 3)
    .map(item => item.name)
    .filter(Boolean);
  if (names.length === 0) {
    return `Browse ${category.name} and support a charity with every purchase.`;
  }
  return `Shop ${names.join(', ')} and more.`;
}

const OurPlatformSection = () => {
  const [categories, setCategories] = useState<Category[]>(
    categoriesData.categories as Category[],
  );

  useEffect(() => {
    fetchCategories()
      .then(list => {
        if (list.length > 0) setCategories(list);
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="our-platform-section bg-[#FCF2FF] py-20">
      <div className="custom-container">
        <div className="grid grid-cols-12 items-start gap-10 sm:grid-cols-1 sm:gap-8">
          <div className="sticky top-28 col-span-4 self-start sm:static sm:col-span-full">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
              Shop
            </p>
            <h2 className="font-primary mt-2 text-[2.6rem] leading-none text-[#0B0112]">
              Our platform
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#5C5560]">
              Every department opens the live listings, and every purchase can support a charity.
            </p>
            <Link href="/auth/register" className="mt-8 inline-block">
              <Button variant="primary">Become a donor</Button>
            </Link>
          </div>
          <div className="col-span-8 grid grid-cols-2 gap-5 sm:col-span-full sm:grid-cols-1">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/product?category=${encodeURIComponent(category.id)}`}
                className="group relative block h-[280px] overflow-hidden rounded-3xl"
              >
                <Image
                  src={TOPIC_IMAGES[category.id] || TOPIC_IMAGES.clothing}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 767px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0B0112] via-[#0B0112]/55 to-[#0B0112]/10" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-primary text-3xl text-white!">{category.name}</p>
                  <p className="mt-1 max-w-xs text-sm text-white!">{categoryBlurb(category)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPlatformSection;
