import { fetchProducts } from './products-db';
import { Product } from './products';
import { CartItemRef } from '@/store/useCartStore';

export interface ResolvedCartItem {
  productId: number;
  variant?: string;
  qty: number;
  product: Product;
  unitPrice: number;
  totalPrice: number;
  promoEligible: boolean;
}

export interface ResolvedCart {
  items: ResolvedCartItem[];
  itemCount: number;
  subtotal: number;
  promoEligibleCount: number;
  freeItemsCount: number;
  freeItemsDiscount: number;
  promoCode: string | null;
  promoDiscount: number;
  total: number;
  shippingCost: number;
  freeShippingThresholdMet: boolean;
}

const STATIC_PROMO_CODES: Record<string, number> = {
  WARSAW10: 0.10,
  WDS10: 0.10,
  ELEMENTY: 0.15,
  DURAGWAVES: 0.20,
  VIP20: 0.20,
};

/**
 * Resolves raw cart references ({ productId, variant, qty }) using the official database products,
 * computing server-side subtotal, the "Kup 2, trzeci gratis" promotion, and promo codes.
 */
export async function resolveCartServer(
  itemsRef: CartItemRef[],
  promoCodeInput?: string | null
): Promise<ResolvedCart> {
  if (!itemsRef || !Array.isArray(itemsRef) || itemsRef.length === 0) {
    return {
      items: [],
      itemCount: 0,
      subtotal: 0,
      promoEligibleCount: 0,
      freeItemsCount: 0,
      freeItemsDiscount: 0,
      promoCode: null,
      promoDiscount: 0,
      total: 0,
      shippingCost: 0,
      freeShippingThresholdMet: true,
    };
  }

  const allProducts = await fetchProducts();
  const productMap = new Map<number, Product>(allProducts.map((p) => [p.id, p]));

  const resolvedItems: ResolvedCartItem[] = [];
  let subtotal = 0;
  let totalItemCount = 0;

  // Flattened list of individual units that are promo eligible to pick the cheapest ones for free
  const eligibleUnits: Array<{ productId: number; unitPrice: number; name: string }> = [];

  for (const itemRef of itemsRef) {
    const qty = Math.max(1, Math.floor(Number(itemRef.qty) || 1));
    const product = productMap.get(itemRef.productId);

    if (!product || product.visible === false) {
      continue;
    }

    // Determine unit price (check variant first if available)
    let unitPrice = Number(product.price) || 0;
    if (itemRef.variant && product.variants && product.variants.length > 0) {
      const matchedVariant = product.variants.find(
        (v) => v.name === itemRef.variant || v.value === itemRef.variant
      );
      if (matchedVariant && matchedVariant.price) {
        unitPrice = Number(matchedVariant.price);
      }
    }

    const totalPrice = unitPrice * qty;
    subtotal += totalPrice;
    totalItemCount += qty;

    const isEligible = Boolean(product.promoEligible ?? (product.category !== 'accessories'));

    resolvedItems.push({
      productId: itemRef.productId,
      variant: itemRef.variant,
      qty,
      product,
      unitPrice,
      totalPrice,
      promoEligible: isEligible,
    });

    if (isEligible) {
      for (let i = 0; i < qty; i++) {
        eligibleUnits.push({
          productId: product.id,
          unitPrice,
          name: product.name,
        });
      }
    }
  }

  // --- Promocja: "Kup 2, trzeci gratis" ---
  // Dla każdych 3 sztuk produktów kwalifikujących się, najtańsza z nich jest w 100% darmowa (0 zł)
  const promoEligibleCount = eligibleUnits.length;
  const freeItemsCount = Math.floor(promoEligibleCount / 3);
  let freeItemsDiscount = 0;

  if (freeItemsCount > 0) {
    // Posortuj jednostki od najtańszej do najdroższej
    eligibleUnits.sort((a, b) => a.unitPrice - b.unitPrice);
    const freeUnits = eligibleUnits.slice(0, freeItemsCount);
    freeItemsDiscount = freeUnits.reduce((acc, u) => acc + u.unitPrice, 0);
  }

  const subtotalAfterBogo = Math.max(0, subtotal - freeItemsDiscount);

  // --- Kod rabatowy ---
  let cleanPromoCode: string | null = null;
  let promoDiscount = 0;

  if (promoCodeInput) {
    const candidate = promoCodeInput.trim().toUpperCase();
    if (STATIC_PROMO_CODES[candidate]) {
      cleanPromoCode = candidate;
      promoDiscount = Math.round(subtotalAfterBogo * STATIC_PROMO_CODES[candidate] * 100) / 100;
    } else {
      // Możliwość weryfikacji w Supabase
      try {
        const { getSupabaseServerClient } = await import('./supabase');
        const adminClient = getSupabaseServerClient();
        if (adminClient) {
          const { data } = await adminClient
            .from('promo_codes')
            .select('rate, active')
            .eq('code', candidate)
            .eq('active', true)
            .maybeSingle();

          if (data && data.rate) {
            cleanPromoCode = candidate;
            promoDiscount = Math.round(subtotalAfterBogo * Number(data.rate) * 100) / 100;
          }
        }
      } catch {
        // Fallback jeśli brak tabeli promo_codes
      }
    }
  }

  // Darmowa dostawa w Polsce na zamówienia
  const shippingCost = 0;
  const finalTotal = Math.max(0, subtotalAfterBogo - promoDiscount + shippingCost);

  return {
    items: resolvedItems,
    itemCount: totalItemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    promoEligibleCount,
    freeItemsCount,
    freeItemsDiscount: Math.round(freeItemsDiscount * 100) / 100,
    promoCode: cleanPromoCode,
    promoDiscount: Math.round(promoDiscount * 100) / 100,
    total: Math.round(finalTotal * 100) / 100,
    shippingCost,
    freeShippingThresholdMet: true,
  };
}
