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
  applyPromoCode: (code: string) => boolean;
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

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WARSAW10' || cleanCode === 'WDS10') {
      setAppliedPromoCode(cleanCode);
      setPromoRate(0.10);
      return true;
    } else if (cleanCode === 'VIP20') {
      setAppliedPromoCode(cleanCode);
      setPromoRate(0.20);
      return true;
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
