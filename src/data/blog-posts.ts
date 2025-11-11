let warned = false;

function logDeprecationNotice() {
  if (!warned && typeof console !== 'undefined') {
    console.warn(
      '[data/blog-posts] Static blog data has moved to Supabase. Please use helpers from `@/lib/blog-posts` instead.'
    );
    warned = true;
  }
}

export const blogPosts: never[] = [];

export const getBlogCategories = (): string[] => {
  logDeprecationNotice();
  return [];
};

export const getPostsByCategory = (_category: string): never[] => {
  logDeprecationNotice();
  return [];
};

export const getRecentPosts = (_limit: number = 3): never[] => {
  logDeprecationNotice();
  return [];
};

