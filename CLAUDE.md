# Sheet2bill — Claude Code Guide

## Project Overview

**Sheet2bill** is a SaaS billing platform for freelancers, consultants, and small businesses. It handles the full billing workflow: client management, brief/job creation, invoice generation (PDF via Puppeteer/Chromium), and payment collection.

- **Framework:** Next.js 15 (Pages Router) with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Database & Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Payments:** Razorpay (INR primary, USD secondary)
- **PDF Generation:** `@sparticuz/chromium-min` + `playwright-core`
- **Deployment:** Vercel

## Project Structure

```
src/
  pages/            # Next.js pages (Pages Router)
    api/            # API routes (auth, briefs, clients, invoices, items, payment, profile, subscription, templates)
    dashboard/      # Protected dashboard pages
    billing/        # Billing/subscription pages
    invoices/       # Invoice management
    briefs/         # Brief management
    clients/        # Client CRM
    ...
  components/       # Shared UI components
    ui/             # shadcn/ui base components
    briefs/         # Brief-specific components
    invoices/       # Invoice-specific components
    landing/        # Marketing/landing page components
    ...
  lib/              # Utilities and helpers
    supabase/       # Supabase client setup
    pricing.ts      # Plan config (Starter/Pro limits)
    permission.ts   # Feature gating logic
    utils.ts        # General utilities
    helper.ts       # App-specific helpers
    templates.ts    # Invoice/brief template definitions
  schema/           # Zod validation schemas
  hooks/            # Custom React hooks
  types/            # TypeScript type definitions
  styles/           # Global CSS
  middleware.ts     # Supabase session refresh middleware
```

## Key Concepts

### Subscription Plans (src/lib/pricing.ts)
Two tiers: **Starter** (free) and **Pro Freelancer** (₹299/mo or ₹2999/yr).
- Free: 3 briefs/month, 2 clients, 5 items, 5 inquiries/month, no custom branding
- Pro: 200 briefs/month, 50 clients, 500 items, 200 inquiries/month, custom branding + premium templates

Always check `src/lib/permission.ts` before adding features that should be gated.

### Auth (Supabase)
- Auth is handled by Supabase. Middleware at `src/middleware.ts` refreshes sessions on every request.
- Protected pages use `getServerSideProps` to check session and redirect to `/login`.
- API routes use `createServerSupabaseClient` from `@supabase/auth-helpers-nextjs`.

### API Routes Pattern
All API routes live in `src/pages/api/`. They follow a resource-based structure (`/api/briefs`, `/api/clients`, etc.). Use `req.method` checks for GET/POST/PUT/DELETE within a single file.

### PDF Generation
Invoices/briefs are generated as PDFs via Playwright + `@sparticuz/chromium-min`. This runs server-side only. See `src/pages/api/invoices/` for examples.

### Forms
React Hook Form + Zod schemas (in `src/schema/`). Resolvers via `@hookform/resolvers/zod`.

### State / Data Fetching
TanStack Query (`@tanstack/react-query`) for server state. Providers are in `src/components/providers/`.

## Development Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build (Turbopack)
npm run lint     # ESLint
```

## Environment Variables

Required (set in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

## Code Conventions

- **TypeScript** everywhere — no `any` unless absolutely necessary
- **Pages Router** (not App Router) — do not migrate to App Router
- Components use named exports, not default exports (except pages)
- Tailwind for all styling — no CSS modules or inline styles
- shadcn/ui components live in `src/components/ui/` — extend, don't modify them
- Zod schemas in `src/schema/` for all form/API validation
- Supabase queries go in API routes, not directly in page components

## Important Notes

- Pricing is in **INR** as the primary currency (`src/lib/pricing.ts`)
- The `FeatureGate` component (`src/components/FeatureGate.tsx`) wraps Pro-only UI
- `TrialExpiredBanner` and `UpgradeModal` components handle upsell flows
- CSP headers block iframing (`X-Frame-Options: DENY`) — don't break this
- Supabase storage is used for user logos (remote image domain is already in `next.config.ts`)
