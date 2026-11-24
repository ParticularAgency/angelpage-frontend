import { REVALIDATE } from './revalidate';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type FetchOptions = {
  revalidate?: number;
  tags?: string[];
  params?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, params?: FetchOptions['params']) {
  const url = new URL(
    path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? path : `/${path}`}`
  );
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

export async function serverFetch<T>(
  path: string,
  { revalidate = REVALIDATE.CATALOG, tags, params }: FetchOptions = {}
): Promise<T | null> {
  if (!API_URL) return null;

  try {
    const response = await fetch(buildUrl(path, params), {
      next: { revalidate, tags },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export type BlogPostRecord = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  category?: string;
  authorName?: string;
  authorAvatar?: string;
  publishedAt?: string;
};

export type BlogListResponse = { posts: BlogPostRecord[] };
export type BlogDetailResponse = { post: BlogPostRecord };

export type EventFundAllocation = {
  id: string;
  label: string;
  description?: string;
  percent?: number;
};

export type CommunityEventRecord = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  description?: string;
  eventType: string;
  coverImage?: string;
  authorName?: string;
  authorId?: string;
  authorRole?: string;
  donationGoal?: number;
  donationRaised?: number;
  donationUrl?: string;
  liveStreamUrl?: string;
  pollQuestion?: string;
  pollOptions?: { text: string; votes: number }[];
  startAt?: string;
  endAt?: string;
  status?: string;
  featuredOnHomepage?: boolean;
  category?: string;
  charityId?: string;
  fundAllocations?: EventFundAllocation[];
};

export type EventDonationReceipt = {
  donationNumber: string;
  amount: number;
  currency: string;
  fundId: string;
  fundLabel: string;
  donorName: string;
  donorEmail: string;
  eventTitle: string;
  eventSlug: string;
  charityName?: string;
  paidAt?: string;
  paymentStatus: string;
  fundAllocations?: EventFundAllocation[];
};

export type EventsListResponse = { events: CommunityEventRecord[] };
export type EventDetailResponse = { event: CommunityEventRecord };

export type CharityRecord = {
  _id: string;
  storefrontId: string;
  charityName: string;
  charityNumber?: string;
  description?: string;
  profileImage?: string;
  contact?: { phone?: string; website?: string };
};

export type CharitiesListResponse = {
  charities: CharityRecord[];
  totalPages?: number;
  currentPage?: number;
};

export type ProductRecord = {
  _id?: string;
  id?: string;
  slug?: string;
  name: string;
  price: number;
  charityProfit?: number;
  sellerProfit?: number;
  sellerSharePercent?: number;
  fulfillmentType?: 'uk_shipping' | 'personal_delivery' | 'self_collect' | 'local_only';
  sellAreas?: string[];
  additionalInfo?: string;
  description?: string;
  condition?: string;
  brand?: string;
  material?: string;
  color?: string;
  size?: string;
  category?: string;
  images?: { url: string }[];
  charity?: { charityName?: string };
  selectCharityName?: string;
  checkoutMode?: string;
  ebayAffiliateUrl?: string;
  [key: string]: unknown;
};

export type ProductDetailResponse = { product: ProductRecord };

export function mapBlogToCard(post: BlogPostRecord) {
  return {
    id: post.slug || post._id,
    title: post.title,
    tag: post.category || 'stories',
    description: post.excerpt,
    image: post.coverImage || '/images/blog/blog1.jpg',
    date: post.publishedAt,
    author: post.authorName,
  };
}

export async function fetchBlogPosts(limit?: number) {
  const data = await serverFetch<BlogListResponse>('/blog', {
    revalidate: REVALIDATE.CATALOG,
    tags: ['blog-list'],
    params: limit ? { limit } : undefined,
  });
  return data?.posts ?? [];
}

export async function fetchBlogBySlug(slug: string) {
  const data = await serverFetch<BlogDetailResponse>(`/blog/slug/${slug}`, {
    revalidate: REVALIDATE.CATALOG,
    tags: [`blog-${slug}`],
  });
  return data?.post ?? null;
}

export async function fetchEvents(eventType?: string) {
  const data = await serverFetch<EventsListResponse>('/events', {
    revalidate: REVALIDATE.EVENTS,
    tags: ['events-list'],
    params: { limit: 24, ...(eventType ? { eventType } : {}) },
  });
  return data?.events ?? [];
}

export async function fetchEventBySlug(slug: string) {
  const data = await serverFetch<EventDetailResponse>(`/events/slug/${slug}`, {
    revalidate: REVALIDATE.EVENTS,
    tags: [`event-${slug}`],
  });
  return data?.event ?? null;
}

export async function fetchCharitiesPage(page = 1, limit = 12, search = '') {
  return serverFetch<CharitiesListResponse>('/charity/charities', {
    revalidate: REVALIDATE.CATALOG,
    tags: ['charities-list'],
    params: { page, limit, search },
  });
}

export async function fetchProductDetails(slugOrId: string) {
  const data = await serverFetch<ProductDetailResponse>(
    `/products/details/${slugOrId}`,
    {
      revalidate: REVALIDATE.CATALOG,
      tags: [`product-${slugOrId}`],
      params: { isArchived: false },
    }
  );
  return data?.product ?? null;
}
