import Link from 'next/link';
import type { FaqItem } from '@/lib/seoSchema';

export default function FaqSection({
  items,
  heading = 'Common questions',
  showAllLink = false,
}: {
  items: FaqItem[];
  heading?: string;
  showAllLink?: boolean;
}) {
  return (
    <section
      className="bg-[#FCF2FF] py-16 sm:py-10"
      aria-labelledby="angelpage-faq-heading"
    >
      <div className="custom-container max-w-4xl">
        <h2
          id="angelpage-faq-heading"
          className="font-primary text-[40px] leading-none text-[#0B0112] sm:text-[32px]"
        >
          {heading}
        </h2>
        <div className="mt-8 flex flex-col gap-4">
          {items.map(item => (
            <article
              key={item.question}
              className="rounded-3xl bg-white px-6 py-5"
            >
              <h3 className="font-primary text-[26px] leading-tight text-[#0B0112]">
                {item.question}
              </h3>
              <p className="font-secondary mt-2 text-base leading-7 text-[#3B055C]">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
        {showAllLink ? (
          <p className="font-secondary mt-6 text-base">
            <Link href="/faq" className="text-[#611192] underline">
              Read all common questions
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
