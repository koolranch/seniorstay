
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPost() {
  console.log("Searching for blog post...");
  
  // Search for the specific post
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, title, category')
    .or('slug.ilike.%11-places%,title.ilike.%11 places%');

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  console.log('Found posts:', data);
  
  // Also list all slugs to see if it's there under a different name
  const { data: allPosts, error: allError } = await supabase
    .from('blog_posts')
    .select('slug, title')
    .limit(50);
    
  if (allError) {
      console.error('Error fetching all posts:', allError);
  } else {
      console.log('Recent posts sample:', allPosts.map(p => p.slug));
  }
}

checkPost();



