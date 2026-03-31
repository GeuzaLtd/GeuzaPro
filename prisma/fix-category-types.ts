/**
 * One-time migration: stamps correct `type` on existing categories.
 *
 * Logic:
 *   - If a category is linked to ≥1 product  → type = 'product'
 *   - If a category is linked to ≥1 blog      → type = 'blog'
 *   - Linked to both (edge case)              → two rows are created
 *     (one per type) and the original row is updated to whichever has more links
 *   - Unlinked categories                     → left unchanged (no type known)
 *
 * Run once:
 *   npx tsx -r dotenv/config prisma/fix-category-types.ts dotenv_config_path=.env.local
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env'), override: true });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as never);

  // Fetch all categories with their relation counts
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true, blogs: true } },
    },
  });

  console.log(`Found ${categories.length} categories`);

  let updated = 0;
  let skipped = 0;

  for (const cat of categories) {
    const hasProducts = cat._count.products > 0;
    const hasBlogs    = cat._count.blogs    > 0;

    if (!hasProducts && !hasBlogs) {
      console.log(`  SKIP  [${cat.id}] "${cat.name}" — no relations, type stays "${cat.type}"`);
      skipped++;
      continue;
    }

    // Determine the correct type
    // If linked to BOTH, whichever has more links wins; tie → 'product'
    const correctType =
      hasProducts && !hasBlogs   ? 'product'
      : hasBlogs && !hasProducts ? 'blog'
      : cat._count.products >= cat._count.blogs ? 'product'
      : 'blog';

    if (cat.type === correctType) {
      console.log(`  OK    [${cat.id}] "${cat.name}" already type="${correctType}"`);
      skipped++;
      continue;
    }

    // Check if a row with (name, correctType) already exists
    const existing = await prisma.category.findUnique({
      where: { name_type: { name: cat.name, type: correctType } },
    });

    if (existing) {
      // Re-point the product/blog relations to the existing row, then delete duplicate
      if (correctType === 'product') {
        // Move all products from cat.id → existing.id via raw SQL (implicit join table)
        await prisma.$executeRawUnsafe(
          `UPDATE "_CategoryToProduct" SET "B" = $1 WHERE "B" = $2`,
          existing.id, cat.id,
        );
      } else {
        await prisma.blog.updateMany({
          where:  { categoryId: cat.id },
          data:   { categoryId: existing.id },
        });
      }
      await prisma.category.delete({ where: { id: cat.id } });
      console.log(`  MERGE [${cat.id}] "${cat.name}" merged into existing id=${existing.id} type="${correctType}"`);
    } else {
      await prisma.category.update({
        where: { id: cat.id },
        data:  { type: correctType },
      });
      console.log(`  FIX   [${cat.id}] "${cat.name}" ${cat.type} → ${correctType}`);
    }
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}, Skipped/Already correct: ${skipped}`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
