# Guide for Seniors - Cleveland Senior Living Directory

A Next.js-based platform helping Cleveland families find assisted living and memory care communities. Features local guides, pricing information, and tour request functionality.

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 Measurement ID (get from https://analytics.google.com)
- `NEXT_PUBLIC_META_PIXEL_ID` - Meta (Facebook) Pixel ID (optional, for future ads)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional, for map features)

### 3. Run the Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Setting Up Analytics

### Google Analytics 4

1. Create a GA4 property at https://analytics.google.com
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. For Vercel deployment, add the same variable in:
   - Vercel Dashboard → Project Settings → Environment Variables
   - Add for Production, Preview, and Development
   - Redeploy after adding

### Meta Pixel (Optional)

1. Create a pixel at https://business.facebook.com/events_manager
2. Get your Pixel ID
3. Add to `.env.local` and Vercel environment variables:
   ```
   NEXT_PUBLIC_META_PIXEL_ID=YOUR_PIXEL_ID
   ```

## Key Features

- 71 senior living community listings (Cleveland area)
- 35 city-specific landing pages
- 4 SEO-optimized guide pages (assisted living, memory care, pricing, choosing)
- Memory Care and Assisted Living focus
- Multiple lead capture forms (Formspree integration)
- Sticky tour request button
- Exit-intent popup
- LocalBusiness schema markup
- Testimonials and social proof
- Mobile-optimized experience

## Project Structure

```
src/
├── app/                          # Next.js 13+ app directory
│   ├── assisted-living-cleveland/
│   ├── memory-care-cleveland/
│   ├── senior-living-costs-cleveland/
│   ├── choosing-senior-living/
│   ├── resources/                # Resources hub
│   ├── location/[city]/          # Dynamic city pages
│   └── community/[id]/[slug]/    # Dynamic community pages
├── components/
│   ├── analytics/                # GA4 and Meta Pixel
│   ├── community/                # Community page components
│   ├── forms/                    # Lead capture forms
│   ├── tour/                     # Sticky tour button
│   └── ...
├── data/
│   ├── facilities.ts             # All 71 communities
│   ├── cleveland-cities.ts       # City-specific data
│   └── testimonials.ts           # Customer testimonials
└── utils/
    └── amenities.ts              # Auto-generate amenities by care type
```

## Deployment

This project is configured for Vercel deployment with:
- Root Directory: `airbnb-clone`
- Build Command: `bun run build`
- Install Command: `bun install`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
