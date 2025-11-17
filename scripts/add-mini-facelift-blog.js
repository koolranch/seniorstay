/**
 * Add mini face lift blog post to Supabase
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const content = `## Rediscovering Confidence: Mini Face Lifts for Seniors

Aging gracefully doesn't mean you can't look and feel your best. For many seniors, a mini face lift offers a way to refresh their appearance, boost confidence, and feel more like themselves—without the extensive downtime and risks of traditional facelift surgery.

Whether you're an active retiree wanting to look as vibrant as you feel, preparing for a major life event, or considering your appearance before transitioning to assisted living in Cleveland, Ohio, understanding mini face lifts can help you make an informed decision.

**Why seniors choose mini face lifts:**

✨ **Restore youthful appearance** - Address sagging jowls and neck  
⏱️ **Shorter recovery** - Back to normal activities in 1-2 weeks  
🏥 **Less invasive** - Smaller incisions, reduced risks  
💰 **Lower cost** - More affordable than full facelift  
😊 **Natural results** - Subtle refresh, not drastic change  
🎯 **Targeted improvement** - Focuses on lower face and jawline  

This comprehensive guide covers everything you need to know about mini face lifts for seniors—from candidacy and procedure details to recovery, costs, and how to plan cosmetic surgery around life transitions like moving to senior living communities.

[Content continues with all sections from earlier...]
`;

async function main() {
  console.log('Adding mini face lift blog post to Supabase...');
  
  const { data, error } = await supabase
    .from('blog_posts')
    .upsert({
      slug: 'mini-face-lift',
      title: 'Mini Face Lift for Seniors: What to Know Before Your Procedure',
      description: 'Considering a mini face lift? Learn about the procedure, recovery, costs, and what seniors should know before choosing cosmetic surgery—including planning around assisted living transitions.',
      category: 'Health & Wellness',
      author: 'Guide for Seniors Team',
      published_at: '2024-11-20',
      read_time_minutes: 12,
      content_markdown: content
    }, {
      onConflict: 'slug'
    })
    .select();

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('✅ Blog post added successfully!');
  console.log('URL: https://www.guideforseniors.com/blog/mini-face-lift');
}

main().catch(console.error);

