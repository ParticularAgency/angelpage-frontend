import { categoriesData as fallbackCategories } from '@/libs/categoriesData';

export type CategorySub = { id: string; name: string };
export type Category = {
  id: string;
  name: string;
  subCategories: CategorySub[];
};

let cached: Category[] | null = null;

/**
 * Load categories from backend `/categories` with static fallback.
 */
export async function fetchCategories(force = false): Promise<Category[]> {
  if (cached && !force) return cached;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      { next: { revalidate: 3600 } } as RequestInit
    );
    if (!res.ok) throw new Error('categories fetch failed');
    const data = await res.json();
    if (Array.isArray(data?.categories) && data.categories.length > 0) {
      const categories = data.categories as Category[];
      cached = categories;
      return categories;
    }
  } catch {
    // fall through to static
  }

  const fallback = fallbackCategories.categories as Category[];
  cached = fallback;
  return fallback;
}

export function getCachedCategories(): Category[] {
  return cached || (fallbackCategories.categories as Category[]);
}
