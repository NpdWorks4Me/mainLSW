# Deployment Architecture

This repository contains TWO separate applications:

## 1. Main Site (Vite/React)
**Location:** `src/`  
**Domain:** `littlespaceworld.com`  
**Host:** Hostinger

### Hostinger Configuration
- **Build Command:** `npm install && npm run build`
- **Output Folder:** `dist`
- **Git Branch:** `main`
- **Deploy Folder:** `/` (root)

### How it works:
1. Push to GitHub `main` branch
2. Hostinger automatically pulls and builds
3. Outputs to `dist/`
4. Serves from `public_html/`

---

## Admin Dashboard (removed)

The Admin Dashboard (historically a Next.js app deployed to Vercel) has been removed from this repository. If you need an admin UI in the future, create a dedicated repository (or a separate project) and deploy it independently (Hostinger or a platform of your choice).

> Historical material about deploying the Admin to Vercel has been archived. See `docs/vercel-deploy.md` (DEPRECATED) if you need to reference the old flow.

---

## Domain Setup

### Main Site: littlespaceworld.com
- DNS: Point A record to Hostinger IP
- Configured in: Hostinger hPanel

### Admin: admin.littlespaceworld.com
- DNS: Point CNAME to `cname.vercel-dns.com`
- Configured in: Vercel Dashboard → Project Settings → Domains → Add `admin.littlespaceworld.com`

---

## Environment Variables

### Hostinger (Main Site)
Set in Hostinger hPanel → Website → Advanced → Environment Variables:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

### Vercel (Admin Dashboard)
Set in Vercel Dashboard → Project → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## Quick Deploy Commands

### Deploy Main Site (Hostinger)
```bash
git add .
git commit -m "Update main site"
git push origin main
# Hostinger auto-deploys
```

### Deploy Admin Dashboard (Vercel)
```bash
git add .
git commit -m "Update admin dashboard"
git push testlsw main
# Vercel auto-deploys
```

Or manually trigger:
```bash
vercel --prod
```

---

## Architecture Diagram

```
GitHub Repository (NpdWorks4Me/little)
│
├─ src/           → Vite/React Main Site
│  └─ Push to origin/main → Hostinger builds → littlespaceworld.com
│
└─ app/           → Next.js Admin Dashboard
   └─ Push to testlsw/main → Vercel builds → admin.littlespaceworld.com
```

---

## Why Two Separate Hosts?

1. **Main Site (Hostinger):** 
   - Static Vite build
   - Cheaper hosting
   - Your existing Hostinger business plan

2. **Admin Dashboard (Vercel):**
   - Dynamic Next.js with SSR
   - Server components & API routes
   - Easier serverless functions
   - Auto-scaling
   - Solves your "Hostinger doesn't support dynamic Next.js" problem

---

## Local Development

### Main Site
```bash
npm run dev  # Vite dev server at localhost:5173
```

### Admin Dashboard
```bash
npm run dev  # Next.js dev server at localhost:3000
```

Both run from the same repository but are separate apps!

---

## Troubleshooting

### Main site not updating on Hostinger?
1. Check Hostinger → Deployments → View logs
2. Verify build command runs successfully
3. Check `dist/` folder is generated

### Admin dashboard 404 on Vercel?
1. Check Vercel → Deployments → View logs
2. Verify Next.js detected: `next.config.mjs` exists
3. Check `app/` directory structure is correct

### Both domains pointing to same site?
1. Verify DNS settings
2. Main: A record → Hostinger IP
3. Admin: CNAME → `cname.vercel-dns.com`
