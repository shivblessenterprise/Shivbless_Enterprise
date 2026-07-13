# Shivbless Enterprise

Premium product catalogue website for Shivbless Enterprise. Browse curated products and shop securely via Meesho and Flipkart.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/                  # App Router pages
│   ├── admin/            # Product management dashboard
│   ├── about/
│   ├── contact/
│   ├── shop/
│   ├── products/[slug]/
│   ├── categories/
│   ├── wishlist/
│   ├── privacy-policy/
│   ├── terms/
│   └── disclaimer/
├── components/           # Reusable UI components
├── data/                 # Mock products & categories
├── hooks/                # Wishlist, search, filters
├── lib/                  # Utilities, SEO helpers
└── types/                # TypeScript types
```

## Business Model

This site is a **product catalogue only**. It does not process payments or orders. All purchases redirect to Meesho or Flipkart product listings.

## Admin Access

Visit `/admin` and use the password: `shivbless2024`

(Change this in `src/lib/admin.ts` before production.)

## Environment

Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_CONTACT_EMAIL=hello@shivblessenterprise.com
ADMIN_PASSWORD=your-secure-password
```

## Reliable product + image setup (recommended)

Meesho public site scraping is blocked and breaks often. This site stores your
catalogue on **your server** so products/images keep working.

### Best workflow (no recurring problems)

1. Open Admin → http://localhost:3000/admin (password in `.env.local`)
2. Click **Load Meesho Catalogue** (loads your 22 shop products once)
3. Edit each product → **Upload product photos** (saved to `public/uploads/products`)
4. Click **Save to Server** (writes `data/catalog.json`)

Or bulk import:

1. Download `/templates/meesho-products-import.csv`
2. Fill title, price, image, Meesho URL
3. Admin → **Import CSV / JSON**

### About Meesho Supplier Panel / DevTools

- `sentryReplaySession` in Session Storage is **NOT** an API key
- Official live sync needs **Settings → API Access** key from Meesho (if enabled)
- Put key in `.env.local` as `MEESHO_SUPPLIER_API_KEY=...`

## Meesho product sync

Website loads your Meesho shop catalogue (22 products) automatically.

- Admin → **Sync Meesho Products** refreshes the catalogue
- For **live** API sync from Meesho Supplier Panel, add `MEESHO_SUPPLIER_API_KEY` in `.env.local` (from [supplier.meesho.com](https://supplier.meesho.com) → API Access)
- Shop URL: https://www.meesho.com/Shivbless89364?ms=2

## Connecting a Real Backend

Product data lives in `src/data/products.json` and is managed via localStorage in the admin panel for demos. Replace `src/lib/products.ts` with Firebase, Supabase, MongoDB, or a custom API when ready.

## License

Private — Shivbless Enterprise. All rights reserved.
