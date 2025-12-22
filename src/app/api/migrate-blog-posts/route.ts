import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

// Article data for the 5 missing articles
const MISSING_ARTICLES = [
  {
    slug: 'date-after-divorce',
    title: 'Dating After Divorce: A Complete Guide for Cleveland Seniors',
    description: 'Rediscover love and companionship after divorce. Expert advice on senior dating in Cleveland, from online dating tips to meeting people in assisted living communities.',
    category: 'Relationships & Lifestyle',
    author: 'Guide for Seniors Team',
    published_at: '2025-05-13',
    read_time_minutes: 13,
    // Content loaded from file in GET handler
  },
  {
    slug: 'apps-for-seniors',
    title: 'Essential Apps for Seniors: Stay Connected, Healthy, and Independent',
    description: 'Discover the best smartphone apps designed for seniors. From health tracking to video calls, learn which apps can improve your daily life and keep you connected.',
    category: 'Technology & Apps',
    author: 'Guide for Seniors Team',
    published_at: '2025-04-28',
    read_time_minutes: 14,
  },
  {
    slug: 'keep-up-with-tech',
    title: 'How Seniors Can Keep Up With Technology: A Practical Guide',
    description: 'Technology doesn't have to be intimidating. Learn practical strategies to master smartphones, computers, and new tech at your own pace—with Cleveland resources to help.',
    category: 'Technology & Apps',
    author: 'Guide for Seniors Team',
    published_at: '2025-03-15',
    read_time_minutes: 12,
  },
  {
    slug: 'cruises-for-seniors',
    title: 'Cruises for Seniors: The Ultimate Guide to Senior-Friendly Travel',
    description: 'Planning a cruise as a senior? Discover the best cruise lines, accessibility options, health tips, and how to make the most of your voyage—whether traveling from Cleveland or beyond.',
    category: 'Travel & Lifestyle',
    author: 'Guide for Seniors Team',
    published_at: '2025-02-20',
    read_time_minutes: 15,
  },
  {
    slug: 'magnesium-for-health',
    title: 'Magnesium for Seniors: Brain Health, Sleep, and Cognitive Function',
    description: 'Discover why magnesium is crucial for senior health—from memory and brain function to sleep quality. Learn about deficiency signs, best sources, and supplementation.',
    category: 'Health & Wellness',
    author: 'Guide for Seniors Team',
    published_at: '2025-01-10',
    read_time_minutes: 13,
  }
];

// Map of article slugs to their line ranges in old-blog-data.ts
const ARTICLE_LINE_RANGES: Record<string, { start: number; end: number }> = {
  'magnesium-for-health': { start: 22, end: 905 },
  'cruises-for-seniors': { start: 923, end: 1916 },
  'keep-up-with-tech': { start: 1934, end: 2732 },
  'apps-for-seniors': { start: 2750, end: 3500 },
  'date-after-divorce': { start: 3518, end: 4302 },
};

function extractArticleContent(slug: string): string | null {
  try {
    const filePath = join(process.cwd(), 'scripts', 'old-blog-data.ts');
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const range = ARTICLE_LINE_RANGES[slug];
    if (!range) return null;
    
    // Extract lines and clean up
    const articleLines = lines.slice(range.start - 1, range.end);
    return articleLines.join('\n').trim();
  } catch (error) {
    console.error('Error reading old blog data:', error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // If specific slug requested, migrate just that one
    if (slug) {
      const articleMeta = MISSING_ARTICLES.find(a => a.slug === slug);
      if (!articleMeta) {
        return NextResponse.json({ error: `Article ${slug} not found` }, { status: 404 });
      }

      const content = extractArticleContent(slug);
      if (!content) {
        return NextResponse.json({ error: `Could not extract content for ${slug}` }, { status: 500 });
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .upsert({
          ...articleMeta,
          content_markdown: content
        }, {
          onConflict: 'slug'
        })
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        article: data[0],
        url: `https://www.guideforseniors.com/blog/${slug}`
      });
    }

    // Otherwise, migrate all 5 missing articles
    const results = [];
    let succeeded = 0;
    let failed = 0;

    for (const articleMeta of MISSING_ARTICLES) {
      const content = extractArticleContent(articleMeta.slug);
      if (!content) {
        results.push({ slug: articleMeta.slug, status: 'error', message: 'Could not extract content' });
        failed++;
        continue;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .upsert({
          ...articleMeta,
          content_markdown: content
        }, {
          onConflict: 'slug'
        })
        .select();

      if (error) {
        results.push({ slug: articleMeta.slug, status: 'error', message: error.message });
        failed++;
      } else {
        results.push({ slug: articleMeta.slug, status: 'success', url: `https://www.guideforseniors.com/blog/${articleMeta.slug}` });
        succeeded++;
      }
    }

    return NextResponse.json({
      success: true,
      migrated: succeeded,
      failed: failed,
      total: MISSING_ARTICLES.length,
      results
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}

