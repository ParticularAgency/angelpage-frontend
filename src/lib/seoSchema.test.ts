import { describe, expect, it } from 'vitest';
import { faqNode, shopCrumbs, SITE_FAQS } from '@/lib/seoSchema';

describe('shopCrumbs', () => {
  it('nests a category under the shop', () => {
    expect(shopCrumbs('women')).toEqual([
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/product' },
      { name: 'Women', path: '/product?category=women' },
    ]);
  });

  it('nests a subcategory under its category', () => {
    const crumbs = shopCrumbs('shoes', 'boots');
    expect(crumbs.map(crumb => crumb.name)).toEqual([
      'Home',
      'Shop',
      'Shoes',
      'Boots',
    ]);
  });
});

describe('faq schema', () => {
  it('uses the same questions that are written on the page', () => {
    const node = faqNode('/faq', SITE_FAQS);
    const questions = node.mainEntity.map(item => item.name);
    expect(questions).toContain('What is Angelpage?');
    expect(node.mainEntity[0].acceptedAnswer.text.length).toBeGreaterThan(40);
  });
});
