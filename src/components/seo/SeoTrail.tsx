import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { pageGraph, type Crumb, type FaqItem } from '@/lib/seoSchema';

export default function SeoTrail({
  crumbs,
  title,
  description,
  faqs,
  hideNav = false,
}: {
  crumbs: Crumb[];
  title: string;
  description: string;
  faqs?: FaqItem[];
  hideNav?: boolean;
}) {
  const path = crumbs[crumbs.length - 1]?.path || '/';

  return (
    <>
      <JsonLd
        data={pageGraph({
          title,
          description,
          path,
          crumbs,
          faqs,
        })}
      />
      {hideNav ? null : (
        <nav aria-label="Breadcrumb" className="custom-container pt-8">
          <ol className="flex flex-wrap items-center gap-2 font-secondary text-sm text-[#3B055C]">
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              return (
                <li
                  key={`${crumb.path}-${crumb.name}`}
                  className="flex items-center gap-2"
                >
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  {last ? (
                    <span className="text-[#0B0112]">{crumb.name}</span>
                  ) : (
                    <Link
                      href={crumb.path}
                      className="text-[#611192] underline"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </>
  );
}
