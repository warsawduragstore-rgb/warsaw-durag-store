'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  promoDiscount: number;
  appliedPromoCode: string | null;
  promoRate: number;
  applyPromoCode: (code: string) => Promise<boolean>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoRate, setPromoRate] = useState<number>(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wds_next_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('wds_next_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode(null);
    setPromoRate(0);
  };

  const applyPromoCode = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return false;

    // Fast static check for initial codes
    const staticCodes: Record<string, number> = {
      WARSAW10: 0.10,
      WDS10: 0.10,
      ELEMENTY: 0.15,
      DURAGWAVES: 0.20,
      VIP20: 0.20,
    };

    if (staticCodes[cleanCode]) {
      setAppliedPromoCode(cleanCode);
      setPromoRate(staticCodes[cleanCode]);
      return true;
    }

    // Try dynamic check in Supabase
    try {
      const { getSupabaseBrowserClient } = await import('@/lib/supabase');
      const client = getSupabaseBrowserClient();
      if (client) {
        const { data } = await client
          .from('promo_codes')
          .select('rate, active')
          .eq('code', cleanCode)
          .eq('active', true)
          .maybeSingle();

        if (data && data.rate) {
          setAppliedPromoCode(cleanCode);
          setPromoRate(Number(data.rate));
          return true;
        }
      }
    } catch {
      // Fallback failed
    }

    return false;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const promoDiscount = subtotal * promoRate;
  const total = Math.max(0, subtotal - promoDiscount);

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
        appliedPromoCode,
        promoRate,
        applyPromoCode,
        total,
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
