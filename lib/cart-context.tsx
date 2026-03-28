'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  productId: number;
  name:      string;
  image:     string | null;
  quantity:  number;
  size?:     string;
  color?:    string;
}

interface CartContextType {
  items:         CartItem[];
  count:         number;
  addItem:       (item: CartItem) => void;
  updateQty:     (key: string, qty: number) => void;
  removeItem:    (key: string) => void;
  changeVariant: (oldKey: string, updates: { size?: string | undefined; color?: string | undefined }) => void;
  clearCart:     () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = 'geuza_cart_v1';

export function cartItemKey(item: Pick<CartItem, 'productId' | 'size' | 'color'>): string {
  return `${item.productId}::${item.size ?? ''}::${item.color ?? ''}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {}
    setHydrated(true);
  }, []);

  // Persist whenever cart changes (skip initial unhydrated state)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems(prev => {
      const key = cartItemKey(newItem);
      const exists = prev.find(i => cartItemKey(i) === key);
      if (exists) {
        return prev.map(i =>
          cartItemKey(i) === key ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => cartItemKey(i) !== key));
    } else {
      setItems(prev => prev.map(i => cartItemKey(i) === key ? { ...i, quantity: qty } : i));
    }
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems(prev => prev.filter(i => cartItemKey(i) !== key));
  }, []);

  const changeVariant = useCallback((oldKey: string, updates: { size?: string | undefined; color?: string | undefined }) => {
    setItems(prev => {
      const item = prev.find(i => cartItemKey(i) === oldKey);
      if (!item) return prev;
      const newItem = { ...item, ...updates };
      const newKey = cartItemKey(newItem);
      if (newKey === oldKey) return prev;
      const withoutOld = prev.filter(i => cartItemKey(i) !== oldKey);
      const existingNew = withoutOld.find(i => cartItemKey(i) === newKey);
      if (existingNew) {
        return withoutOld.map(i =>
          cartItemKey(i) === newKey ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...withoutOld, newItem];
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, addItem, updateQty, removeItem, changeVariant, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
