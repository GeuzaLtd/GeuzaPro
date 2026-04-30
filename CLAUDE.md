# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Next.js dev server on localhost:3000
npm run build        # production build
npm run lint         # ESLint (eslint-config-next)
npm run seed:products  # seed product data via prisma/seed-products.ts
npm run seed:content   # seed blog/content data via prisma/seed-content.ts
```

Database migrations:
```bash
npx prisma migrate dev --name <migration-name>
npx prisma db push      # push schema without migration history
npx prisma studio       # open Prisma Studio GUI
```

There are no automated tests.

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — NextAuth.js secret
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_SITE_URL` — canonical site URL (defaults to `https://geuza.africa`)

## Architecture

### Tech Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Prisma 7** with `@prisma/adapter-pg` (raw `pg` pool, not native Prisma connector)
- **NextAuth v5 (beta)** — JWT strategy, credentials + Google OAuth
- **Cloudinary** — image hosting for products, blogs, employees
- **Tailwind CSS v4** + **Framer Motion** + **TipTap** (rich-text blog editor)

### Directory Layout

```
actions/        # all server actions ("use server") — one file per domain
app/            # Next.js App Router pages and route-level components
  (public routes) blog/, cart/, company/, donate/, products/, shop/, sign-in/, sign-up/, profile/
  dashboard/    # admin-only area; no auth guard in layout (guarded per-page)
  api/auth/     # NextAuth catch-all route handler only
components/     # shared UI
  dashboard/    # reusable admin UI (Sidebar, AdminTable, BlogEditor, ImageUploadSlot, etc.)
lib/            # singletons and context
  prisma.ts     # singleton Prisma client (pg pool + PrismaPg adapter)
  auth.ts       # NextAuth config (providers, callbacks, JWT/session shaping)
  cart-context.tsx  # CartProvider + useCart hook
  cloudinary.ts # cloudinary v2 singleton
prisma/
  schema.prisma # single source of truth for DB schema
  seed-*.ts     # seeding scripts (run via npx tsx)
```

### Data Flow

**Server Actions** (`actions/`) are the only write path. Pages and client components call them directly — there are no REST API routes for data (only `app/api/auth/` exists for NextAuth).

**Prisma singleton** in `lib/prisma.ts` uses `globalThis` to prevent connection pool exhaustion during hot-reload in dev.

### Authentication

`lib/auth.ts` exports `{ handlers, signIn, signOut, auth }` from NextAuth. The session carries `user.id` (DB integer cast to string) and `user.role` (`user` | `admin` | `donor`). Google OAuth users are auto-created in the DB on first sign-in inside the `signIn` callback.

The `loginAction` in `actions/auth.ts` verifies credentials manually before calling NextAuth's `signIn()` to work around a known Auth.js v5 false-positive `CredentialsSignin` throw.

### Cart System

`lib/cart-context.tsx` implements a hybrid cart:
- **Guests**: state lives in `localStorage` under key `geuza_cart_v1`
- **Authenticated users**: state syncs to the DB (via `actions/cart.ts`) with an 800 ms debounce
- On sign-in, local guest items are merged into the DB cart; on sign-out, local state is cleared

Cart items are keyed by `productId::size::color` (see `cartItemKey`).

### Image Uploads

All image uploads go through `actions/upload.ts` → `lib/cloudinary.ts`. Images are stored in Cloudinary folders named after domain (`products`, `blogs`, `employees`, etc.) with auto quality/format optimization.

### Prisma Schema Conventions

- `isVisible` boolean controls soft-visibility (not hard delete) for most entities
- `Category.type` field distinguishes `product` vs `blog` categories
- Orders support both authenticated users (`userId`) and guests (`guestName`/`guestEmail`)
- `Product` has a many-to-many relation with `Category` (one product can belong to multiple categories)

### Path Alias

`@/*` maps to the project root. Use `@/lib/...`, `@/actions/...`, `@/components/...` everywhere.

### Dashboard

`app/dashboard/` is the admin area. Each section (`products`, `blog`, `users`, `orders`, etc.) follows the pattern: `page.tsx` (server, fetches data) → `_components/XView.tsx` (client, renders table + modals). Shared admin UI lives in `components/dashboard/`.
