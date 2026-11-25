import type { Metadata } from 'next';
import FaqSection from '@/components/seo/FaqSection';
import SeoTrail from '@/components/seo/SeoTrail';
import { SITE_FAQS } from '@/lib/seoSchema';
import { pageMetadata } from '@/lib/siteSeo';

const title = 'FAQ';
const description =
  'Answers about Angelpage, the charity marketplace that started in the United States and also sells in Canada and the United Kingdom.';

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: '/faq',
  keywords: [
    'Angelpage FAQ',
    'charity marketplace',
    'sell pre-loved for charity',
    'Angelpage USA Canada UK',
    'how Angelpage works',
  ],
});

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'FAQ', path: '/faq' },
];

export default function FaqPage() {
  return (
    <>
      <SeoTrail
        crumbs={crumbs}
        title={title}
        description={description}
        faqs={SITE_FAQS}
      />
      <div className="custom-container pb-6 pt-6">
        <h1 className="font-primary text-[44px] leading-none text-[#0B0112] sm:text-[34px]">
          Questions about Angelpage
        </h1>
        <p className="font-secondary mt-4 max-w-3xl text-base leading-7 text-[#3B055C]">
          These answers describe the marketplace: where it sells, how a sale can
          support a charity, and how cookies work.
        </p>
      </div>
      <FaqSection items={SITE_FAQS} heading="All common questions" />
    </>
  );
}
