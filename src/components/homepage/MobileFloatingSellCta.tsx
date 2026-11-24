'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const HOME_PATHS = ['/', '/internal-home'];

const MobileFloatingSellCta = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isHome =
    HOME_PATHS.includes(pathname || '') ||
    pathname?.startsWith('/homepage');

  if (!isHome) return null;

  const sellHref = session?.user?.id
    ? '/product/post-product'
    : '/auth/register?intent=sell';

  return (
    <div className="hidden sm:block fixed bottom-[92px] inset-x-0 z-998 px-4 pointer-events-none">
      <Link
        href={sellHref}
        className="pointer-events-auto mx-auto flex max-w-md items-center justify-center gap-2 rounded-full bg-[#611192] px-6 py-3.5 text-white shadow-lg shadow-[#611192]/30 font-secondary text-sm font-semibold hover:bg-[#4d0d75] transition-colors"
      >
        Start selling
        <span aria-hidden className="text-lg leading-none">
          →
        </span>
      </Link>
    </div>
  );
};

export default MobileFloatingSellCta;
