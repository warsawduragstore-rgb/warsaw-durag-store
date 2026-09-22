'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,

      addItem: (productId: number, variant?: string, qty: number = 1) => {
        if (qty <= 0) return;
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.productId === productId && (item.variant || '') === (variant || '')
        );

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            qty: updated[existingIndex].qty + qty,
          };
          set({ items: updated, isOpen: true });
        } else {
          set({
            items: [...currentItems, { productId, variant, qty }],
            isOpen: true,
          });
        }
      },

      removeItem: (productId: number, variant?: string) => {
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && (item.variant || '') === (variant || ''))
          ),
        });
      },

      updateQty: (productId: number, variant: string | undefined, qty: number) => {
        if (qty <= 0) {
          get().removeItem(productId, variant);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId && (item.variant || '') === (variant || '')
              ? { ...item, qty }
              : item
          ),
        });
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
        // Migration from legacy cart key if new cart is empty
        if (typeof window !== 'undefined' && (!state || state.items.length === 0)) {
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
                  state.items = migrated;
                }
              }
            }
          } catch {
            // Ignore legacy parse errors
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
