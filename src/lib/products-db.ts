import { Product, ProductVariant, PRODUCTS } from './products';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjljaljfmrqocnfglrij.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbGphbGpmbXJxb2NuZmdscmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTE2NTMsImV4cCI6MjEwNDM4NzY1M30.ITrdxfCFOfQMmSPPBq8w0MPTzgaGqC2Qy8xdvWSX7Bk';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

// Revalidation interval in seconds
export const REVALIDATE_INTERVAL = 60;
export const PRODUCTS_CACHE_TAG = 'products';

// Slugify helper
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[\s—_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Normalizes any database row (or fallback product) into the strict Product interface
 */
export function normalizeProduct(row: Record<string, unknown>): Product {
  const id = Number(row.id) || 0;
  const fallback = PRODUCTS.find((p) => p.id === id);

  // Slug determination
  let slug = (row.slug as string) || fallback?.slug || '';
  if (!slug) {
    slug = slugify((row.name as string) || `produkt-${id}`);
  }

  // Parse images
  let images: string[] = [];
  if (Array.isArray(row.images)) {
    images = row.images.filter((img) => typeof img === 'string');
  } else if (typeof row.images === 'string') {
    try {
      images = JSON.parse(row.images);
    } catch {
      images = [row.images];
    }
  }
  if (images.length === 0 && fallback) {
    images = fallback.images;
  }
  if (images.length === 0) {
    images = ['/assets/durag_silk_black.png'];
  }

  // Parse colors
  let colors: Array<{ name: string; hex: string }> = [];
  if (Array.isArray(row.colors)) {
    colors = row.colors as Array<{ name: string; hex: string }>;
  } else if (typeof row.colors === 'string') {
    try {
      colors = JSON.parse(row.colors);
    } catch {
      colors = [];
    }
  }
  if (colors.length === 0 && fallback?.colors) {
    colors = fallback.colors;
  }

  // Parse or synthesize variants
  let variants: ProductVariant[] = [];
  if (Array.isArray(row.variants)) {
    variants = row.variants as ProductVariant[];
  } else if (typeof row.variants === 'string') {
    try {
      variants = JSON.parse(row.variants);
    } catch {
      variants = [];
    }
  }
  if (variants.length === 0 && colors.length > 0) {
    variants = colors.map((c) => ({
      name: c.name,
      hex: c.hex,
      value: c.name,
      price: Number(row.price) || 79,
      stock: Number(row.stock) || 10,
    }));
  }

  // Parse reviews
  let reviews: Array<{ author: string; rating: number; comment: string; date: string }> = [];
  if (Array.isArray(row.reviews)) {
    reviews = row.reviews as Array<{ author: string; rating: number; comment: string; date: string }>;
  } else if (typeof row.reviews === 'string') {
    try {
      reviews = JSON.parse(row.reviews);
    } catch {
      reviews = [];
    }
  }
  if (reviews.length === 0 && fallback?.reviews) {
    reviews = fallback.reviews;
  }

  // Determine if featured (bestseller)
  const isFeatured = Boolean(
    row.is_featured ??
      row.isFeatured ??
      (fallback?.isFeatured || [1160, 1161, 1335, 1365].includes(id))
  );

  const price = Number(row.price) || fallback?.price || 79.0;
  const compareAtPrice = row.compare_at_price
    ? Number(row.compare_at_price)
    : (row.compareAtPrice ? Number(row.compareAtPrice) : undefined);

  return {
    id,
    slug,
    name: (row.name as string) || fallback?.name || 'Warsaw Durag',
    nameEn: (row.name_en as string) || (row.nameEn as string) || fallback?.nameEn || (row.name as string),
    description: (row.description as string) || fallback?.description || '',
    price,
    compareAtPrice,
    images,
    category: ((row.category as string) || fallback?.category || 'silk') as Product['category'],
    categoryLabel: (row.category_label as string) || (row.categoryLabel as string) || fallback?.categoryLabel || 'Durag Premium',
    material: (row.material as string) || fallback?.material || '100% Jedwab Morwowy',
    storyDescription: (row.story_description as string) || fallback?.storyDescription,
    variants,
    colors,
    reviews,
    stock: row.stock !== undefined ? Number(row.stock) : (fallback?.stock ?? 10),
    isFeatured,
    createdAt: (row.created_at as string) || fallback?.createdAt || new Date().toISOString(),
    updatedAt: (row.updated_at as string) || undefined,
    visible: row.visible !== undefined ? Boolean(row.visible) : true,
  };
}

export interface FetchProductsOptions {
  category?: string;
  featuredOnly?: boolean;
  search?: string;
  limit?: number;
}

/**
 * Executes a cached REST query to Supabase PostgREST endpoint with Next.js revalidation
 */
async function querySupabaseProducts(queryString: string): Promise<Record<string, unknown>[] | null> {
  const endpoint = `${SUPABASE_URL}/rest/v1/products?${queryString}`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: REVALIDATE_INTERVAL,
        tags: [PRODUCTS_CACHE_TAG],
      },
    });

    if (!res.ok) {
      console.warn(`[Supabase DB] Query failed (${res.status} ${res.statusText}) on ${endpoint}`);
      return null;
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return null;
    }

    return data as Record<string, unknown>[];
  } catch (error) {
    console.warn('[Supabase DB] Network error, falling back to local dataset:', error);
    return null;
  }
}

/**
 * Fetch all visible products with optional filters (category, featured, limit, search)
 */
export async function fetchProducts(options?: FetchProductsOptions): Promise<Product[]> {
  const queryParams = new URLSearchParams();
  queryParams.set('select', '*');
  queryParams.set('visible', 'eq.true');
  queryParams.set('order', 'id.asc');

  if (options?.category && options.category !== 'all') {
    queryParams.set('category', `eq.${options.category}`);
  }

  if (options?.limit) {
    queryParams.set('limit', String(options.limit));
  }

  const rawData = await querySupabaseProducts(queryParams.toString());

  let products: Product[];

  if (rawData && rawData.length > 0) {
    products = rawData.map(normalizeProduct);
  } else {
    // Graceful fallback to static product catalog
    products = PRODUCTS.map((p) => normalizeProduct(p as unknown as Record<string, unknown>));

    if (options?.category && options.category !== 'all') {
      products = products.filter((p) => p.category === options.category);
    }
  }

  if (options?.featuredOnly) {
    products = products.filter((p) => p.isFeatured);
  }

  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (options?.limit && products.length > options.limit) {
    products = products.slice(0, options.limit);
  }

  return products;
}

/**
 * Fetch single product by slug
 */
export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  const normalizedSlug = slug.toLowerCase().trim();

  // Try direct fetch from Supabase
  const rawData = await querySupabaseProducts(
    `select=*&visible=eq.true`
  );

  let allProducts: Product[];

  if (rawData && rawData.length > 0) {
    allProducts = rawData.map(normalizeProduct);
  } else {
    allProducts = PRODUCTS.map((p) => normalizeProduct(p as unknown as Record<string, unknown>));
  }

  return allProducts.find((p) => p.slug === normalizedSlug);
}

/**
 * Fetch top bestsellers (featured products)
 */
export async function fetchBestsellers(limit = 4): Promise<Product[]> {
  const all = await fetchProducts();
  const featured = all.filter((p) => p.isFeatured);

  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }

  // If fewer flagged featured products, append top products to fill limit
  const remaining = all.filter((p) => !featured.some((f) => f.id === p.id));
  return [...featured, ...remaining].slice(0, limit);
}

/**
 * Search products by text query
 */
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || !query.trim()) {
    return [];
  }
  return fetchProducts({ search: query.trim() });
}

/**
 * Fetch products for a specific category
 */
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  return fetchProducts({ category });
}

/**
 * Seed database if table is empty
 */
export async function seedProductsIfEmpty(): Promise<{ seeded: boolean; count: number; message: string }> {
  try {
    const existing = await querySupabaseProducts('select=id&limit=1');
    if (existing && existing.length > 0) {
      return {
        seeded: false,
        count: existing.length,
        message: 'Baza danych zawiera już produkty — seed nie był wymagany.',
      };
    }

    // Insert fallback products into Supabase
    const payload = PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      name_en: p.nameEn || p.name,
      price: p.price,
      category: p.category,
      category_label: p.categoryLabel,
      material: p.material,
      description: p.description,
      images: p.images,
      colors: p.colors,
      reviews: p.reviews,
      stock: 10,
      visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        seeded: false,
        count: 0,
        message: `Błąd podczas seedowania bazy: ${errText}`,
      };
    }

    return {
      seeded: true,
      count: payload.length,
      message: `Pomyślnie zasilano bazę danych ${payload.length} produktami.`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Nieznany błąd';
    return {
      seeded: false,
      count: 0,
      message: `Błąd seedowania: ${errorMsg}`,
    };
  }
}
