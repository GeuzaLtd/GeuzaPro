'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, cartItemKey, CartItem } from '@/lib/cart-context';
import { placeOrder } from '@/actions/orders';
import { getProductsVariants } from '@/actions/products';
import { CONTACT_PHONE } from '@/lib/email';

interface OrderForm {
  name:    string;
  email:   string;
  phone:   string;
  address: string;
  notes:   string;
}

type Step = 'cart' | 'order' | 'success';

const COLOR_SWATCHES: Record<string, string> = {
  white:  '#f9fafb',
  black:  '#111827',
  yellow: '#eab308',
  green:  '#22c55e',
  red:    '#ef4444',
  grey:   '#9ca3af',
};

const KNOWN_COLORS = new Set(Object.keys(COLOR_SWATCHES));

function colorHex(c: string) {
  return COLOR_SWATCHES[c.toLowerCase()] ?? '#9ca3af';
}

function isLight(c: string) {
  return ['white', 'yellow'].includes(c.toLowerCase());
}

// ── Cart item row ────────────────────────────────────────────────────────────

function CartItemRow({
  item,
  meta,
}: {
  item: CartItem;
  meta: { sizes: string[]; colors: string[] } | undefined;
}) {
  const { updateQty, removeItem, changeVariant } = useCart();
  const key = cartItemKey(item);

  const sizes   = meta?.sizes  ?? [];
  const colors  = (meta?.colors ?? []).filter(c => KNOWN_COLORS.has(c.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-start">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-contain p-2" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-3">
        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{item.name}</p>

        {/* Size selector */}
        {sizes.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Size</p>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => changeVariant(key, { size: s === item.size ? undefined : s, color: item.color })}
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all duration-150 ${
                    item.size === s
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colour selector */}
        {colors.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Colour{item.color && <span className="text-primary normal-case font-semibold tracking-normal"> — {item.color}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => {
                const hex      = colorHex(c);
                const light    = isLight(c);
                const selected = item.color === c;
                return (
                  <button
                    key={c}
                    title={c}
                    onClick={() => changeVariant(key, { size: item.size, color: selected ? undefined : c })}
                    className={`w-7 h-7 rounded-full border-[3px] transition-all duration-150 flex items-center justify-center ${
                      selected
                        ? 'border-primary scale-110 shadow-sm'
                        : light
                        ? 'border-gray-200 hover:border-gray-400'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {selected && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={light ? '#374151' : '#fff'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity stepper */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Quantity</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQty(key, item.quantity - 1)}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <span className="w-8 text-center font-bold text-sm tabular-nums">{item.quantity}</span>
            <button
              onClick={() => updateQty(key, item.quantity + 1)}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(key)}
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
        title="Remove item"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function CartView() {
  const { items, count, clearCart } = useCart();

  const [step, setStep]         = useState<Step>('cart');
  const [orderNum, setOrderNum] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');

  const [form, setForm] = useState<OrderForm>({
    name: '', email: '', phone: '', address: '', notes: '',
  });

  // Product variant metadata (sizes + colours) keyed by productId
  const [meta, setMeta] = useState<Record<number, { sizes: string[]; colors: string[] }>>({});

  useEffect(() => {
    if (items.length === 0) return;
    const ids = [...new Set(items.map(i => i.productId))];
    getProductsVariants(ids).then(data => {
      const map: Record<number, { sizes: string[]; colors: string[] }> = {};
      data.forEach(p => { map[p.id] = { sizes: p.sizes, colors: p.colors }; });
      setMeta(map);
    });
  }, [items]);

  const field = (k: keyof OrderForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    setError('');

    const result = await placeOrder({
      name:    form.name,
      email:   form.email,
      phone:   form.phone,
      address: form.address || undefined,
      notes:   form.notes   || undefined,
      items:   items.map(i => ({
        productId: i.productId,
        name:      i.name,
        quantity:  i.quantity,
        size:      i.size,
        color:     i.color,
      })),
    });

    setSubmitting(false);
    if (result.success) {
      setOrderNum(result.orderNumber);
      clearCart();
      setStep('success');
    } else {
      setError(result.error);
    }
  };

  // ── Empty ──────────────────────────────────────────────────────────────────

  if (step !== 'success' && count === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2" className="mb-6">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <h2 className="font-display font-bold text-gray-700 text-2xl mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-8">Browse our shop and add items to get started.</p>
        <Link href="/shop" className="px-8 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-all">
          Browse Shop
        </Link>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto py-10 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-display font-black text-gray-900 text-3xl mb-3">Order Received!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Thank you! Your order has been placed successfully. We&apos;ve sent a confirmation
          to your email. Our team will contact you shortly to confirm your order.
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Order Number</p>
          <p className="text-2xl font-black text-gray-900 font-mono tracking-wider">{orderNum}</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-8">
          <p className="text-sm font-semibold text-primary mb-1">Need assistance?</p>
          <p className="text-2xl font-black text-primary">{CONTACT_PHONE}</p>
          <p className="text-xs text-gray-500 mt-1">Quote your order number when you call.</p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ── Cart view ──────────────────────────────────────────────────────────────

  if (step === 'cart') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="flex flex-col gap-4">
          {items.map(item => (
            <CartItemRow key={cartItemKey(item)} item={item} meta={meta[item.productId]} />
          ))}
          <Link href="/shop" className="text-sm text-primary font-medium hover:underline self-start mt-2">
            ← Continue shopping
          </Link>
        </div>

        {/* Summary panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display font-bold text-gray-900 text-lg mb-4">Order Summary</h2>
            <div className="flex flex-col gap-2 text-sm text-gray-600 mb-5">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
              <div className="flex justify-between">
                <span>Products</span>
                <span className="font-semibold text-gray-900">{items.length}</span>
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl p-4 mb-5 text-sm">
              <p className="font-semibold text-primary mb-0.5">No payment required</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Place your order and our team will contact you to confirm and arrange delivery.
              </p>
            </div>

            <button
              onClick={() => setStep('order')}
              className="w-full py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
            >
              Proceed to Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Order form ─────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <button
          onClick={() => setStep('cart')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to cart
        </button>

        <h2 className="font-display font-bold text-gray-900 text-xl mb-1">Contact Details</h2>
        <p className="text-gray-400 text-sm mb-6">We&apos;ll use this to confirm your order and arrange delivery.</p>

        <form onSubmit={handleSubmitOrder} className="flex flex-col gap-4">
          {[
            { label: 'Full Name *',      key: 'name'  as const, type: 'text',  placeholder: 'Your full name',        required: true  },
            { label: 'Email Address *',  key: 'email' as const, type: 'email', placeholder: 'you@example.com',       required: true  },
            { label: 'Phone Number *',   key: 'phone' as const, type: 'tel',   placeholder: '+250-796-084-144',      required: true  },
            { label: 'Delivery Address', key: 'address' as const, type: 'text', placeholder: 'Street, district, city', required: false },
          ].map(({ label, key, type, placeholder, required }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                {label}{!required && <span className="text-gray-300 font-normal normal-case"> (optional)</span>}
              </label>
              <input
                required={required}
                type={type}
                value={form[key]}
                onChange={field(key)}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              Order Notes <span className="text-gray-300 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={field('notes')}
              placeholder="Any special requirements or questions…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full bg-primary text-white font-bold text-base hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin block" />
                Placing Order…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Place Order
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order summary sidebar */}
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-display font-bold text-gray-900 text-lg mb-4">Your Order</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={cartItemKey(item)} className="flex items-center gap-3">
                {item.image ? (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" unoptimized />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex-shrink-0 border border-gray-100 flex items-center justify-center text-gray-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    Qty {item.quantity}
                    {item.size  && ` · ${item.size}`}
                    {item.color && ` · ${item.color}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
