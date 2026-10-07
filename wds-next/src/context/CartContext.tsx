'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, getProductById, PROMO_GIFT_PRODUCT, PROMO_GIFT_PRODUCT_ID } from '@/lib/products';
import { useCartStore, syncPromoGifts } from '@/store/useCartStore';
import { ResolvedCart } from '@/lib/cart-server';

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
  unitPrice: number;
  totalPrice: number;
  promoEligible: boolean;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: number, variant?: string) => void;
  updateQuantity: (productId: number, quantity: number, variant?: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  promoDiscount: number;
  freeItemsCount: number;
  freeItemsDiscount: number;
  appliedPromoCode: string | null;
  applyPromoCode: (code: string) => Promise<boolean>;
  total: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useCartStore((state) => state.items);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);
  const addItemStore = useCartStore((state) => state.addItem);
  const removeItemStore = useCartStore((state) => state.removeItem);
  const updateQtyStore = useCartStore((state) => state.updateQty);
  const clearCartStore = useCartStore((state) => state.clearCart);
  const promoCodeStore = useCartStore((state) => state.promoCode);
  const setPromoCodeStore = useCartStore((state) => state.setPromoCode);

  const [resolvedCart, setResolvedCart] = useState<ResolvedCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ensure promo gifts are synced on initial mount even for returning sessions
  useEffect(() => {
    const current = useCartStore.getState().items;
    if (current && current.length > 0) {
      const synced = syncPromoGifts(current);
      if (JSON.stringify(current) !== JSON.stringify(synced)) {
        useCartStore.setState({ items: synced });
      }
    }
  }, []);

  // Sync and resolve cart with server API whenever items or promoCode change
  const refreshCart = useCallback(async () => {
    if (items.length === 0) {
      setResolvedCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/cart/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, promoCode: promoCodeStore }),
      });

      if (res.ok) {
        const data: ResolvedCart = await res.json();
        setResolvedCart(data);
      }
    } catch (err) {
      console.error('[Cart] Błąd dociągania aktualnych cen z serwera:', err);
    } finally {
      setIsLoading(false);
    }
  }, [items, promoCodeStore]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = (product: Product, quantity: number = 1, variant?: string) => {
    addItemStore(product.id, variant, quantity);
  };

  const removeFromCart = (productId: number, variant?: string) => {
    removeItemStore(productId, variant);
  };

  const updateQuantity = (productId: number, quantity: number, variant?: string) => {
    updateQtyStore(productId, variant, quantity);
  };

  const clearCart = () => {
    clearCartStore();
    setResolvedCart(null);
  };

  const applyPromoCode = async (code: string): Promise<boolean> => {
    const clean = code.trim().toUpperCase();
    if (!clean) return false;

    try {
      const res = await fetch('/api/cart/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, promoCode: clean }),
      });

      if (res.ok) {
        const data: ResolvedCart = await res.json();
        if (data.promoDiscount > 0 || data.promoCode === clean) {
          setPromoCodeStore(clean);
          setResolvedCart(data);
          return true;
        }
      }
    } catch {
      // Ignoruj błąd sieci
    }

    return false;
  };

  // Convert resolved cart items to CartItem format with instant zero-lag optimistic fallback
  const cart: CartItem[] = useMemo(() => {
    if (resolvedCart && resolvedCart.items && resolvedCart.items.length > 0) {
      return resolvedCart.items.map((item) => ({
        product: item.product,
        quantity: item.qty,
        variant: item.variant,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        promoEligible: item.promoEligible,
      }));
    }

    // Immediate optimistic fallback derived directly from store items
    return items
      .map((item) => {
        const product =
          item.productId === PROMO_GIFT_PRODUCT_ID
            ? PROMO_GIFT_PRODUCT
            : getProductById(item.productId);
        if (!product) return null;
        const isGift = item.productId === PROMO_GIFT_PRODUCT_ID;
        const unitPrice = isGift ? 1.0 : Number(product.price) || 0;
        return {
          product,
          quantity: item.qty,
          variant: item.variant,
          unitPrice,
          totalPrice: unitPrice * item.qty,
          promoEligible:
            !isGift &&
            Boolean(product.promoEligible ?? (product.category !== 'accessories')),
        };
      })
      .filter(Boolean) as CartItem[];
  }, [resolvedCart, items]);

  const cartCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }, [items]);

  const fallbackSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  const subtotal = resolvedCart?.subtotal ?? fallbackSubtotal;
  const promoDiscount = resolvedCart?.promoDiscount ?? 0;
  const freeItemsCount =
    resolvedCart?.freeItemsCount ??
    cart
      .filter((i) => i.product.id === PROMO_GIFT_PRODUCT_ID)
      .reduce((s, i) => s + i.quantity, 0);
  const freeItemsDiscount = resolvedCart?.freeItemsDiscount ?? 0;
  const total = resolvedCart?.total ?? fallbackSubtotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        promoDiscount,
        freeItemsCount,
        freeItemsDiscount,
        appliedPromoCode: promoCodeStore,
        applyPromoCode,
        total,
        isLoading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
