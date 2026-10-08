import { fetchProducts } from './products-db';
import { Product, PRODUCTS, getProductById, PROMO_GIFT_PRODUCT, PROMO_GIFT_PRODUCT_ID } from './products';
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
 * computing server-side subtotal, the "Kup 2, trzeci durag za 1 zł" promotion, and promo codes.
 */
export async function resolveCartServer(
  itemsRef: CartItemRef[],
  promoCodeInput?: string | null,
  shippingCountry: string = 'PL'
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

  // Load DB products and merge with static PRODUCTS so no item is ever dropped
  const dbProducts = await fetchProducts().catch(() => []);
  const allProducts: Product[] = [...PRODUCTS];
  for (const dbp of dbProducts) {
    const idx = allProducts.findIndex((p) => p.id === dbp.id);
    if (idx >= 0) {
      allProducts[idx] = dbp;
    } else {
      allProducts.push(dbp);
    }
  }

  if (!allProducts.some((p) => p.id === PROMO_GIFT_PRODUCT_ID)) {
    allProducts.push(PROMO_GIFT_PRODUCT);
  }
  const productMap = new Map<number, Product>(allProducts.map((p) => [p.id, p]));

  const resolvedItems: ResolvedCartItem[] = [];
  let subtotal = 0;
  let totalItemCount = 0;

  for (const itemRef of itemsRef) {
    const qty = Math.max(1, Math.floor(Number(itemRef.qty) || 1));
    const product = productMap.get(itemRef.productId) || getProductById(itemRef.productId);

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

    const isPromoGift = itemRef.productId === PROMO_GIFT_PRODUCT_ID;
    if (isPromoGift) {
      unitPrice = 1.0;
    }

    const totalPrice = unitPrice * qty;
    subtotal += totalPrice;
    totalItemCount += qty;

    const isEligible = !isPromoGift && Boolean(product.promoEligible ?? (product.category !== 'accessories'));

    resolvedItems.push({
      productId: itemRef.productId,
      variant: itemRef.variant,
      qty,
      product,
      unitPrice,
      totalPrice,
      promoEligible: isEligible,
    });
  }

  // --- Promocja 2+1: Kup 2 duragi, trzeci losowy za 1 zł ---
  // Dla każdych 2 sztuk regularnych duragów, klient otrzymuje 1 losowy durag za 1 zł
  const regularEligibleCount = resolvedItems
    .filter((i) => i.productId !== PROMO_GIFT_PRODUCT_ID && i.promoEligible)
    .reduce((sum, i) => sum + i.qty, 0);

  const targetGiftQty = Math.floor(regularEligibleCount / 2);
  const existingGiftIdx = resolvedItems.findIndex((i) => i.productId === PROMO_GIFT_PRODUCT_ID);

  if (targetGiftQty > 0) {
    const giftProduct = productMap.get(PROMO_GIFT_PRODUCT_ID) || PROMO_GIFT_PRODUCT;
    const giftUnitPrice = 1.0;
    const giftTotalPrice = giftUnitPrice * targetGiftQty;

    if (existingGiftIdx >= 0) {
      // Skoryguj do właściwej ilości i ceny
      subtotal -= resolvedItems[existingGiftIdx].totalPrice;
      totalItemCount -= resolvedItems[existingGiftIdx].qty;

      resolvedItems[existingGiftIdx].qty = targetGiftQty;
      resolvedItems[existingGiftIdx].unitPrice = giftUnitPrice;
      resolvedItems[existingGiftIdx].totalPrice = giftTotalPrice;

      subtotal += giftTotalPrice;
      totalItemCount += targetGiftQty;
    } else {
      // Samoczynnie dodaj produkt promocyjny za 1 zł
      resolvedItems.push({
        productId: PROMO_GIFT_PRODUCT_ID,
        qty: targetGiftQty,
        product: giftProduct,
        unitPrice: giftUnitPrice,
        totalPrice: giftTotalPrice,
        promoEligible: false,
      });
      subtotal += giftTotalPrice;
      totalItemCount += targetGiftQty;
    }
  } else if (existingGiftIdx >= 0) {
    // Usuń produkt promocyjny, jeśli w koszyku jest mniej niż 2 regularne duragi
    subtotal -= resolvedItems[existingGiftIdx].totalPrice;
    totalItemCount -= resolvedItems[existingGiftIdx].qty;
    resolvedItems.splice(existingGiftIdx, 1);
  }

  // --- Kod rabatowy ---
  let cleanPromoCode: string | null = null;
  let promoDiscount = 0;

  if (promoCodeInput) {
    const candidate = promoCodeInput.trim().toUpperCase();
    if (STATIC_PROMO_CODES[candidate]) {
      cleanPromoCode = candidate;
      promoDiscount = Math.round(subtotal * STATIC_PROMO_CODES[candidate] * 100) / 100;
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
            promoDiscount = Math.round(subtotal * Number(data.rate) * 100) / 100;
          }
        }
      } catch {
        // Fallback jeśli brak tabeli promo_codes
      }
    }
  }

  // Dostawa: w Polsce darmowa (0 zł). Za granicę: 35 zł (darmowa od 250 zł).
  const isInternational = Boolean(shippingCountry && shippingCountry !== 'PL');
  const shippingCost = isInternational ? (subtotal >= 250 ? 0 : 35) : 0;
  const freeShippingThresholdMet = isInternational ? subtotal >= 250 : true;
  const finalTotal = Math.max(0, subtotal - promoDiscount + shippingCost);

  return {
    items: resolvedItems,
    itemCount: totalItemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    promoEligibleCount: regularEligibleCount,
    freeItemsCount: targetGiftQty,
    freeItemsDiscount: 0,
    promoCode: cleanPromoCode,
    promoDiscount: Math.round(promoDiscount * 100) / 100,
    total: Math.round(finalTotal * 100) / 100,
    shippingCost,
    freeShippingThresholdMet,
  };
}
