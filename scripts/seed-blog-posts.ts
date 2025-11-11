import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { blogPosts } from '@/data/blog-posts';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  for (const post of blogPosts) {
    const readTimeMinutes = parseInt(post.readTime, 10) || 5;

    const { error } = await supabase
      .from('blog_posts')
      .upsert(
        {
          slug: post.slug,
          title: post.title,
          description: post.description,
          category: post.category,
          author: post.author,
          published_at: post.date,
          read_time_minutes: readTimeMinutes,
          image_url: post.image ?? null,
          content_markdown: post.content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      );

    if (error) {
      throw error;
    }

    console.log(`Upserted blog post: ${post.slug}`);
  }

  console.log(`Successfully seeded ${blogPosts.length} blog posts to Supabase.`);
}

main().catch((error) => {
  console.error('Failed to seed blog posts:', error);
  process.exit(1);
});

