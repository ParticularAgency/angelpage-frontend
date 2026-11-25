import type { MetadataRoute } from 'next';
import { INDEXABLE, SITE_URL } from '@/lib/siteSeo';

const PRIVATE_PATHS = [
  '/admin',
  '/auth',
  '/checkout',
  '/messaging',
  '/user',
  '/favourite',
  '/internal-home',
  '/product/post-product',
  '/product/bulk-list',
  '/charity/account',
  '/charity/complete-registrations',
  '/events/donation',
];

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'Google-Extended',
          'GoogleOther',
          'ClaudeBot',
          'Claude-User',
          'anthropic-ai',
          'PerplexityBot',
          'Perplexity-User',
          'Applebot',
          'CCBot',
        ],
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
