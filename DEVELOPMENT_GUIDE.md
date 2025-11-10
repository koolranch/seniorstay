# Development Guide - Guide for Seniors

## 📁 Project Structure

**Working Directory:** `/Users/christopherray/Documents/guideforseniors/seniorstay/`

**This is your ONLY development directory.** Work here always.

---

## 🚀 Local Development

```bash
# Navigate to project
cd /Users/christopherray/Documents/guideforseniors/seniorstay

# Install dependencies (first time or after package.json changes)
npm install

# Run development server
npm run dev

# Open browser to: http://localhost:3000
```

---

## 📦 Git Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Brief description of changes"

# Push to GitHub (triggers Vercel deployment)
git push origin main

# View history
git log --oneline -10
```

---

## 🌐 Deployment

**Production URL:** https://www.guideforseniors.com

**How it works:**
1. You push to GitHub (`git push origin main`)
2. Vercel detects the push automatically
3. Vercel builds the site (~3 minutes)
4. Vercel deploys to production (~1 minute)
5. Changes appear on guideforseniors.com

**Total time:** ~4-5 minutes from push to live

**Monitor deployments:**
- Go to https://vercel.com/dashboard
- View your project
- Check "Deployments" tab

---

## 🔧 Environment Variables

**Local:** `.env.local` (not committed to git)
**Production:** Set in Vercel Dashboard → Settings → Environment Variables

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

---

## 📝 Important Files

- `src/app/page.tsx` - Homepage
- `src/components/` - Reusable components
- `src/data/blog-posts.ts` - Blog content
- `src/app/blog/` - Blog pages
- `package.json` - Dependencies
- `vercel.json` - Vercel configuration

---

## 🐛 Troubleshooting

**Changes not showing on live site?**
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Check Vercel dashboard - deployment successful?
3. Check commit was pushed: `git log --oneline -5`
4. Try incognito/private browser window

**Build failing?**
1. Run `npm run build` locally to test
2. Fix any TypeScript/linting errors
3. Commit and push again

**Need to rollback?**
1. Go to Vercel Deployments
2. Find a previous working deployment
3. Click "⋯" menu → "Promote to Production"

---

## 📚 Resources

- **GitHub Repo:** https://github.com/koolranch/seniorstay
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Next.js Docs:** https://nextjs.org/docs

---

## ⚠️ Important Notes

- **Never create multiple local copies of this repo** - causes confusion
- **Always pull before starting work:** `git pull origin main`
- **Test locally before pushing** - run `npm run dev`
- **Vercel deploys from GitHub** - make sure to push your changes

---

## 🎯 Recent Major Changes

**Nov 10, 2025:**
- ✅ Optimized homepage to show only Assisted Living & Memory Care
- ✅ Removed skilled nursing CTAs (SEO only, no lead gen)
- ✅ Added 6 blog posts with react-markdown
- ✅ Cleaned up duplicate `airbnb-clone-OLD` directory
- ✅ UI/UX polish: better spacing, larger images, cleaner typography

---

**Last Updated:** November 10, 2025

