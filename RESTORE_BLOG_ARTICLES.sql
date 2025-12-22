-- ============================================================================
-- RESTORE 5 MISSING BLOG ARTICLES TO SUPABASE
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/hncgnxbooghjhpncujzx/editor
-- ============================================================================

-- NOTE: The full article content is 6000+ lines total
-- These articles are stored in scripts/old-blog-data.ts
-- To add them, you have two options:

-- OPTION 1: Use the API Route (RECOMMENDED - EASIEST)
-- Visit these URLs in your browser (one at a time):
-- 1. https://www.guideforseniors.com/api/add-blog-post?slug=magnesium-for-health
-- 2. https://www.guideforseniors.com/api/add-blog-post?slug=cruises-for-seniors
-- 3. https://www.guideforseniors.com/api/add-blog-post?slug=keep-up-with-tech
-- 4. https://www.guideforseniors.com/api/add-blog-post?slug=apps-for-seniors
-- 5. https://www.guideforseniors.com/api/add-blog-post?slug=date-after-divorce

-- The API route needs to be updated to accept a slug parameter
-- and extract the content from scripts/old-blog-data.ts

-- OPTION 2: Manual SQL Inserts (shown below with shortened content)
-- For FULL content, extract from scripts/old-blog-data.ts lines:
-- - magnesium-for-health: lines 14-906
-- - cruises-for-seniors: lines 908-1856  
-- - keep-up-with-tech: lines 1858-2734
-- - apps-for-seniors: lines 2736-3502
-- - date-after-divorce: lines 3504-4270

-- Placeholder inserts (you'll need to replace content_markdown with full text):

INSERT INTO blog_posts (slug, title, description, category, author, published_at, read_time_minutes, content_markdown)
VALUES 
('magnesium-for-health', 
 'Magnesium for Seniors: Brain Health, Sleep, and Cognitive Function',
 'Discover why magnesium is crucial for senior health—from memory and brain function to sleep quality. Learn about deficiency signs, best sources, and supplementation.',
 'Health & Wellness',
 'Guide for Seniors Team',
 '2025-01-10',
 13,
 '## The Overlooked Mineral That Could Transform Your Health

Magnesium powers over 300 biochemical reactions. For seniors in memory care in Cleveland, Ohio, maintaining adequate magnesium levels supports brain health, sleep, and quality of life.

**For FULL article content:** Extract lines 14-906 from scripts/old-blog-data.ts')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown,
  updated_at = NOW();

-- Repeat for other 4 articles with their full content from old-blog-data.ts

-- ============================================================================
-- SIMPLER SOLUTION: Update the API route to read from old-blog-data.ts
-- ============================================================================

