import type { Metadata } from 'next';
import ProductsPage from '@/components/product/ProductsPage';
import SeoTrail from '@/components/seo/SeoTrail';
import { shopCrumbs } from '@/lib/seoSchema';
import { pageMetadata } from '@/lib/siteSeo';

type ShopParams = {
  category?: string;
  subcategory?: string;
};

function shopCopy(category?: string, subcategory?: string) {
  const crumbs = shopCrumbs(category, subcategory);
  const current = crumbs[crumbs.length - 1];
  const parent = crumbs.length > 2 ? crumbs[crumbs.length - 2] : null;
  const title =
    crumbs.length === 2
      ? 'Shop'
      : parent && current.name !== 'Shop'
        ? `${current.name}`
        : current.name;
  const subject =
    crumbs.length === 2 ? 'pre-loved goods' : current.name.toLowerCase();
  const description = `Shop ${subject} on Angelpage. Sellers list pre-loved items and choose how much of each sale goes to a charity in the USA, Canada, or the UK.`;
  const path = current.path;
  const keywords = [
    current.name,
    'Angelpage shop',
    'pre-loved',
    'charity marketplace',
    'USA',
    'Canada',
    'United Kingdom',
  ];
  return { crumbs, title, description, path, keywords };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ShopParams>;
}): Promise<Metadata> {
  const { category, subcategory } = await searchParams;
  const copy = shopCopy(category, subcategory);
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: copy.path,
    keywords: copy.keywords,
  });
}

export default async function ProductsLists({
  searchParams,
}: {
  searchParams: Promise<ShopParams>;
}) {
  const { category, subcategory } = await searchParams;
  const copy = shopCopy(category, subcategory);

  return (
    <>
      <SeoTrail
        crumbs={copy.crumbs}
        title={copy.title}
        description={copy.description}
      />
      <div className="products-page-main-wrapper">
        <ProductsPage />
      </div>
    </>
  );
}
