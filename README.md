# ElectroStore

A simple electronics store demo built with **Next.js 15 (App Router)**, **shadcn/ui**, **Tailwind CSS v4**, **NextAuth.js** (authentication), **MongoDB** (native driver), **Cloudinary** (image hosting), and **react-hook-form** for product forms. This repository is an assignment-ready project with public product browsing and a protected product management dashboard.

---

## Live demo
Live Demo: [ElectroStore on Vercel](https://electro-store-nine.vercel.app/)


---

## Key features

* Landing page with hero, product highlights, and footer
* Public product list and product details
* Authentication with NextAuth (Google + Credentials)
* Protected dashboard for adding products (server-side upload to Cloudinary)
* Product add form with image preview using **react-hook-form** and validation
* Search, sort, and pagination for product listings
* Dark / light theme toggle using `next-themes` and Tailwind `class` strategy

---

## Tech stack

* Next.js 15 (App Router)
* React 18+ (Client & Server components)
* Tailwind CSS v4
* shadcn/ui (component primitives)
* next-auth for authentication
* MongoDB (native driver) for data
* Cloudinary for image hosting
* react-hook-form for forms
* sonner for toasts

---

## Project structure (high level)

```
src/ or app/
├─ app/
│  ├─ api/
│  │  ├─ auth/[...nextauth]/route.ts       # NextAuth route
│  │  ├─ products/route.ts                 # GET (filter/sort) & POST (create)
│  │  └─ products/[id]/route.ts            # GET single product
│  ├─ dashboard/
│  │  └─ add-product/page.tsx             # Protected add product page
│  ├─ products/
│  │  ├─ page.tsx                         # Product list page
│  │  └─ [id]/page.tsx                    # Product details page
│  └─ page.tsx                            # Landing page
├─ components/
│  ├─ Navbar.tsx
│  ├─ ThemeToggle.tsx
│  ├─ ProductCard.tsx
│  ├─ ProductListClient.tsx
│  ├─ AddProductForm.tsx
│  └─ Hero.tsx, Footer.tsx, ProductHighlights.tsx
├─ lib/
│  └─ mongodb.ts                          # MongoDB client helper 
└─ next.config.js
```

Adjust paths if your project places `components` under `src/components`.

---

## Environment variables (`.env.local`)

Create a `.env.local` in your project root and add the variables below. Example:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# MongoDB (connection string)
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional: enable NextAuth debug logs
NEXTAUTH_DEBUG=true
```

> **Security**: never commit `.env.local` to source control. Use Vercel's Environment Variables UI for production.

---

## Setup & Development

### Prerequisites

* Node.js 18+ (recommended)
* npm or pnpm
* MongoDB accessible (Atlas recommended)
* Cloudinary account for image uploads (or adapt to another provider)

### Install

```bash
git clone https://github.com/rakibhasansohag/ElectroStore
cd electrostore
npm install
# or: pnpm install
```

### Local dev

```bash
cp .env.example .env.local # or create .env.local manually
npm run dev
# open http://localhost:3000
```

### Build & Production

```bash
npm run build
npm start
```

For Vercel deployment, connect your GitHub repo and set the environment variables in the Vercel dashboard. Make sure `NEXTAUTH_URL` points to your Vercel URL in production.

---

## API Routes

* `GET /api/products` — list products with query params: `search`, `sort` (`newest|oldest|price_asc|price_desc`), `page`, `limit`.
* `POST /api/products` — create product. Accepts multipart form data including `image` file (server uploads to Cloudinary). Required fields: `name`, `description`, `price`, `image`.
* `GET /api/products/:id` — get single product by `_id`.
* NextAuth endpoints: `/api/auth/*` (handled by NextAuth route).

---

## Important implementation notes

* **Auth & protected pages**: middleware restricts `/dashboard` routes. NextAuth uses JWT sessions. Ensure `NEXTAUTH_SECRET` is stable across restarts and in production.
* **Database**: using the native MongoDB driver (no mongoose). `lib/mongodb.ts` exports `getDb()` and caches connections in development to avoid duplicate connections.
* **Image upload**: images are converted to Data URI and uploaded to Cloudinary server-side. You can change to direct unsigned uploads to Cloudinary for better performance.
* **Tailwind**: uses `darkMode: 'class'` and `next-themes` for toggling. Theme toggle stored in `localStorage`.
* **Case-sensitive imports**: on Windows dev machines you might import `@/components/ui/Input` vs `input.tsx` — ensure actual filenames and imports match exactly (case matters for Linux / Vercel builds).

---

## Troubleshooting (common issues)

### `Invalid URL` or `Failed to construct 'URL'` during `signIn()`

* Ensure you pass an absolute `callbackUrl` to `signIn()` or handle `redirect: false` and `router.push()` after sign-in. See login page implementation which normalizes callback URLs.

### `JWEDecryptionFailed` or next-auth session decryption errors

* Clear cookies and ensure `NEXTAUTH_SECRET` is unchanged across restarts. Set `NEXTAUTH_DEBUG=true` to see more logs.

### Vercel build type errors for API routes

* If you use Node-only libs (mongodb, cloudinary) in route handlers, add `export const runtime = 'nodejs';` at the top of that route file. If Vercel complains about typing, see the repo's `app/api/products/[id]/route.ts` which uses `// @ts-nocheck` to bypass strict signature mismatch.

### Images not loading in `next/image`

* Add Cloudinary remote pattern to `next.config.js`:

```js
module.exports = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**.cloudinary.com' }],
  },
};
```

---

## 📌 Routes Summary
- `/` — Landing page (Hero, highlights, footer)
- `/login` & `/signup` — Authentication flows (NextAuth)
- `/products` — Product list with search + sort
- `/products/[id]` — Product details
- `/dashboard/add-product` — Protected add-product page

---

## 🔮 Future Improvements
- Using direct (unsigned) Cloudinary uploads from client to reduce server bandwidth and speed up uploads.
- Add server-side validation with `zod` or `yup` for stronger guarantees.
- Add product edit/delete with authorization checks and Cloudinary image deletion.
- Add unit/integration tests for API routes.
- Improve search performance with MongoDB text indexes or 

