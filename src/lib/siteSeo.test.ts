import { describe, expect, it } from 'vitest';
import { absoluteUrl, pageMetadata } from '@/lib/siteSeo';

describe('absoluteUrl', () => {
  it('points the homepage at the public shop', () => {
    expect(absoluteUrl('/')).toBe('https://www.angelpage.shop/');
  });

  it('keeps a category query on the shop path', () => {
    expect(absoluteUrl('/product?category=women')).toBe(
      'https://www.angelpage.shop/product?category=women'
    );
  });
});

describe('pageMetadata', () => {
  it('sets the canonical URL and the share title', () => {
    const meta = pageMetadata({
      title: 'FAQ',
      description: 'Answers about Angelpage.',
      path: '/faq',
    });

    expect(meta.alternates).toMatchObject({
      canonical: 'https://www.angelpage.shop/faq',
    });
    expect(meta.openGraph).toMatchObject({
      title: 'FAQ | Angelpage',
      url: 'https://www.angelpage.shop/faq',
    });
    expect(meta.twitter).toMatchObject({
      title: 'FAQ | Angelpage',
    });
  });
});
