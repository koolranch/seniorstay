import { NextRequest, NextResponse } from 'next/server';
import { blogPosts } from '@/data/blog-posts';

// Secure access token - should be stored in environment variables
const ACCESS_TOKEN = process.env.OUTRANK_WEBHOOK_ACCESS_TOKEN;

// Supported HTTP methods
const SUPPORTED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'];

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

function processOutrankArticle(article: OutrankArticle) {
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

  // Here you could add logic to:
  // 1. Save to a database
  // 2. Update your blog-posts.ts file
  // 3. Send notifications
  // 4. Trigger a rebuild

  return blogPost;
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

    // Process each article
    const processedArticles = payload.data.articles.map(article => {
      try {
        const processedArticle = processOutrankArticle(article);
        console.log('Processed article:', article.title, '->', processedArticle.slug);
        return processedArticle;
      } catch (error) {
        console.error('Error processing article:', article.title, error);
        return null;
      }
    }).filter(Boolean);

    // Here you could add logic to:
    // - Save articles to database
    // - Update the blog-posts.ts file
    // - Trigger a site rebuild
    // - Send notifications

    console.log(`Successfully processed ${processedArticles.length} articles from Outrank`);

    return NextResponse.json({
      message: 'Webhook processed successfully',
      processed_count: processedArticles.length,
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

export async function TRACE(request: NextRequest) {
  console.log('Outrank webhook: TRACE method received');
  return NextResponse.json({
    message: 'TRACE method supported',
    method: 'TRACE',
    timestamp: new Date().toISOString(),
  });
}

export async function CONNECT(request: NextRequest) {
  console.log('Outrank webhook: CONNECT method received');
  return NextResponse.json({
    message: 'CONNECT method supported',
    method: 'CONNECT',
    timestamp: new Date().toISOString(),
  });
}

// Generic webhook handler for all methods except POST (which has special logic)
async function handleWebhook(request: NextRequest, method: string) {
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
