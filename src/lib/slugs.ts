export function isMongoObjectId(value?: string | null): boolean {
  return /^[a-f\d]{24}$/i.test(String(value || ''));
}

export function productDetailPath(slug?: string | null): string {
  if (!slug) return '/product';
  return `/product/${slug}`;
}

export function blogDetailPath(slug?: string | null): string {
  if (!slug) return '/blog';
  return `/blog/${slug}`;
}

export function eventDetailPath(slug?: string | null): string {
  if (!slug) return '/events';
  return `/events/${slug}`;
}

export type ReelsFilterParams = {
  kind?: string;
  tag?: string;
  charityId?: string;
  item?: string;
};

export function buildReelsUrl(filters: ReelsFilterParams = {}): string {
  const params = new URLSearchParams();
  if (filters.kind) params.set('kind', filters.kind);
  if (filters.tag) params.set('tag', filters.tag);
  if (filters.charityId) params.set('charityId', filters.charityId);
  if (filters.item) params.set('item', filters.item);
  const query = params.toString();
  return query ? `/reels?${query}` : '/reels';
}
