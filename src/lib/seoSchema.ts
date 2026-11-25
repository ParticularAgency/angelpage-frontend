import { categoriesData } from '@/libs/categoriesData';
import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from '@/lib/siteSeo';

export type Crumb = { name: string; path: string };

export type FaqItem = { question: string; answer: string };

export const SITE_FAQS: FaqItem[] = [
  {
    question: 'What is Angelpage?',
    answer:
      'Angelpage is a charity marketplace. People buy and sell pre-loved goods, and the seller chooses how much of the sale goes to a charity. The shop started in the United States and also sells in Canada and the United Kingdom.',
  },
  {
    question: 'Where does Angelpage sell?',
    answer:
      'Angelpage sells in the United States, Canada, and the United Kingdom. The marketplace started in the United States.',
  },
  {
    question: 'How does a purchase support a charity?',
    answer:
      'The seller lists a real item, chooses a charity, and chooses the split. The buyer pays for the item. The charity share from that sale goes to the chosen charity.',
  },
  {
    question: 'What can I sell on Angelpage?',
    answer:
      'Sellers list pre-loved goods such as clothing, shoes, bags, jewellery, accessories, homeware, books, and electronics.',
  },
  {
    question: 'Which currency is used at checkout?',
    answer:
      'Checkout uses US dollars in the United States, Canadian dollars in Canada, and pounds in the United Kingdom. The listed amount stays the same number in the local currency.',
  },
  {
    question: 'How do I change my cookie choices?',
    answer:
      'Use the cookie button at the bottom left of any page, or open the cookie settings page. Necessary cookies stay on. Analytics and marketing cookies stay off until you allow them.',
  },
  {
    question: 'Who can use Angelpage?',
    answer:
      'Shoppers can buy pre-loved goods. Sellers can list items for a charity. Charities can have a storefront. The public pages are the shop, events, reels, blog, and charity directory.',
  },
];

export const HOME_FAQS = SITE_FAQS.slice(0, 4);

export const SITE_SECTIONS: Crumb[] = [
  { name: 'Shop', path: '/product' },
  { name: 'How it works', path: '/how-it-works' },
  { name: 'Events', path: '/events' },
  { name: 'Reels', path: '/reels' },
  { name: 'Blog', path: '/blog' },
  { name: 'Find a charity', path: '/charity/find-a-charity' },
  { name: 'About', path: '/about' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
];

export function shopCrumbs(category?: string, subcategory?: string): Crumb[] {
  const crumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/product' },
  ];
  if (!category) return crumbs;

  const cat = categoriesData.categories.find(item => item.id === category);
  const catName = cat?.name || category;
  const catPath = `/product?category=${encodeURIComponent(category)}`;
  crumbs.push({ name: catName, path: catPath });

  if (subcategory) {
    const sub = cat?.subCategories.find(item => item.id === subcategory);
    crumbs.push({
      name: sub?.name || subcategory,
      path: `${catPath}&subcategory=${encodeURIComponent(subcategory)}`,
    });
  }
  return crumbs;
}

export function graph(
  nodes: Array<Record<string, unknown> | null | undefined | false>
) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}

export function breadcrumbNode(crumbs: Crumb[]) {
  const current = absoluteUrl(crumbs[crumbs.length - 1]?.path || '/');
  return {
    '@type': 'BreadcrumbList',
    '@id': `${current}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function webPageNode({
  title,
  description,
  path,
  crumbs,
}: {
  title: string;
  description: string;
  path: string;
  crumbs: Crumb[];
}) {
  const url = absoluteUrl(path);
  const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2] : null;
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`,
    description,
    inLanguage: 'en-US',
    isPartOf: [
      { '@id': `${SITE_URL}/#website` },
      ...(parent ? [{ '@id': `${absoluteUrl(parent.path)}#webpage` }] : []),
    ],
    about: { '@id': `${SITE_URL}/#organization` },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function faqNode(path: string, items: FaqItem[]) {
  const url = absoluteUrl(path);
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    isPartOf: { '@id': `${url}#webpage` },
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function pageGraph({
  title,
  description,
  path,
  crumbs,
  faqs,
  extra = [],
}: {
  title: string;
  description: string;
  path: string;
  crumbs: Crumb[];
  faqs?: FaqItem[];
  extra?: Array<Record<string, unknown>>;
}) {
  return graph([
    webPageNode({ title, description, path, crumbs }),
    breadcrumbNode(crumbs),
    faqs?.length ? faqNode(path, faqs) : null,
    ...extra,
  ]);
}

export function homeGraph() {
  const url = absoluteUrl('/');
  return graph([
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      inLanguage: 'en-US',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      hasPart: SITE_SECTIONS.map(section => ({
        '@type': 'WebPage',
        name: section.name,
        url: absoluteUrl(section.path),
      })),
    },
    breadcrumbNode([{ name: 'Home', path: '/' }]),
    faqNode('/', HOME_FAQS),
    {
      '@type': 'ItemList',
      '@id': `${url}#sections`,
      name: 'Angelpage sections',
      itemListElement: SITE_SECTIONS.map((section, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: section.name,
        url: absoluteUrl(section.path),
      })),
    },
  ]);
}
