#!/usr/bin/env node
/**
 * Migrate blog articles from old-blog-data.ts to Supabase
 * Run: node scripts/migrate-blog-articles.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.error('Please ensure your .env.local file has the service role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Read and parse the old blog data file
function loadBlogPosts() {
  const filePath = path.join(__dirname, 'old-blog-data.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract the array content between blogPosts = [ and ];
  const match = content.match(/export const blogPosts: BlogPost\[\] = \[([\s\S]*)\];\s*\/\/ Helper/);
  if (!match) {
    throw new Error('Could not parse blog posts from file');
  }
  
  // Manually parse each blog post
  const articles = [];
  const blogPostRegex = /\{\s*slug: "([^"]+)",\s*title: "([^"]+)",\s*description: "([^"]+)",\s*date: "([^"]+)",\s*author: "([^"]+)",\s*category: "([^"]+)",\s*readTime: "([^"]+)",\s*content: `([\s\S]*?)`\s*\}/g;
  
  let articleMatch;
  while ((articleMatch = blogPostRegex.exec(match[1])) !== null) {
    const [, slug, title, description, date, author, category, readTime, content] = articleMatch;
    const readTimeMinutes = parseInt(readTime.match(/\d+/)[0]);
    
    articles.push({
      slug,
      title,
      description,
      category,
      author,
      published_at: date,
      read_time_minutes: readTimeMinutes,
      content_markdown: content.trim()
    });
  }
  
  return articles;
}

async function main() {
  console.log('📚 Loading blog articles from old-blog-data.ts...\n');
  
  const articles = loadBlogPosts();
  console.log(`Found ${articles.length} articles\n`);
  
  // Filter to only the 5 missing ones
  const missingArticles = articles.filter(a => [
    'magnesium-for-health',
    'cruises-for-seniors',
    'keep-up-with-tech',
    'apps-for-seniors',
    'date-after-divorce'
  ].includes(a.slug));
  
  console.log(`Migrating ${missingArticles.length} missing articles:\n`);
  
  let succeeded = 0;
  let failed = 0;
  
  for (const article of missingArticles) {
    try {
      console.log(`📝 Inserting: ${article.slug}...`);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .upsert(article, {
          onConflict: 'slug'
        })
        .select();
      
      if (error) {
        console.error(`   ✗ Failed: ${error.message}`);
        failed++;
      } else {
        console.log(`   ✓ Success: ${article.title}`);
        console.log(`     URL: https://www.guideforseniors.com/blog/${article.slug}`);
        succeeded++;
      }
    } catch (error) {
      console.error(`   ✗ Error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('MIGRATION COMPLETE');
  console.log('='.repeat(80));
  console.log(`✓ Succeeded: ${succeeded}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`\n🌐 Visit https://www.guideforseniors.com/blog/ to see all articles`);
}

main().catch(console.error);

