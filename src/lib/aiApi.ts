import axios from 'axios';
import { categoriesData } from '@/libs/categoriesData';

export function resolveCategoryId(categoryName?: string) {
  if (!categoryName) return null;
  const normalized = categoryName.trim().toLowerCase();
  const cat = categoriesData.categories.find(
    c =>
      c.id === normalized ||
      c.name.toLowerCase() === normalized,
  );
  return cat?.id || null;
}

export function resolveSubcategoryId(categoryId: string, subName?: string) {
  if (!categoryId || !subName) return null;
  const cat = categoriesData.categories.find(c => c.id === categoryId);
  if (!cat) return null;
  const normalized = subName.trim().toLowerCase();
  const sub = cat.subCategories.find(
    s => s.id === normalized || s.name.toLowerCase() === normalized,
  );
  return sub?.id || null;
}

const api = () => process.env.NEXT_PUBLIC_API_URL;

export type ListingAiResult = {
  suggestedTitle?: string;
  suggestedDescription?: string;
  title?: string;
  brand?: string;
  color?: string;
  material?: string;
  category?: string;
  subcategory?: string;
  condition?: string;
  size?: string;
  additionalInfo?: string;
  searchKeywords?: string[];
};

export type BlogAiResult = {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  keywords?: string[];
  slugSuggestion?: string;
};

export type EventAiResult = {
  title?: string;
  excerpt?: string;
  description?: string;
  category?: string;
  eventType?: string;
  topic?: string;
  pollQuestion?: string;
  pollOptions?: string[];
  keywords?: string[];
};

export type SmartSearchResult = {
  intent?: string;
  searchTerms?: string[];
  products?: Array<{
    _id: string;
    name: string;
    brand?: string;
    price?: number;
    images?: { url: string }[];
  }>;
};

const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export async function checkAiStatus() {
  const res = await axios.get(`${api()}/ai/status`);
  return res.data as { enabled: boolean; model: string };
}

export async function analyzeProductImage(file: File, token?: string) {
  const body = new FormData();
  body.append('image', file);
  const res = await axios.post(`${api()}/ai/analyze-image`, body, {
    headers: { ...authHeaders(token), 'Content-Type': 'multipart/form-data' },
  });
  return res.data as ListingAiResult & { success?: boolean };
}

export async function enhanceListing(
  fields: Record<string, unknown>,
  token?: string,
) {
  const res = await axios.post(`${api()}/ai/enhance-listing`, fields, {
    headers: authHeaders(token),
  });
  return res.data as ListingAiResult & { success?: boolean };
}

export async function enhanceBlogSeo(
  fields: Record<string, unknown>,
  token?: string,
) {
  const res = await axios.post(`${api()}/ai/enhance-blog`, fields, {
    headers: authHeaders(token),
  });
  return res.data as BlogAiResult & { success?: boolean };
}

export async function suggestEvent(
  fields: Record<string, unknown>,
  token?: string,
) {
  const res = await axios.post(`${api()}/ai/suggest-event`, fields, {
    headers: authHeaders(token),
  });
  return res.data as EventAiResult & { success?: boolean };
}

export async function smartProductSearch(query: string) {
  const res = await axios.post(`${api()}/ai/smart-search`, { query });
  return res.data as SmartSearchResult & { success?: boolean };
}

export async function searchProductsByImage(file: File) {
  const body = new FormData();
  body.append('image', file);
  const res = await axios.post(`${api()}/ai/search-by-image`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data as SmartSearchResult & {
    analysis?: ListingAiResult;
    success?: boolean;
  };
}
