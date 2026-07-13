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
NEXT_PUBLIC_CONTACT_EMAIL=shivblessenterprise@gmail.com
ADMIN_PASSWORD=your-secure-password
MONGODB_URI=mongodb+srv://USER:PASSWORD@HOST/shivbless?retryWrites=true&w=majority
MONGODB_DB=shivbless
```

## Product management

1. Open Admin → `/admin`
2. **Add New Product** — name, price, photo, Meesho/Flipkart buy link
3. Photos save to MongoDB (GridFS)
4. Catalogue saves to MongoDB

Meesho/Flipkart links are for **Buy / Visit shop** only — products are not fetched from Meesho.

## License

Private — Shivbless Enterprise. All rights reserved.
