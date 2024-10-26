'use client';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

const categories = [
  {
    title: 'Women',
    subcategories: [
      {
        title: 'Clothing',
        items: [
          'Skirts',
          'Trousers',
          'Tops',
          'Knitwear',
          'Dresses',
          'Jeans',
          'Jackets',
          'Jumpsuits',
          'Coats',
          'Leather jackets',
          'Trench coats',
          'Swimwear',
          'Shorts',
        ],
      },
      {
        title: 'Bags',
        items: [
          'Handbags',
          'Clutch bags',
          'Backpacks',
          'Travel bags',
          'Suitcases',
          'Luggage bags',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Sunglasses',
          'Wallets',
          'Belts',
          'Hats',
          'Scarves',
          'Purses',
          'Hair accessories',
          'Pins & brochures',
        ],
      },
      {
        title: 'Jewellery',
        items: [
          'Earrings',
          'Necklaces',
          'Watches',
          'Rings',
          'Bracelets',
          'Jewellery sets',
          'Bag charms',
        ],
      },
      {
        title: 'Shoes',
        items: ['Boots', 'Trainers', 'Flats', 'Sandals', 'Clogs', 'Heels'],
      },
    ],
  },
  {
    title: 'Men',
    subcategories: [
      {
        title: 'Clothing',
        items: [
          'Skirts',
          'Trousers',
          'Tops',
          'Knitwear',
          'Dresses',
          'Jeans',
          'Jackets',
          'Jumpsuits',
          'Coats',
          'Leather jackets',
          'Trench coats',
          'Swimwear',
          'Shorts',
        ],
      },
      {
        title: 'Bags',
        items: [
          'Handbags',
          'Clutch bags',
          'Backpacks',
          'Travel bags',
          'Suitcases',
          'Luggage bags',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Sunglasses',
          'Wallets',
          'Belts',
          'Hats',
          'Scarves',
          'Purses',
          'Hair accessories',
          'Pins & brochures',
        ],
      },
      {
        title: 'Jewellery',
        items: [
          'Earrings',
          'Necklaces',
          'Watches',
          'Rings',
          'Bracelets',
          'Jewellery sets',
          'Bag charms',
        ],
      },
      {
        title: 'Shoes',
        items: ['Boots', 'Trainers', 'Flats', 'Sandals', 'Clogs', 'Heels'],
      },
    ],
  },
  {
    title: 'Children',
    subcategories: [
      {
        title: 'Clothing',
        items: [
          'Skirts',
          'Trousers',
          'Tops',
          'Knitwear',
          'Dresses',
          'Jeans',
          'Jackets',
          'Jumpsuits',
          'Coats',
          'Leather jackets',
          'Trench coats',
          'Swimwear',
          'Shorts',
        ],
      },
      {
        title: 'Bags',
        items: [
          'Handbags',
          'Clutch bags',
          'Backpacks',
          'Travel bags',
          'Suitcases',
          'Luggage bags',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Sunglasses',
          'Wallets',
          'Belts',
          'Hats',
          'Scarves',
          'Purses',
          'Hair accessories',
          'Pins & brochures',
        ],
      },
      {
        title: 'Jewellery',
        items: [
          'Earrings',
          'Necklaces',
          'Watches',
          'Rings',
          'Bracelets',
          'Jewellery sets',
          'Bag charms',
        ],
      },
      {
        title: 'Shoes',
        items: ['Boots', 'Trainers', 'Flats', 'Sandals', 'Clogs', 'Heels'],
      },
    ],
  },
  {
    title: 'Shoes',
    subcategories: [
      {
        title: 'Clothing',
        items: [
          'Skirts',
          'Trousers',
          'Tops',
          'Knitwear',
          'Dresses',
          'Jeans',
          'Jackets',
          'Jumpsuits',
          'Coats',
          'Leather jackets',
          'Trench coats',
          'Swimwear',
          'Shorts',
        ],
      },
      {
        title: 'Bags',
        items: [
          'Handbags',
          'Clutch bags',
          'Backpacks',
          'Travel bags',
          'Suitcases',
          'Luggage bags',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Sunglasses',
          'Wallets',
          'Belts',
          'Hats',
          'Scarves',
          'Purses',
          'Hair accessories',
          'Pins & brochures',
        ],
      },
      {
        title: 'Jewellery',
        items: [
          'Earrings',
          'Necklaces',
          'Watches',
          'Rings',
          'Bracelets',
          'Jewellery sets',
          'Bag charms',
        ],
      },
      {
        title: 'Shoes',
        items: ['Boots', 'Trainers', 'Flats', 'Sandals', 'Clogs', 'Heels'],
      },
    ],
  },
  {
    title: 'Bags',
    subcategories: [
      {
        title: 'Clothing',
        items: [
          'Skirts',
          'Trousers',
          'Tops',
          'Knitwear',
          'Dresses',
          'Jeans',
          'Jackets',
          'Jumpsuits',
          'Coats',
          'Leather jackets',
          'Trench coats',
          'Swimwear',
          'Shorts',
        ],
      },
      {
        title: 'Bags',
        items: [
          'Handbags',
          'Clutch bags',
          'Backpacks',
          'Travel bags',
          'Suitcases',
          'Luggage bags',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Sunglasses',
          'Wallets',
          'Belts',
          'Hats',
          'Scarves',
          'Purses',
          'Hair accessories',
          'Pins & brochures',
        ],
      },
      {
        title: 'Jewellery',
        items: [
          'Earrings',
          'Necklaces',
          'Watches',
          'Rings',
          'Bracelets',
          'Jewellery sets',
          'Bag charms',
        ],
      },
      {
        title: 'Shoes',
        items: ['Boots', 'Trainers', 'Flats', 'Sandals', 'Clogs', 'Heels'],
      },
    ],
  },
  {
    title: 'Accessories & Jewellery',
    subcategories: [
      {
        title: 'Clothing',
        items: [
          'Skirts',
          'Trousers',
          'Tops',
          'Knitwear',
          'Dresses',
          'Jeans',
          'Jackets',
          'Jumpsuits',
          'Coats',
          'Leather jackets',
          'Trench coats',
          'Swimwear',
          'Shorts',
        ],
      },
      {
        title: 'Bags',
        items: [
          'Handbags',
          'Clutch bags',
          'Backpacks',
          'Travel bags',
          'Suitcases',
          'Luggage bags',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Sunglasses',
          'Wallets',
          'Belts',
          'Hats',
          'Scarves',
          'Purses',
          'Hair accessories',
          'Pins & brochures',
        ],
      },
      {
        title: 'Jewellery',
        items: [
          'Earrings',
          'Necklaces',
          'Watches',
          'Rings',
          'Bracelets',
          'Jewellery sets',
          'Bag charms',
        ],
      },
      {
        title: 'Shoes',
        items: ['Boots', 'Trainers', 'Flats', 'Sandals', 'Clogs', 'Heels'],
      },
    ],
  },
  {
    title: 'Homeware',
    subcategories: [
      {
        title: 'Clothing',
        items: [
          'Skirts',
          'Trousers',
          'Tops',
          'Knitwear',
          'Dresses',
          'Jeans',
          'Jackets',
          'Jumpsuits',
          'Coats',
          'Leather jackets',
          'Trench coats',
          'Swimwear',
          'Shorts',
        ],
      },
      {
        title: 'Bags',
        items: [
          'Handbags',
          'Clutch bags',
          'Backpacks',
          'Travel bags',
          'Suitcases',
          'Luggage bags',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Sunglasses',
          'Wallets',
          'Belts',
          'Hats',
          'Scarves',
          'Purses',
          'Hair accessories',
          'Pins & brochures',
        ],
      },
      {
        title: 'Jewellery',
        items: [
          'Earrings',
          'Necklaces',
          'Watches',
          'Rings',
          'Bracelets',
          'Jewellery sets',
          'Bag charms',
        ],
      },
      {
        title: 'Shoes',
        items: ['Boots', 'Trainers', 'Flats', 'Sandals', 'Clogs', 'Heels'],
      },
    ],
  },
  {
    title: 'Books',
    subcategories: [
      {
        title: 'Clothing',
        items: [
          'Skirts',
          'Trousers',
          'Tops',
          'Knitwear',
          'Dresses',
          'Jeans',
          'Jackets',
          'Jumpsuits',
          'Coats',
          'Leather jackets',
          'Trench coats',
          'Swimwear',
          'Shorts',
        ],
      },
      {
        title: 'Bags',
        items: [
          'Handbags',
          'Clutch bags',
          'Backpacks',
          'Travel bags',
          'Suitcases',
          'Luggage bags',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Sunglasses',
          'Wallets',
          'Belts',
          'Hats',
          'Scarves',
          'Purses',
          'Hair accessories',
          'Pins & brochures',
        ],
      },
      {
        title: 'Jewellery',
        items: [
          'Earrings',
          'Necklaces',
          'Watches',
          'Rings',
          'Bracelets',
          'Jewellery sets',
          'Bag charms',
        ],
      },
      {
        title: 'Shoes',
        items: ['Boots', 'Trainers', 'Flats', 'Sandals', 'Clogs', 'Heels'],
      },
    ],
  },
  {
    title: 'Electronics',
    subcategories: [
      {
        title: 'Clothing',
        items: [
          'Skirts',
          'Trousers',
          'Tops',
          'Knitwear',
          'Dresses',
          'Jeans',
          'Jackets',
          'Jumpsuits',
          'Coats',
          'Leather jackets',
          'Trench coats',
          'Swimwear',
          'Shorts',
        ],
      },
      {
        title: 'Bags',
        items: [
          'Handbags',
          'Clutch bags',
          'Backpacks',
          'Travel bags',
          'Suitcases',
          'Luggage bags',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Sunglasses',
          'Wallets',
          'Belts',
          'Hats',
          'Scarves',
          'Purses',
          'Hair accessories',
          'Pins & brochures',
        ],
      },
      {
        title: 'Jewellery',
        items: [
          'Earrings',
          'Necklaces',
          'Watches',
          'Rings',
          'Bracelets',
          'Jewellery sets',
          'Bag charms',
        ],
      },
      {
        title: 'Shoes',
        items: ['Boots', 'Trainers', 'Flats', 'Sandals', 'Clogs', 'Heels'],
      },
    ],
  },
];

const BottomNavMegmenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // State to track the active menu index
  const menuRef = useRef<HTMLDivElement | null>(null); // Ref for the megamenu container
  const toggleLogin = () => {
    setIsLoggedIn(prevState => !prevState);
  };
  // Explicitly type the index parameter as number
  const handleToggleMenu = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Explicitly type the event parameter as MouseEvent
  const handleClickOutside = (event: MouseEvent) => {
    // Check if the click is outside the menu
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setActiveIndex(null); // Close the megamenu
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Add event listener to detect outside clicks

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup event listener on unmount
    };
  }, []);

  return (
    <nav className="header-bottom-navbar navbar-megamenu-area" ref={menuRef}>
      <div className="custom-container">
        <ul className="navbar-nav-list flex gap-10 md:gap-6 w-full">
          {categories.map((category, index) => (
            <li key={category.title} className="navbar-nav-items relative">
              {' '}
              {/* Add relative positioning */}
              <button
                className="text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary"
                onClick={() => handleToggleMenu(index)}
              >
                {category.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Megamenu will be displayed below the ul */}
      {activeIndex !== null && (
        <div className="megamenu-group-items">
          <div className="custom-container">
            <div className="megamenu grid grid-cols-12 gap-6">
              {categories[activeIndex].subcategories.map(subcategory => (
                <div
                  className="megamenu-column col-span-2"
                  key={subcategory.title}
                >
                  <div className="group-category-title">
                    {subcategory.title}
                  </div>
                  <ul className="subcategory-lists">
                    {subcategory.items.map(item => (
                      <li key={item}>
                        <Link href={`/${item.toLowerCase()}`}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <button className="empty:hidden" onClick={toggleLogin}>
        {isLoggedIn ? '' : ''}
      </button>
    </nav>
  );
};

export default BottomNavMegmenu;
