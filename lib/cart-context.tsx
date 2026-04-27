'use client';

import {
  createContext, useContext, useState, useEffect,
  useCallback, useRef,
} from 'react';
import { useSession } from 'next-auth/react';
import { getDbCart, saveDbCart } from '@/actions/cart';

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
  changeVariant: (oldKey: string, updates: { size?: string; color?: string }) => void;
  clearCart:     () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY    = 'geuza_cart_v1';
const SYNC_DELAY  = 800; // ms debounce before writing to DB

export function cartItemKey(item: Pick<CartItem, 'productId' | 'size' | 'color'>): string {
  return `${item.productId}::${item.size ?? ''}::${item.color ?? ''}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const userId = status === 'authenticated' && session?.user?.id
    ? parseInt(session.user.id)
    : null;

  const [items, setItems]       = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Track previous userId so we can detect sign-in / sign-out transitions
  const prevUserIdRef = useRef<number | null>(null);
  const syncTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 1. On mount: load guest cart from localStorage ────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {}
    setHydrated(true);
  }, []);

  // ── 2. React to auth state changes ────────────────────────────────────────
  useEffect(() => {
    if (!hydrated || status === 'loading') return;

    const prevUserId = prevUserIdRef.current;

    if (userId && prevUserId === null) {
      // ── Sign-in: load DB cart and merge with any local guest items ──
      (async () => {
        const dbItems = await getDbCart(userId);
        setItems((local) => {
          // DB is the base; local guest items are added on top (quantities summed)
          const merged = [...dbItems];
          for (const localItem of local) {
            const key = cartItemKey(localItem);
            const idx = merged.findIndex((i) => cartItemKey(i) === key);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + localItem.quantity };
            } else {
              merged.push(localItem);
            }
          }
          return merged;
        });
        localStorage.removeItem(CART_KEY); // DB is now the source of truth
      })();
    } else if (!userId && prevUserId !== null) {
      // ── Sign-out: wipe local state; DB cart stays for the next login ──
      setItems([]);
      localStorage.removeItem(CART_KEY);
    }

    prevUserIdRef.current = userId;
  }, [userId, hydrated, status]);

  // ── 3. Persist on every cart change ───────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;

    if (userId) {
      // Debounced DB sync for authenticated users
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        saveDbCart(
          userId,
          items.map((i) => ({
            productId: i.productId,
            quantity:  i.quantity,
            size:      i.size,
            color:     i.color,
          })),
        ).catch((err) => console.error('[cart] DB sync failed:', err));
      }, SYNC_DELAY);
    } else if (status !== 'loading') {
      // localStorage for guests
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, hydrated, userId, status]);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const key    = cartItemKey(newItem);
      const exists = prev.find((i) => cartItemKey(i) === key);
      if (exists) {
        return prev.map((i) =>
          cartItemKey(i) === key ? { ...i, quantity: i.quantity + newItem.quantity } : i,
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => cartItemKey(i) !== key));
    } else {
      setItems((prev) => prev.map((i) => cartItemKey(i) === key ? { ...i, quantity: qty } : i));
    }
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => cartItemKey(i) !== key));
  }, []);

  const changeVariant = useCallback((
    oldKey:  string,
    updates: { size?: string; color?: string },
  ) => {
    setItems((prev) => {
      const item = prev.find((i) => cartItemKey(i) === oldKey);
      if (!item) return prev;
      const newItem = { ...item, ...updates };
      const newKey  = cartItemKey(newItem);
      if (newKey === oldKey) return prev;
      const withoutOld  = prev.filter((i) => cartItemKey(i) !== oldKey);
      const existingNew = withoutOld.find((i) => cartItemKey(i) === newKey);
      if (existingNew) {
        return withoutOld.map((i) =>
          cartItemKey(i) === newKey ? { ...i, quantity: i.quantity + item.quantity } : i,
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
