#!/usr/bin/env node
/**
 * Migrate all blog posts from old static file to Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const { blogPosts } = require('./old-blog-data.ts');

const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable required');
  console.error('This script needs write access to Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateBlogPosts() {
  console.log(`📝 Migrating ${blogPosts.length} blog posts to Supabase...\n`);

  let succeeded = 0;
  let failed = 0;

  for (const post of blogPosts) {
    try {
      const readTimeMatch = post.readTime.match(/(\d+)/);
      const readTimeMinutes = readTimeMatch ? parseInt(readTimeMatch[1]) : 10;

      const { data, error } = await supabase
        .from('blog_posts')
        .upsert({
          slug: post.slug,
          title: post.title,
          description: post.description,
          category: post.category,
          author: post.author,
          published_at: post.date,
          read_time_minutes: readTimeMinutes,
          image_url: post.image || null,
          content_markdown: post.content
        }, {
          onConflict: 'slug'
        })
        .select();

      if (error) {
        console.error(`✗ Failed: ${post.slug}`, error.message);
        failed++;
      } else {
        console.log(`✓ Migrated: ${post.slug} (${post.title})`);
        succeeded++;
      }

    } catch (error) {
      console.error(`✗ Error: ${post.slug}`, error.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('MIGRATION COMPLETE');
  console.log('='.repeat(80));
  console.log(`✓ Success: ${succeeded}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`Total: ${blogPosts.length}`);
  console.log('\n🌐 All articles now available at: https://www.guideforseniors.com/blog/');
}

migrateBlogPosts().catch(console.error);

