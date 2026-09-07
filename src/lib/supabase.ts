import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, PRODUCTS, getAllProducts, getProductBySlug, getProductsByCategory } from './products';

// Read credentials from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjljaljfmrqocnfglrij.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqbGphbGpmbXJxb2NuZmdscmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTE2NTMsImV4cCI6MjEwNDM4NzY1M30.ITrdxfCFOfQMmSPPBq8w0MPTzgaGqC2Qy8xdvWSX7Bk';

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

// ============================================================================
// ORDERS CMS & CHECKOUT
// ============================================================================
export interface SupabaseOrder {
  id?: number;
  order_no: string;
  created_at?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_method: 'paczkomat' | 'courier';
  locker_code?: string | null;
  locker_address?: string | null;
  items: any[];
  items_summary?: string;
  subtotal: number;
  discount_code?: string | null;
  discount_pct?: number;
  discount_val?: number;
  total: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export async function createOrderInSupabase(order: Omit<SupabaseOrder, 'id' | 'created_at'>): Promise<{ success: boolean; orderNo?: string; error?: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { success: true, orderNo: order.order_no }; // Offline/fallback simulation
  }

  try {
    const { data, error } = await client
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, orderNo: data.order_no };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Błąd podczas składania zamówienia' };
  }
}

export async function fetchOrdersFromSupabase(): Promise<SupabaseOrder[]> {
  const client = getSupabaseBrowserClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function updateOrderStatusInSupabase(
  orderId: number,
  status: SupabaseOrder['status']
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) return { success: false, error: 'Brak klienta Supabase' };

  try {
    const { error } = await client
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Błąd aktualizacji' };
  }
}

// ============================================================================
// PROMO CODES CMS
// ============================================================================
export interface SupabasePromoCode {
  id: number;
  code: string;
  rate: number;
  active: boolean;
  uses_count: number;
  created_at: string;
}

export async function fetchPromoCodesFromSupabase(): Promise<SupabasePromoCode[]> {
  const client = getSupabaseBrowserClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('promo_codes')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function savePromoCodeToSupabase(
  code: string,
  rate: number,
  active = true
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) return { success: false, error: 'Brak klienta Supabase' };

  try {
    const { error } = await client
      .from('promo_codes')
      .upsert({ code: code.toUpperCase().trim(), rate, active }, { onConflict: 'code' });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Błąd zapisu kodu' };
  }
}

export async function togglePromoCodeStatus(
  id: number,
  active: boolean
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) return { success: false, error: 'Brak klienta Supabase' };

  try {
    const { error } = await client
      .from('promo_codes')
      .update({ active })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Błąd aktualizacji' };
  }
}

// ============================================================================
// SITE SETTINGS CMS (Dynamic text / announcements)
// ============================================================================
export interface SiteSetting {
  id?: number;
  key: string;
  value: string;
  label: string;
  category: string;
  updated_at?: string;
}

export const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  announcement_bar: 'Darmowa wysyłka InPost od 150 PLN • Ręczne pakowanie w Warszawie • Wysyłka w 24h',
  hero_badge: 'Atelier Warszawa 2026 • 100% Mulberry Silk',
  hero_title: 'Ręcznie Szyte Duragi Jedwabne i Satynowe',
  hero_subtitle: 'Stworzone z myślą o perfekcyjnych falach 360 waves i ochronie włosów. Prawdziwy jedwab morwowy 19 Momme, szyty w warszawskim atelier.',
  contact_email: 'kontakt@warsawduragstore.pl',
  contact_phone: '+48 500 000 000',
  instagram_handle: '@warsawduragstore',
};

export async function fetchSiteSettings(): Promise<Record<string, string>> {
  const client = getSupabaseServerClient() || getSupabaseBrowserClient();
  if (!client) return DEFAULT_SITE_SETTINGS;

  try {
    const { data, error } = await client
      .from('site_settings')
      .select('key, value');

    if (error || !data || data.length === 0) {
      return DEFAULT_SITE_SETTINGS;
    }

    const settings = { ...DEFAULT_SITE_SETTINGS };
    data.forEach((row: any) => {
      if (row.key && row.value) {
        settings[row.key] = row.value;
      }
    });
    return settings;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSetting(
  key: string,
  value: string,
  label = '',
  category = 'general'
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) return { success: false, error: 'Brak klienta Supabase' };

  try {
    const { error } = await client
      .from('site_settings')
      .upsert(
        { key, value, label: label || key, category, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Błąd zapisu ustawienia' };
  }
}

// ============================================================================
// NEWSLETTER SUBSCRIBERS
// ============================================================================
export async function fetchNewsletterSubscribers(): Promise<Array<{ id: number; email: string; subscribed_at: string }>> {
  const client = getSupabaseBrowserClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('newsletter_emails')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

