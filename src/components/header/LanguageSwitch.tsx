'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from '@/i18n/LocaleProvider';
import type { Locale } from '@/i18n/messages';

const OPTIONS: Locale[] = ['en', 'fr'];

export default function LanguageSwitch({
  tone = 'light',
}: {
  tone?: 'light' | 'dark';
}) {
  const { locale, setLocale, t } = useLocale();
  const pathname = usePathname() || '/';
  const onDark = tone === 'dark';

  return (
    <div
      role="group"
      aria-label={t('lang.label')}
      className={`inline-flex shrink-0 items-center rounded-full p-0.5 ${
        onDark ? 'bg-white/10' : 'bg-[#F2E8F8]'
      }`}
    >
      {OPTIONS.map(option => {
        const active = locale === option;
        return (
          <a
            key={option}
            href={`/api/locale?lang=${option}&next=${encodeURIComponent(pathname)}`}
            aria-current={active ? 'true' : undefined}
            onClick={event => {
              event.preventDefault();
              setLocale(option);
            }}
            className={`min-w-9 rounded-full px-2.5 py-1 text-center text-[11px] font-semibold tracking-[0.08em] ${
              active
                ? 'bg-[#611192] text-white'
                : onDark
                  ? 'text-white'
                  : 'text-[#3B055C]'
            }`}
          >
            {t(`lang.${option}`)}
          </a>
        );
      })}
    </div>
  );
}
