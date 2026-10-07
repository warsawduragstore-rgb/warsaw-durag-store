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
let serverClient: SupabaseClient | null = null;

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
  // If invoked in browser context, reuse the browser singleton to avoid multiple GoTrueClient instances
  if (typeof window !== 'undefined') {
    return getSupabaseBrowserClient();
  }
  if (!serverClient) {
    serverClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return serverClient;
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
    priceEur: row.price_eur ? Number(row.price_eur) : Math.round(((Number(row.price) || fallback?.price || 79.0) / 4.3) * 100) / 100,
    promoEligible: row.promo_eligible !== undefined ? Boolean(row.promo_eligible) : (fallback?.promoEligible ?? true),
    promoGiftPool: row.promo_gift_pool !== undefined ? Boolean(row.promo_gift_pool) : false,
    hsCode: row.hs_code || '6505.00',
    weightKg: row.weight_kg ? Number(row.weight_kg) : 0.08,
    materialComposition: row.material_composition || row.material || fallback?.material || '100% Jedwab Morwowy',
    fabricWeight: row.fabric_weight || '19 Momme',
    careInstructions: row.care_instructions || 'Prać ręcznie w chłodnej wodzie do 30°C, suszyć na płasko z dala od słońca',
    originCountry: row.origin_country || 'Polska',
    dimensionsInfo: row.dimensions_info || 'Rozmiar uniwersalny, długość pasów 100 cm, potrójny płaski szew',
  };
}

let hasLoggedFallbackWarning = false;
function logFallbackOnce(reason: string) {
  if (!hasLoggedFallbackWarning && process.env.NODE_ENV !== 'production') {
    console.info(`[WDS Supabase CMS] Użyto bezpiecznego katalogu lokalnego (powód: ${reason})`);
    hasLoggedFallbackWarning = true;
  }
}

// SSR Data Fetcher: All products strictly from Supabase
export async function fetchServerProducts(): Promise<Product[]> {
  const client = getSupabaseServerClient();
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) logFallbackOnce(error.message);
      return [];
    }

    return data.map(mapSupabaseRowToProduct);
  } catch (err: any) {
    logFallbackOnce(err?.message || 'Brak łączności');
    return [];
  }
}

// SSR Data Fetcher: Single product by slug strictly from Supabase
export async function fetchServerProductBySlug(slug: string): Promise<Product | undefined> {
  const client = getSupabaseServerClient();
  if (!client) {
    return undefined;
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
    return undefined;
  }
}

// SSR Data Fetcher: Products by category strictly from Supabase
export async function fetchServerProductsByCategory(category: string): Promise<Product[]> {
  if (category === 'all') {
    return fetchServerProducts();
  }

  const client = getSupabaseServerClient();
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('visible', true)
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map(mapSupabaseRowToProduct);
  } catch (err) {
    return [];
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
  delivery_method: 'paczkomat' | 'courier' | 'pickup';
  locker_code?: string | null;
  locker_address?: string | null;
  point_id?: string | null;
  items: any[];
  items_summary?: string;
  subtotal: number;
  discount_code?: string | null;
  discount_pct?: number;
  discount_val?: number;
  total: number;
  stripe_session_id?: string | null;
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string | null;
  status: 'pending_payment' | 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string | null;
  notes?: string | null;
}

export async function createOrderInSupabase(order: Omit<SupabaseOrder, 'id' | 'created_at'>): Promise<{ success: boolean; orderNo?: string; error?: string }> {
  const client = getSupabaseServerClient() || getSupabaseBrowserClient();
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

export async function updateOrderDetailsInSupabase(
  orderId: number,
  updates: Partial<SupabaseOrder>
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) return { success: false, error: 'Brak klienta Supabase' };

  try {
    const { error } = await client
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Błąd aktualizacji zamówienia' };
  }
}

export async function fetchOrderByOrderNo(orderNo: string): Promise<SupabaseOrder | null> {
  const client = getSupabaseServerClient() || getSupabaseBrowserClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .eq('order_no', orderNo)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function fetchOrderBySessionId(sessionId: string): Promise<SupabaseOrder | null> {
  const client = getSupabaseServerClient() || getSupabaseBrowserClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function updateOrderPaymentBySessionId(
  sessionId: string,
  updates: {
    payment_status?: SupabaseOrder['payment_status'];
    status?: SupabaseOrder['status'];
    payment_method?: string;
  }
): Promise<{ success: boolean; order?: SupabaseOrder; error?: string }> {
  const client = getSupabaseServerClient() || getSupabaseBrowserClient();
  if (!client) return { success: false, error: 'Brak klienta Supabase' };

  try {
    const { data, error } = await client
      .from('orders')
      .update(updates)
      .eq('stripe_session_id', sessionId)
      .select()
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    return { success: true, order: data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Błąd aktualizacji płatności' };
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
  // Top Announcement Bar
  announcement_bar: 'Darmowa dostawa w Polsce · Kup 2, trzeci durag za 1 zł',
  announcement_bar_en: 'Free shipping in Poland · Buy 2, get 3rd random durag for €0.25',

  // Hero Section
  hero_badge: 'Atelier Warszawa · 100% Mulberry Silk',
  hero_title: 'Jedyne duragi szyte w Polsce',
  hero_title_en: 'The Only Durags Handcrafted in Poland',
  hero_subtitle: 'Ręcznie szyte w Warszawie z prawdziwego jedwabiu morwowego 19 Momme, satyny i weluru. Bezodciskowy szew zewnętrzny i pasy 100 cm.',
  hero_subtitle_en: 'Handcrafted in Warsaw from genuine 19 Momme mulberry silk, satin and velvet. Seamless exterior stitching and 100 cm straps.',
  hero_cta_text: 'Odkryj kolekcję',
  hero_cta_text_en: 'Explore collection',
  hero_cta_link: '#kolekcja',

  // Promo Strip (2+1)
  promo_strip_title: 'Kup 2 duragi, trzeci losowy otrzymasz za 1 zł',
  promo_strip_title_en: 'Buy 2 durags, get a 3rd surprise durag for €0.25',
  promo_strip_desc: 'Wybierz dowolne dwa duragi do koszyka. Trzeci losowy model zostanie automatycznie dodany za 1 zł przy kasie.',
  promo_strip_desc_en: 'Add any two durags to your cart. The 3rd surprise model will be automatically discounted at checkout.',
  promo_strip_cta: 'Wybierz duragi',
  promo_strip_cta_en: 'Choose durags',

  // Section Headers
  bestsellers_title: 'Bestsellery pracowni',
  bestsellers_title_en: 'Atelier Bestsellers',
  choose_fabric_title: 'Wybierz materiał',
  choose_fabric_title_en: 'Choose your fabric',
  choose_fabric_desc: 'Jedwab morwowy, satyna o wysokim połysku, mięsisty welur oraz tkaniny sezonowe.',
  choose_fabric_desc_en: 'Pure mulberry silk, high-glide satin, heavyweight velvet, and seasonal weaves.',

  // About Section & Founders
  about_title: 'O nas i naszej pracowni',
  about_title_en: 'About Us & Our Workshop',
  about_description: 'Warsaw Durag Store powstał w 2020 roku w Warszawie przez braci bliźniaków. Duragi szyjemy ręcznie z naturalnego jedwabiu morwowego, satyny i weluru, z autorskim zewnętrznym bezodciskowym szwem i pasami o długości 100 cm.',
  about_description_en: 'Warsaw Durag Store was founded in 2020 in Warsaw by twin brothers. We craft durags by hand using genuine mulberry silk, satin and velvet, featuring seamless exterior stitching and 100 cm straps.',
  about_pickup_info: 'Odbiór osobisty w Warszawie po wcześniejszym umówieniu (ul. Włodarzewska 4, Ochota).',
  about_pickup_info_en: 'Local pickup available in Warsaw by prior appointment at ul. Włodarzewska 4.',
  about_image_url: '/assets/founders.jpg',

  // Contact & Socials
  contact_email: 'support@warsawduragstore.com',
  contact_phone: '+48 797 786 024',
  instagram_handle: '@warsawduragstore',

  // Trust Facts
  trust_fact_1: 'Wysyłka z Warszawy w 1–2 dni robocze',
  trust_fact_1_en: 'Dispatched from Warsaw in 1–2 business days',
  trust_fact_2: 'Darmowa dostawa w Polsce',
  trust_fact_2_en: 'Free shipping across Poland',
  trust_fact_3: '14 dni na zwrot',
  trust_fact_3_en: '14-day return window',
  trust_fact_4: 'Odbiór osobisty w Warszawie po umówieniu',
  trust_fact_4_en: 'Warsaw pickup by appointment',

  // FAQs
  faq_items: JSON.stringify([
    {
      q_pl: 'Kiedy paczka zostanie wysłana?',
      q_en: 'When will my order ship?',
      a_pl: 'Wysyłka z Warszawy w 1–2 dni robocze. Wszystkie przesyłki do Paczkomatów InPost i kurierem na terenie Polski są darmowe.',
      a_en: 'Orders are dispatched from Warsaw within 1–2 business days. Standard shipping across Poland is completely free via InPost Paczkomat or courier.'
    },
    {
      q_pl: 'Jak działa promocja: kup 2, trzeci losowy durag za 1 zł?',
      q_en: 'How does the "Buy 2, get 3rd for 1 PLN" offer work?',
      a_pl: 'Wybierz dowolne dwa duragi do koszyka. Trzeci losowy model zostanie automatycznie dodany za 1 zł przy kasie.',
      a_en: 'Add any two durags to your cart. The third random durag is automatically discounted to 1 PLN / €0.25 at checkout.'
    },
    {
      q_pl: 'Czym charakteryzuje się jedwab morwowy 19 Momme?',
      q_en: 'What is special about 19 Momme Mulberry Silk?',
      a_pl: 'Model Milanówek wykonany jest w 100% z naturalnego jedwabiu morwowego o gramaturze 19 Momme. Gładka struktura chroni włosy przed łamaniem i redukuje puszenie.',
      a_en: 'The Milanówek model is crafted from 100% natural 19 Momme mulberry silk. Its ultra-smooth structure protects hair from mechanical breakage, retains hydration and maintains 360 wave definition.'
    },
    {
      q_pl: 'Czy durag zostawia odciski na czole?',
      q_en: 'Will the durag leave forehead lines or marks?',
      a_pl: 'Nie. Wszystkie duragi szyjemy z autorskim zewnętrznym szwem i szerokimi pasami o długości 100 cm, co eliminuje odciski po całej nocy.',
      a_en: 'No. All our durags are designed with an exterior flat seam and extra-wide 100 cm straps to eliminate marks even after an entire night of sleep.'
    },
    {
      q_pl: 'Gdzie możliwy jest odbiór osobisty w Warszawie?',
      q_en: 'Is local pickup available in Warsaw?',
      a_pl: 'Odbiór osobisty w Warszawie po umówieniu przy ul. Włodarzewskiej 4 na Ochocie.',
      a_en: 'Yes, local pickup is available in Warsaw by prior appointment at ul. Włodarzewska 4 (Ochota).'
    }
  ])
};

export async function fetchSiteSettings(): Promise<Record<string, string>> {
  const client = typeof window !== 'undefined' ? getSupabaseBrowserClient() : (getSupabaseServerClient() || getSupabaseBrowserClient());
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

    if (error) {
      if (error.code === 'PGRST204' || error.message?.includes('does not exist') || error.code === '42P01') {
        return { success: false, error: "Tabela 'site_settings' nie istnieje w bazie danych. Wklej i uruchom skrypt 002_site_settings.sql w Supabase SQL Editor." };
      }
      return { success: false, error: error.message };
    }
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

// ============================================================================
// COMPANY INFO & SETTINGS TYPINGS
// ============================================================================
export interface CompanyInfo {
  name: string;
  nip: string;
  address: string;
  email_support: string;
  email_finance: string;
  phone: string;
  instagram: string;
  pickup_address: string;
  registered_in: string;
}

export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: 'Warsaw Durag Store Michał Wyszyński',
  nip: '7011275454',
  address: 'Grójecka 186 lok. 212, 02-390 Warszawa',
  email_support: 'support@warsawduragstore.com',
  email_finance: 'finance@warsawduragstore.com',
  phone: '',
  instagram: '@warsawduragstore',
  pickup_address: 'ul. Włodarzewska 4 i Centrum, po umówieniu',
  registered_in: 'CEIDG, Rzeczpospolita Polska',
};

export async function fetchCompanyInfo(): Promise<CompanyInfo> {
  const settings = await fetchSiteSettings();
  if (settings.company_info) {
    try {
      return { ...DEFAULT_COMPANY_INFO, ...JSON.parse(settings.company_info) };
    } catch {
      return DEFAULT_COMPANY_INFO;
    }
  }
  return DEFAULT_COMPANY_INFO;
}

export interface Promotion2Plus1Config {
  is_active: boolean;
  set_size: number;
  gift_price_pln: number;
  gift_price_eur: number;
  description_pl: string;
  description_en: string;
}

export const DEFAULT_PROMOTION_CONFIG: Promotion2Plus1Config = {
  is_active: true,
  set_size: 2,
  gift_price_pln: 1.00,
  gift_price_eur: 0.25,
  description_pl: 'Kup 2 dowolne duragi, a trzeci losowy otrzymasz za 1 zł',
  description_en: 'Buy any 2 durags and get a third surprise durag for €0.25',
};

export async function fetchPromotionConfig(): Promise<Promotion2Plus1Config> {
  const settings = await fetchSiteSettings();
  if (settings.promotion_2plus1) {
    try {
      return { ...DEFAULT_PROMOTION_CONFIG, ...JSON.parse(settings.promotion_2plus1) };
    } catch {
      return DEFAULT_PROMOTION_CONFIG;
    }
  }
  return DEFAULT_PROMOTION_CONFIG;
}

export interface ShippingZone {
  id: string;
  name: string;
  name_en: string;
  carrier: string;
  countries: string[];
  price_pln: number;
  price_eur: number;
  free_threshold_pln: number;
  free_threshold_eur: number;
  estimated_delivery: string;
  estimated_delivery_en: string;
  is_active: boolean;
}

export const DEFAULT_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'pl-paczkomat',
    name: 'Polska — Paczkomat InPost 24/7',
    name_en: 'Poland — InPost Parcel Locker 24/7',
    carrier: 'InPost Paczkomat 24/7',
    countries: ['PL'],
    price_pln: 0.00,
    price_eur: 0.00,
    free_threshold_pln: 0.00,
    free_threshold_eur: 0.00,
    estimated_delivery: '1–2 dni robocze',
    estimated_delivery_en: '1–2 business days',
    is_active: true,
  },
  {
    id: 'pl-kurier',
    name: 'Polska — Kurier DPD / InPost',
    name_en: 'Poland — Courier DPD / InPost',
    carrier: 'Kurier InPost / DPD',
    countries: ['PL'],
    price_pln: 0.00,
    price_eur: 0.00,
    free_threshold_pln: 0.00,
    free_threshold_eur: 0.00,
    estimated_delivery: '1–2 dni robocze',
    estimated_delivery_en: '1–2 business days',
    is_active: true,
  },
  {
    id: 'eu-courier',
    name: 'Unia Europejska — Kurier Tracked',
    name_en: 'European Union — Tracked Courier',
    carrier: 'Kurier DPD / DHL UE',
    countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI', 'IE', 'PT', 'CZ', 'SK', 'LT', 'LV', 'EE', 'HU', 'RO', 'BG', 'GR', 'HR', 'SI', 'LU', 'CY', 'MT'],
    price_pln: 35.00,
    price_eur: 8.50,
    free_threshold_pln: 250.00,
    free_threshold_eur: 60.00,
    estimated_delivery: '3–6 dni roboczych',
    estimated_delivery_en: '3–6 business days',
    is_active: true,
  },
];

export async function fetchShippingZones(): Promise<ShippingZone[]> {
  const settings = await fetchSiteSettings();
  if (settings.shipping_zones) {
    try {
      return JSON.parse(settings.shipping_zones);
    } catch {
      return DEFAULT_SHIPPING_ZONES;
    }
  }
  return DEFAULT_SHIPPING_ZONES;
}

export async function fetchVatRates(): Promise<Record<string, number>> {
  const settings = await fetchSiteSettings();
  // Klient zwolniony z VAT podmiotowo (art. 113 ust. 1 ustawy o VAT) — stawka 0% / zw.
  const defaultRates: Record<string, number> = {
    PL: 0.0, DE: 0.0, FR: 0.0, IT: 0.0, ES: 0.0, NL: 0.0, BE: 0.0, AT: 0.0,
    SE: 0.0, DK: 0.0, FI: 0.0, IE: 0.0, PT: 0.0, CZ: 0.0, SK: 0.0, LT: 0.0,
  };
  if (settings.vat_rates) {
    try {
      return { ...defaultRates, ...JSON.parse(settings.vat_rates) };
    } catch {
      return defaultRates;
    }
  }
  return defaultRates;
}

export interface CustomerReview {
  id: number;
  author: string;
  rating: number;
  content: string;
  source: 'Vinted' | 'Instagram' | 'Google' | 'Sklep';
  verified: boolean;
}

export async function fetchCustomerReviews(): Promise<CustomerReview[]> {
  const settings = await fetchSiteSettings();
  const defaultReviews: CustomerReview[] = [
    { id: 1, author: 'Kamil K.', rating: 5, content: 'Najlepszy durag jaki miałem. Jakość jedwabiu 19 momme czuć w dotyku od razu po otwarciu paczki. Pasy są długie, nie uciskają czoła w nocy.', source: 'Vinted', verified: true },
    { id: 2, author: 'Maksymilian W.', rating: 5, content: 'Wysyłka w 24h, zapakowane bardzo estetycznie. Na głowie trzyma się idealnie przy waves 360, rano brak jakichkolwiek zagnieceń.', source: 'Instagram', verified: true },
    { id: 3, author: 'Jakub S.', rating: 5, content: 'Welurowy czarny to klasa sama w sobie. Gruby, ale oddychający materiał. Zdecydowanie warty swojej ceny.', source: 'Google', verified: true },
    { id: 4, author: 'Mateusz R.', rating: 5, content: 'Kupione 2 sztuki w promocji, prezent w paczce zrobił dzień. Szyte w Polsce, szwy idealnie płaskie.', source: 'Vinted', verified: true },
  ];
  if (settings.customer_reviews) {
    try {
      return JSON.parse(settings.customer_reviews);
    } catch {
      return defaultReviews;
    }
  }
  return defaultReviews;
}
