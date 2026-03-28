/**
 * Product seed — migrates products from the old Geuza schema to the new one.
 *
 * Old schema differences:
 *   - id was a UUID string  → new id is auto-increment Int (ignored)
 *   - minimum / maximum     → these were ORDER QUANTITY ranges, not prices
 *                             the old system had NO price field
 *                             → prices below are set manually (update as needed)
 *   - thumbnailImage        → becomes ProductImage with isPrimary = true
 *   - images (array)        → become ProductImage with isPrimary = false
 *   - sizes / colors        → new fields added to Product schema
 *   - category              → inferred from product name, created in categories table
 *
 * Run: npx tsx -r dotenv/config prisma/seed-products.ts dotenv_config_path=.env.local
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env'), override: true });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;

// Pool and Prisma are created inside main() so that dotenv has already set env vars
let pool: InstanceType<typeof Pool>;
let prisma: PrismaClient;

// ─── Category definitions ─────────────────────────────────────────────────────
const PRODUCT_CATEGORIES = [
  'Wheelchair',
  'Crutches',
  'Walking Aid',
  'Prosthetics',
  'Cane',
  'Transfer Aid',
  'Daily Living',
];

// ─── Product data (migrated + enriched) ──────────────────────────────────────
//
// PRICES are in RWF. The old system stored no prices — update these values
// before running if you have the actual product prices.
//
const products = [
  {
    name: 'Wheelchair',
    description:
      'A wheelchair is a chair with wheels that is used when walking is difficult or impossible due to illness, injury, problems related to old age, or disability.',
    price: 150_000,     // RWF — update to actual price
    stock: 30,
    status: 'in_stock',
    isVisible: true,
    category: 'Wheelchair',
    sizes: ['XXL', 'XL', 'L', 'M', 'S', 'XS'],
    colors: ['W', 'B', 'Y', 'G', 'R'],
    minOrder: 10,
    thumbnailImage: 'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1755080992/products/q68erpnhj4ufmc4qmy9w.png',
    images: [
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1755080993/products/ycc0ehzspgen0ludifkj.jpg',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1755080994/products/cv58b0lfgx9iakmbzxuo.jpg',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1755080995/products/hydov3se7m08vvqpurph.webp',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1755080995/products/nulfrn991ljosiguv2uc.webp',
    ],
  },
  {
    name: 'Axillary Crutches',
    description:
      'Crutches are medical devices designed to aid in ambulation, by transferring body weight from the legs to the torso and arms.',
    price: 25_000,      // RWF — update to actual price
    stock: 50,
    status: 'in_stock',
    isVisible: true,
    category: 'Crutches',
    sizes: ['S', 'M', 'L'],
    colors: ['B', 'G'],
    minOrder: 1,
    thumbnailImage: 'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754907082/products/wm0h4pkpqwq1x3j8hnks.avif',
    images: [
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754907083/products/e1ymahg4pweza4hl4wg3.jpg',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754907084/products/szfrefghag9kbtaublbq.jpg',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754907084/products/i3g3tzejkctpkvwvcfy8.webp',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754907085/products/czfa5oin1ckyv1aqckww.png',
    ],
  },
  {
    name: 'Elbow Crutches',
    description:
      'Mobility aid in cases involving fractures, for ambulation by amputees of the lower limb.',
    price: 30_000,      // RWF — update to actual price
    stock: 40,
    status: 'in_stock',
    isVisible: true,
    category: 'Crutches',
    sizes: ['XXL', 'XL', 'L', 'M', 'S', 'XS'],
    colors: ['W', 'B', 'Y', 'G', 'R'],
    minOrder: 10,
    thumbnailImage: 'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754906531/products/bms5ejdodaetotf19y8z.jpg',
    images: [
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754906532/products/gsgysjkij7wyhplnjf56.webp',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754906532/products/pzzqsvbsjwlrov4cack9.jpg',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754906533/products/tw0qeddedjt02mtudagi.jpg',
    ],
  },
  {
    name: 'Leg Prosthetics',
    description:
      'A leg prosthetic is an artificial device that replaces a missing part of the leg, from the foot to the hip, to restore function and appearance. These devices are used by individuals who have had an amputation or have a birth defect affecting their leg.',
    price: 800_000,     // RWF — update to actual price
    stock: 10,
    status: 'in_stock',
    isVisible: true,
    category: 'Prosthetics',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['W', 'B', 'G', 'Y', 'R'],
    minOrder: 1,
    thumbnailImage: 'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1762338815/products/dp1zqxqconlyauumbnsu.jpg',
    images: [
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1762338816/products/vgs7r9cxhch4schagbiq.jpg',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1762338817/products/u9vrhy3s4y5hz2zkq2so.jpg',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1762338818/products/xnfndkhb1dtg8x7xbhio.webp',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1762338819/products/tkz35hmkwexiwtoxgdqy.jpg',
    ],
  },
  {
    name: 'Walkers',
    description:
      'Make it easier to get around after surgery, a bone break in your foot or leg, arthritis, leg weakness, or leg instability.',
    price: 45_000,      // RWF — update to actual price
    stock: 0,
    status: 'out_stock',
    isVisible: false,   // was "Coming soon..." in old system
    category: 'Walking Aid',
    sizes: ['XXL', 'XL', 'L', 'M', 'S', 'XS'],
    colors: ['W', 'B', 'Y', 'G', 'R'],
    minOrder: 10,
    thumbnailImage: 'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754905813/products/goy6399n845elqmk22wm.jpg',
    images: [
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754905814/products/pgqmszdnytpluxlkoydd.webp',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754905814/products/locdpfvekbezi8tylyw5.webp',
      'https://res.cloudinary.com/dnhpiwpbj/image/upload/v1754905815/products/ht6a46hqo5il2fk2vrug.jpg',
    ],
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set — check your .env file');
  pool   = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool as any);
  prisma = new PrismaClient({ adapter } as any);

  console.log('🌱 Seeding product categories...');

  // Upsert all product categories
  const categoryMap = new Map<string, number>();
  for (const name of PRODUCT_CATEGORIES) {
    const cat = await prisma.category.upsert({
      where: { name_type: { name, type: 'product' } },
      update: {},
      create: { name, type: 'product', isVisible: true },
    });
    categoryMap.set(name, cat.id);
    console.log(`  ✓ Category: ${name} (id=${cat.id})`);
  }

  console.log('\n🌱 Seeding products...');

  for (const p of products) {
    const categoryId = categoryMap.get(p.category);

    // Skip if product with same name already exists
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) {
      console.log(`  ⚠ Skipped (already exists): ${p.name}`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        name:        p.name,
        description: p.description,
        price:       p.price,
        stock:       p.stock,
        status:      p.status,
        isVisible:   p.isVisible,
        categoryId:  categoryId ?? null,
        sizes:       p.sizes,
        colors:      p.colors,
        minOrder:    p.minOrder,
        images: {
          create: [
            { url: p.thumbnailImage, isPrimary: true },
            ...p.images.map((url) => ({ url, isPrimary: false })),
          ],
        },
      },
    });

    console.log(`  ✓ Product: "${product.name}" (id=${product.id}, category=${p.category}, images=${p.images.length + 1})`);
  }

  console.log('\n✅ Done. Update the prices in the dashboard — they are placeholder values.');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
