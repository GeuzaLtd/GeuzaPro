/**
 * Production data import script.
 * Reads all JSON exports from my-data/ and inserts them into the prod DB
 * defined in .env.prod, respecting foreign key order.
 *
 * Run after `prisma db push` against the prod DB:
 *   npx dotenv -e .env.prod -- npx prisma db push
 *   npx dotenv -e .env.prod -- npx tsx prisma/import-prod.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '../.env.prod') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL missing in .env.prod');

const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

const DATA = resolve(__dirname, '../my-data');

function load(file: string) {
  return JSON.parse(readFileSync(resolve(DATA, file), 'utf8'));
}

function parseArr(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.startsWith('[')) {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}

function parseDate(val: string | null | undefined): Date | null {
  if (!val) return null;
  return new Date(val.replace(' ', 'T') + (val.includes('+') ? '' : 'Z'));
}

async function resetSequences() {
  const tables = [
    'users', 'categories', 'products', 'product_images',
    'blogs', 'carts', 'cart_items', 'orders', 'order_items',
    'donations', 'employees', 'partners', 'testimonials',
    'hero_images', 'messages',
  ];
  for (const t of tables) {
    await pool.query(
      `SELECT setval(pg_get_serial_sequence('"${t}"', 'id'), COALESCE((SELECT MAX(id) FROM "${t}"), 1))`
    );
  }
}

async function main() {
  console.log('Starting production data import…\n');

  // 1. Users
  const users = load('users_rows.json');
  console.log(`Inserting ${users.length} users…`);
  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id:        u.id,
        name:      u.name,
        email:     u.email,
        password:  u.password,
        phone:     u.phone ?? null,
        avatar:    u.avatar ?? null,
        role:      u.role,
        isVisible: u.isVisible,
        createdAt: parseDate(u.createdAt)!,
        updatedAt: parseDate(u.updatedAt)!,
      },
    });
  }

  // 2. Categories
  const categories = load('categories_rows.json');
  console.log(`Inserting ${categories.length} categories…`);
  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id:        c.id,
        name:      c.name,
        type:      c.type,
        isVisible: c.isVisible,
      },
    });
  }

  // 3. Employees
  const employees = load('employees_rows.json');
  console.log(`Inserting ${employees.length} employees…`);
  for (const e of employees) {
    await prisma.employee.upsert({
      where: { id: e.id },
      update: {},
      create: {
        id:         e.id,
        name:       e.name,
        role:       e.role,
        department: e.department ?? null,
        email:      e.email ?? null,
        phone:      e.phone ?? null,
        avatar:     e.avatar ?? null,
        bio:        e.bio ?? null,
        order:      e.order ?? null,
        isVisible:  e.isVisible,
        createdAt:  parseDate(e.createdAt)!,
      },
    });
  }

  // 4. Partners
  const partners = load('partners_rows (1).json');
  console.log(`Inserting ${partners.length} partners…`);
  for (const p of partners) {
    await prisma.partner.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id:           p.id,
        name:         p.name,
        type:         p.type ?? null,
        logo:         p.logo ?? null,
        website:      p.website ?? null,
        description:  p.description ?? null,
        contactName:  p.contactName ?? null,
        contactEmail: p.contactEmail ?? null,
        contactPhone: p.contactPhone ?? null,
        country:      p.country ?? null,
        isVisible:    p.isVisible,
        createdAt:    parseDate(p.createdAt)!,
      },
    });
  }

  // 5. Testimonials
  const testimonials = load('testimonials_rows (1).json');
  console.log(`Inserting ${testimonials.length} testimonials…`);
  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id:        t.id,
        name:      t.name,
        role:      t.role ?? null,
        company:   t.company ?? null,
        avatar:    t.avatar ?? null,
        quote:     t.quote,
        rating:    t.rating,
        featured:  t.featured,
        isVisible: t.isVisible,
        createdAt: parseDate(t.createdAt)!,
      },
    });
  }

  // 6. Hero images
  const heroImages = load('hero_images_rows.json');
  console.log(`Inserting ${heroImages.length} hero images…`);
  for (const h of heroImages) {
    await prisma.heroImage.upsert({
      where: { id: h.id },
      update: {},
      create: {
        id:        h.id,
        url:       h.url,
        publicId:  h.publicId ?? '',
        alt:       h.alt ?? '',
        page:      h.page ?? 'home',
        isVisible: h.isVisible,
        order:     h.order ?? 0,
        createdAt: parseDate(h.createdAt)!,
      },
    });
  }

  // 7. Messages
  const messages = load('messages_rows.json');
  console.log(`Inserting ${messages.length} messages…`);
  for (const m of messages) {
    await prisma.message.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id:               m.id,
        fullName:         m.fullName,
        email:            m.email,
        phone:            m.phone ?? null,
        organizationType: m.organizationType ?? null,
        message:          m.message,
        isRead:           m.isRead,
        createdAt:        parseDate(m.createdAt)!,
      },
    });
  }

  // 8. Products
  const products = load('products_rows (1).json');
  console.log(`Inserting ${products.length} products…`);
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id:          p.id,
        name:        p.name,
        description: p.description ?? null,
        price:       p.price,
        stock:       p.stock,
        status:      p.status,
        isVisible:   p.isVisible,
        sizes:       parseArr(p.sizes),
        colors:      parseArr(p.colors),
        minOrder:    p.minOrder ?? 1,
        createdAt:   parseDate(p.createdAt)!,
        updatedAt:   parseDate(p.updatedAt)!,
      },
    });
  }

  // 9. Product images
  const productImages = load('product_images_rows.json');
  console.log(`Inserting ${productImages.length} product images…`);
  for (const img of productImages) {
    await prisma.productImage.upsert({
      where: { id: img.id },
      update: {},
      create: {
        id:        img.id,
        productId: img.productId,
        url:       img.url,
        isPrimary: img.isPrimary,
      },
    });
  }

  // 10. Category ↔ Product join table (raw SQL — Prisma doesn't expose implicit join tables directly)
  const catProducts = load('_CategoryToProduct_rows.json');
  console.log(`Inserting ${catProducts.length} category-product links…`);
  for (const row of catProducts) {
    await pool.query(
      `INSERT INTO "_CategoryToProduct" ("A","B") VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [row.A, row.B]
    );
  }

  // 11. Blogs
  const blogs = load('blogs_rows (1).json');
  console.log(`Inserting ${blogs.length} blogs…`);
  for (const b of blogs) {
    await prisma.blog.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id:          b.id,
        title:       b.title,
        slug:        b.slug,
        content:     b.content,
        excerpt:     b.excerpt ?? null,
        coverImage:  b.coverImage ?? null,
        authorId:    b.authorId ?? null,
        categoryId:  b.categoryId ?? null,
        readTime:    b.readTime ?? null,
        tags:        parseArr(b.tags),
        images:      parseArr(b.images),
        status:      b.status,
        isVisible:   b.isVisible,
        publishedAt: parseDate(b.publishedAt),
        createdAt:   parseDate(b.createdAt)!,
        updatedAt:   parseDate(b.updatedAt)!,
      },
    });
  }

  // 12. Carts
  const carts = load('carts_rows.json');
  console.log(`Inserting ${carts.length} carts…`);
  for (const c of carts) {
    await prisma.cart.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id:        c.id,
        userId:    c.userId,
        createdAt: parseDate(c.createdAt)!,
        updatedAt: parseDate(c.updatedAt)!,
      },
    });
  }

  // 13. Cart items
  const cartItems = load('cart_items_rows.json');
  console.log(`Inserting ${cartItems.length} cart items…`);
  for (const ci of cartItems) {
    await prisma.cartItem.upsert({
      where: { id: ci.id },
      update: {},
      create: {
        id:        ci.id,
        cartId:    ci.cartId,
        productId: ci.productId,
        quantity:  ci.quantity,
        size:      ci.size ?? null,
        color:     ci.color ?? null,
      },
    });
  }

  // 14. Orders
  const orders = load('orders_rows.json');
  console.log(`Inserting ${orders.length} orders…`);
  for (const o of orders) {
    await prisma.order.upsert({
      where: { id: o.id },
      update: {},
      create: {
        id:              o.id,
        orderNumber:     o.orderNumber,
        userId:          o.userId ?? null,
        guestName:       o.guestName ?? null,
        guestEmail:      o.guestEmail ?? null,
        guestPhone:      o.guestPhone ?? null,
        status:          o.status,
        shippingAddress: o.shippingAddress ?? null,
        notes:           o.notes ?? null,
        createdAt:       parseDate(o.createdAt)!,
        updatedAt:       parseDate(o.updatedAt)!,
      },
    });
  }

  // 15. Order items
  const orderItems = load('order_items_rows.json');
  console.log(`Inserting ${orderItems.length} order items…`);
  for (const oi of orderItems) {
    await prisma.orderItem.upsert({
      where: { id: oi.id },
      update: {},
      create: {
        id:        oi.id,
        orderId:   oi.orderId,
        productId: oi.productId,
        quantity:  oi.quantity,
        size:      oi.size ?? null,
        color:     oi.color ?? null,
      },
    });
  }

  // 16. Donations
  const donations = load('donations_rows.json');
  console.log(`Inserting ${donations.length} donations…`);
  for (const d of donations) {
    await prisma.donation.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id:         d.id,
        donorName:  d.donorName,
        email:      d.email,
        phone:      d.phone ?? null,
        amount:     d.amount,
        currency:   d.currency ?? 'RWF',
        message:    d.message ?? null,
        userId:     d.userId ?? null,
        status:     d.status,
        paymentRef: d.paymentRef ?? null,
        createdAt:  parseDate(d.createdAt)!,
      },
    });
  }

  // Reset all sequences so new inserts get correct IDs
  console.log('\nResetting DB sequences…');
  await resetSequences();

  console.log('\n✓ Import complete.');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(async (e) => {
  console.error('Import failed:', e);
  await prisma.$disconnect();
  await pool.end();
  process.exit(1);
});
