import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, PRODUCTS, getAllProducts, getProductBySlug, getProductsByCategory } from './products';

// Read credentials from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://icvgsnenbgyvpwmsccym.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljdmdzbmVuYmd5dnB3bXNjY3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTIyMjgsImV4cCI6MjA5NjU4ODIyOH0.ls3_Echd4hZkDYJcwr4Wx0YT2gnG36-Me76fwqIMd2I';

// Check if credentials look configured
export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  !SUPABASE_URL.includes('twoj-projekt') &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_ANON_KEY.includes('twoj-klucz')
);

// Global singleton client for browser
let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return browserClient;
}

// Client for Server-Side Rendering (SSR)
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Slug generator helper
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

// Mapper: Supabase row -> Product interface
export function mapSupabaseRowToProduct(row: any): Product {
  // Find fallback matching by ID to retain storyDescription or rich details if missing
  const fallback = PRODUCTS.find((p) => p.id === Number(row.id));

  // Determine slug
  let slug = row.slug;
  if (!slug && fallback) {
    slug = fallback.slug;
  }
  if (!slug) {
    slug = slugify(row.name || `product-${row.id}`);
  }

  // Determine images
  let images: string[] = [];
  if (Array.isArray(row.images) && row.images.length > 0) {
    images = row.images;
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

  // Determine colors
  let colors = row.colors;
  if (typeof colors === 'string') {
    try {
      colors = JSON.parse(colors);
    } catch {
      colors = [];
    }
  }
  if ((!colors || !Array.isArray(colors) || colors.length === 0) && fallback) {
    colors = fallback.colors;
  }

  // Determine reviews
  let reviews = row.reviews;
  if (typeof reviews === 'string') {
    try {
      reviews = JSON.parse(reviews);
    } catch {
      reviews = [];
    }
  }
  if ((!reviews || !Array.isArray(reviews) || reviews.length === 0) && fallback) {
    reviews = fallback.reviews;
  }

  return {
    id: Number(row.id),
    slug,
    name: row.name || fallback?.name || 'Warsaw Durag',
    nameEn: row.name_en || row.nameEn || fallback?.nameEn || row.name || 'Warsaw Durag',
    price: Number(row.price) || fallback?.price || 79.0,
    category: (row.category || fallback?.category || 'silk') as Product['category'],
    categoryLabel: row.category_label || row.categoryLabel || fallback?.categoryLabel || '100% Jedwab Morwowy',
    material: row.material || fallback?.material || '100% Jedwab Morwowy (19 Momme)',
    description: row.description || fallback?.description || '',
    storyDescription: row.story_description || row.storyDescription || fallback?.storyDescription,
    images,
    colors: colors || [],
    reviews: reviews || [],
    stock: row.stock !== undefined ? Number(row.stock) : (fallback?.stock ?? 10),
    visible: row.visible !== undefined ? Boolean(row.visible) : (fallback?.visible ?? true),
  };
}

let hasLoggedFallbackWarning = false;
function logFallbackOnce(reason: string) {
  if (!hasLoggedFallbackWarning && process.env.NODE_ENV !== 'production') {
    console.info(`[WDS Supabase CMS] Użyto bezpiecznego katalogu lokalnego (powód: ${reason})`);
    hasLoggedFallbackWarning = true;
  }
}

// SSR Data Fetcher: All products
export async function fetchServerProducts(): Promise<Product[]> {
  const client = getSupabaseServerClient();
  if (!client) {
    return getAllProducts();
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) logFallbackOnce(error.message);
      return getAllProducts();
    }

    return data.map(mapSupabaseRowToProduct);
  } catch (err: any) {
    logFallbackOnce(err?.message || 'Brak łączności');
    return getAllProducts();
  }
}

// SSR Data Fetcher: Single product by slug
export async function fetchServerProductBySlug(slug: string): Promise<Product | undefined> {
  const client = getSupabaseServerClient();
  if (!client) {
    return getProductBySlug(slug);
  }

  try {
    // Check direct slug column
    let { data } = await client
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!data) {
      // If not found by slug column, fetch all visible and match calculated slug
      const all = await fetchServerProducts();
      return all.find((p) => p.slug === slug);
    }

    return mapSupabaseRowToProduct(data);
  } catch {
    return getProductBySlug(slug);
  }
}

// SSR Data Fetcher: Products by category
export async function fetchServerProductsByCategory(category: string): Promise<Product[]> {
  if (category === 'all') {
    return fetchServerProducts();
  }

  const client = getSupabaseServerClient();
  if (!client) {
    return getProductsByCategory(category);
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('visible', true)
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      return getProductsByCategory(category);
    }

    return data.map(mapSupabaseRowToProduct);
  } catch (err) {
    return getProductsByCategory(category);
  }
}

// Client/Admin: Save product to Supabase
export async function saveProductToSupabase(product: Partial<Product>): Promise<{ success: boolean; data?: any; error?: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { success: false, error: 'Supabase client is not configured' };
  }

  try {
    const payload: any = {
      name: product.name,
      name_en: product.nameEn || product.name,
      price: product.price,
      category: product.category,
      category_label: product.categoryLabel,
      material: product.material,
      description: product.description,
      images: product.images || [],
      colors: product.colors || [],
      reviews: product.reviews || [],
      stock: product.stock ?? 10,
      visible: product.visible ?? true,
      updated_at: new Date().toISOString(),
    };

    if (product.id) {
      payload.id = product.id;
    }

    const { data, error } = await client
      .from('products')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Błąd zapisu do Supabase' };
  }
}

// Client/Admin: Delete product
export async function deleteProductFromSupabase(id: number): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { success: false, error: 'Supabase client is not configured' };
  }

  try {
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Błąd usuwania z Supabase' };
  }
}

// Newsletter subscription
export async function subscribeNewsletterToSupabase(email: string): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { success: true, message: 'Dziękujemy za zapis do newslettera!' };
  }

  try {
    const { error } = await client.from('newsletter_emails').insert([{ email }]);
    if (error) {
      if (error.code === '23505') {
        return { success: true, message: 'Ten adres e-mail jest już zapisany!' };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Twój kod rabatowy -10% (WARSAW10) został aktywowany!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Wystąpił błąd przy zapisie.' };
  }
}
