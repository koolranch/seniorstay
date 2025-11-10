import { NextRequest, NextResponse } from 'next/server';
import { blogPosts } from '@/data/blog-posts';
import fs from 'fs';
import path from 'path';

// Secure access token - should be stored in environment variables
const ACCESS_TOKEN = process.env.OUTRANK_WEBHOOK_ACCESS_TOKEN;

// Supported HTTP methods (Next.js compatible)
const SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

interface OutrankArticle {
  id: string;
  title: string;
  content_markdown: string;
  content_html: string;
  meta_description: string;
  created_at: string;
  image_url?: string;
  slug: string;
  tags: string[];
}

interface OutrankWebhookPayload {
  event_type: string;
  timestamp: string;
  data: {
    articles: OutrankArticle[];
  };
}

function validateAccessToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1];
  return token === ACCESS_TOKEN;
}

async function processOutrankArticle(article: OutrankArticle) {
  // Convert Outrank article format to your blog post format
  const blogPost = {
    slug: article.slug,
    title: article.title,
    description: article.meta_description,
    date: new Date(article.created_at).toISOString().split('T')[0], // Format: YYYY-MM-DD
    author: "Guide for Seniors Team",
    category: article.tags.length > 0 ? article.tags[0] : "General",
    readTime: `${Math.max(5, Math.ceil(article.content_markdown.split(' ').length / 200))} min read`,
    image: article.image_url,
    content: article.content_markdown
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.startsWith('#') ? `##${line}` : line) // Convert headers
      .join('\n\n'),
  };

  return blogPost;
}

async function addArticlesToBlog(articles: OutrankArticle[]) {
  try {
    // Get the current blog posts
    const currentPosts = [...blogPosts];

    // Process new articles
    const newPosts = [];
    for (const article of articles) {
      const processedPost = await processOutrankArticle(article);

      // Check if article already exists (by slug)
      const existingIndex = currentPosts.findIndex(post => post.slug === processedPost.slug);
      if (existingIndex >= 0) {
        // Update existing article
        currentPosts[existingIndex] = processedPost;
        console.log(`Updated existing article: ${processedPost.slug}`);
      } else {
        // Add new article
        currentPosts.unshift(processedPost); // Add to beginning
        newPosts.push(processedPost);
        console.log(`Added new article: ${processedPost.slug}`);
      }
    }

    // Write updated blog posts to file
    const blogPostsPath = path.join(process.cwd(), 'src', 'data', 'blog-posts.ts');
    const fileContent = `import { BlogPost } from '@/types/blog';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image?: string;
  content: string;
}

export const blogPosts: BlogPost[] = ${JSON.stringify(currentPosts, null, 2)};

export default blogPosts;
`;

    fs.writeFileSync(blogPostsPath, fileContent);
    console.log(`Successfully updated blog-posts.ts with ${newPosts.length} new articles`);

    return { success: true, newArticlesCount: newPosts.length, updatedArticlesCount: articles.length - newPosts.length };
  } catch (error) {
    console.error('Error updating blog posts:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function triggerVercelRedeploy() {
  try {
    const VERCEL_TOKEN = process.env.VERCEL_ACCESS_TOKEN;
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

    if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
      console.log('Vercel credentials not configured, skipping redeploy');
      return { success: false, message: 'Vercel credentials not configured' };
    }

    // Trigger a new deployment
    const response = await fetch(`https://api.vercel.com/v1/integrations/deploy/${VERCEL_PROJECT_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Redeploy triggered by Outrank webhook',
        source: 'api',
      }),
    });

    if (response.ok) {
      console.log('Successfully triggered Vercel redeploy');
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error('Failed to trigger Vercel redeploy:', errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error('Error triggering Vercel redeploy:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate access token
    if (!validateAccessToken(request)) {
      console.log('Outrank webhook: Invalid access token');
      return NextResponse.json(
        { error: 'Invalid access token' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload: OutrankWebhookPayload = await request.json();

    console.log('Outrank webhook received:', {
      event_type: payload.event_type,
      timestamp: payload.timestamp,
      article_count: payload.data.articles.length,
    });

    // Validate event type
    if (payload.event_type !== 'publish_articles') {
      console.log('Outrank webhook: Unsupported event type:', payload.event_type);
      return NextResponse.json(
        { error: 'Unsupported event type' },
        { status: 400 }
      );
    }

    // Process and add articles to blog
    const blogUpdateResult = await addArticlesToBlog(payload.data.articles);

    if (!blogUpdateResult.success) {
      console.error('Failed to update blog posts:', blogUpdateResult.error);
      return NextResponse.json(
        { error: 'Failed to update blog posts', details: blogUpdateResult.error },
        { status: 500 }
      );
    }

    // Trigger Vercel redeploy
    const redeployResult = await triggerVercelRedeploy();

    console.log(`Successfully processed ${payload.data.articles.length} articles from Outrank`);
    console.log(`Added ${blogUpdateResult.newArticlesCount} new articles, updated ${blogUpdateResult.updatedArticlesCount} existing articles`);

    return NextResponse.json({
      message: 'Webhook processed successfully - articles added and redeploy triggered',
      processed_count: payload.data.articles.length,
      new_articles: blogUpdateResult.newArticlesCount,
      updated_articles: blogUpdateResult.updatedArticlesCount,
      redeploy_triggered: redeployResult.success,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Outrank webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Handle GET requests (for testing/verification)
export async function GET() {
  return NextResponse.json({
    message: 'Outrank webhook endpoint is active',
    timestamp: new Date().toISOString(),
    supported_methods: ['POST', 'GET', 'OPTIONS'],
    note: 'Use POST for webhook events, GET for testing'
  });
}

// Handle HEAD requests (sometimes used for health checks)
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Catch-all handler for any unsupported methods
export async function PUT(request: NextRequest) {
  console.log('Outrank webhook: PUT method received');
  return handleWebhook(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
  console.log('Outrank webhook: PATCH method received');
  return handleWebhook(request, 'PATCH');
}

export async function DELETE(request: NextRequest) {
  console.log('Outrank webhook: DELETE method received');
  return handleWebhook(request, 'DELETE');
}

// Note: TRACE and CONNECT methods are not supported by Next.js API routes

// Generic webhook handler for all methods except POST (which has special logic)
async function handleWebhook(request: NextRequest, method: string) {
  console.log(`[${new Date().toISOString()}] Outrank webhook ${method} request received`);
  try {
    // For non-POST methods, just acknowledge and log
    console.log(`Outrank webhook: ${method} method handled successfully`);

    return NextResponse.json({
      message: `${method} method processed successfully`,
      method: method,
      timestamp: new Date().toISOString(),
      note: 'This endpoint supports all HTTP methods for webhook testing'
    });
  } catch (error) {
    console.error(`Outrank webhook ${method} error:`, error);
    return NextResponse.json(
      { error: `Internal server error for ${method}` },
      { status: 500 }
    );
  }
}
