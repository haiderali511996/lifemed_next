# Lifemed Pharma — React to Next.js Migration Guide

## What Changes, What Stays the Same

### ✅ NO CHANGES NEEDED
- `server/` — entire backend stays exactly the same
- All CSS files — copy them as-is
- Context files (AuthContext, CartContext) — copy as-is
- All component logic — same code, minor syntax changes

### 🔄 WHAT CHANGES
- `client/` folder → `lifemed-next/` (new Next.js app)
- `react-router-dom` → Next.js file-based routing
- `<Link to="">` → `<Link href="">` (from 'next/link')
- `useNavigate()` → `useRouter()` (from 'next/navigation')
- `<img>` → `<Image>` (from 'next/image') for optimization
- Each page gets its own `metadata` export for SEO

---

## Setup

```bash
cd lifemed-next
npm install
npm run dev
# Runs on http://localhost:3000
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## File Structure

```
lifemed-next/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.js           # Root layout (Header, Footer, Providers)
│   │   ├── page.js             # Home /
│   │   ├── shop/page.js        # /shop
│   │   ├── product/[id]/       # /product/:id  (dynamic)
│   │   ├── blog/page.js        # /blog
│   │   ├── blog/[slug]/        # /blog/:slug   (dynamic + SSG)
│   │   ├── about/page.js       # /about
│   │   ├── contact/page.js     # /contact
│   │   ├── register/page.js    # /register
│   │   ├── login/page.js       # /login
│   │   ├── verify-email/page.js
│   │   ├── checkout/page.js
│   │   ├── cart/page.js
│   │   ├── order-success/page.js
│   │   ├── admin/              # Admin panel (protected)
│   │   ├── sitemap.js          # Auto-generated sitemap.xml
│   │   ├── robots.js           # robots.txt
│   │   └── globals.css         # Your existing index.css
│   ├── components/
│   │   ├── layout/             # Header.js, Footer.js (same files)
│   │   └── admin/              # AdminLayout.js (same file)
│   ├── context/
│   │   ├── AuthContext.js      # Same file
│   │   └── CartContext.js      # Same file
│   └── utils/
│       └── dummyData.js        # Same file
├── public/                     # Static files
├── next.config.js
└── package.json
```

---

## Key Code Changes When Converting Pages

### 1. Navigation
```js
// React (old)
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/shop');

// Next.js (new)
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/shop');
```

### 2. Links
```js
// React (old)
import { Link } from 'react-router-dom';
<Link to="/shop">Shop</Link>

// Next.js (new)
import Link from 'next/link';
<Link href="/shop">Shop</Link>
```

### 3. URL Params
```js
// React (old)
import { useParams } from 'react-router-dom';
const { id } = useParams();

// Next.js (new) — passed as props
export default function Page({ params }) {
  const { id } = params;
}
```

### 4. Search Params
```js
// React (old)
import { useSearchParams } from 'react-router-dom';

// Next.js (new)
import { useSearchParams } from 'next/navigation';
// Same API!
```

### 5. Client Components
Add `'use client';` at the top of any component that uses:
- useState, useEffect, useContext
- onClick, onChange handlers
- useRouter, useSearchParams
- Browser APIs (localStorage, window)

### 6. Images (for optimization)
```js
// React (old)
<img src={url} alt="product" />

// Next.js (new)
import Image from 'next/image';
<Image src={url} alt="product" width={400} height={400} />
```

---

## SEO Benefits

| Feature | React (old) | Next.js (new) |
|---------|------------|---------------|
| Google crawling | ❌ JS rendered | ✅ HTML rendered |
| Page titles | ❌ Client only | ✅ Server metadata |
| Open Graph | ❌ Manual | ✅ Per-page metadata |
| Sitemap | ❌ Manual | ✅ Auto-generated |
| robots.txt | ❌ Manual | ✅ Auto-generated |
| Blog SEO | ❌ Poor | ✅ Full article schema |
| Product SEO | ❌ Poor | ✅ Dynamic per product |
| Page speed | 🟡 Bundle | ✅ Optimized |
| Image optimization | ❌ None | ✅ next/image |

---

## Deployment (Vercel — recommended for Next.js)

```bash
npm install -g vercel
vercel
```

Set environment variable in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://lifemedpharmaceutical.com/bakend
```
