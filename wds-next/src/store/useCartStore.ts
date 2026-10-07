'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PROMO_GIFT_PRODUCT_ID } from '@/lib/products';

export interface CartItemRef {
  productId: number;
  variant?: string;
  qty: number;
}

export interface CartStoreState {
  items: CartItemRef[];
  isOpen: boolean;
  promoCode: string | null;

  // Actions
  addItem: (productId: number, variant?: string, qty?: number) => void;
  removeItem: (productId: number, variant?: string) => void;
  updateQty: (productId: number, variant: string | undefined, qty: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  setPromoCode: (code: string | null) => void;
  getItemCount: () => number;
}

/**
 * Synchronizes the 2+1 promotional surprise product (ID 999 at 1 PLN / 0.25 EUR):
 * For every 2 regular eligible durags (productId !== 999), exactly Math.floor(regularCount / 2)
 * promotional gift products are kept in the cart automatically.
 * If regularCount < 2, the gift product is automatically removed.
 */
export function syncPromoGifts(rawItems: CartItemRef[]): CartItemRef[] {
  const regularItems = rawItems.filter((i) => i.productId !== PROMO_GIFT_PRODUCT_ID);
  const regularCount = regularItems.reduce((acc, i) => acc + (Number(i.qty) || 0), 0);
  const targetGiftQty = Math.floor(regularCount / 2);

  if (targetGiftQty <= 0) {
    return regularItems;
  }

  const giftRef: CartItemRef = {
    productId: PROMO_GIFT_PRODUCT_ID,
    variant: undefined,
    qty: targetGiftQty,
  };

  return [...regularItems, giftRef];
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,

      addItem: (productId: number, variant?: string, qty: number = 1) => {
        if (qty <= 0) return;
        const currentItems = get().items.filter(
          (item) => item.productId !== PROMO_GIFT_PRODUCT_ID
        );
        const existingIndex = currentItems.findIndex(
          (item) => item.productId === productId && (item.variant || '') === (variant || '')
        );

        let updated: CartItemRef[];
        if (existingIndex > -1) {
          updated = [...currentItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            qty: updated[existingIndex].qty + qty,
          };
        } else {
          updated = [...currentItems, { productId, variant, qty }];
        }

        const synced = syncPromoGifts(updated);
        set({ items: synced, isOpen: true });
      },

      removeItem: (productId: number, variant?: string) => {
        const filtered = get().items.filter(
          (item) => !(item.productId === productId && (item.variant || '') === (variant || ''))
        );
        const synced = syncPromoGifts(filtered);
        set({ items: synced });
      },

      updateQty: (productId: number, variant: string | undefined, qty: number) => {
        if (productId === PROMO_GIFT_PRODUCT_ID) {
          // Promo gift qty is auto-governed by regular products count
          return;
        }
        if (qty <= 0) {
          get().removeItem(productId, variant);
          return;
        }

        const updated = get().items.map((item) =>
          item.productId === productId && (item.variant || '') === (variant || '')
            ? { ...item, qty }
            : item
        );
        const synced = syncPromoGifts(updated);
        set({ items: synced });
      },

      clearCart: () => {
        set({ items: [], promoCode: null });
      },

      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      setPromoCode: (code: string | null) => {
        set({ promoCode: code ? code.trim().toUpperCase() : null });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      },
    }),
    {
      name: 'wds_cart_v2',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined') {
          if (!state || state.items.length === 0) {
            try {
              const legacyRaw = localStorage.getItem('wds_next_cart');
              if (legacyRaw) {
                const legacyItems = JSON.parse(legacyRaw);
                if (Array.isArray(legacyItems) && legacyItems.length > 0) {
                  const migrated: CartItemRef[] = legacyItems
                    .filter((it: any) => it?.product?.id)
                    .map((it: any) => ({
                      productId: Number(it.product.id),
                      variant: it.variant || undefined,
                      qty: Number(it.quantity) || 1,
                    }));
                  if (migrated.length > 0 && state) {
                    state.items = syncPromoGifts(migrated);
                  }
                }
              }
            } catch {
              // Ignore legacy parse errors
            }
          } else if (state) {
            state.items = syncPromoGifts(state.items);
          }
        }
      },
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
      }),
    }
  )
);
