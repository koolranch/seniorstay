/**
 * Blog Category Configuration
 * Maps specific blog post categories to parent groups for cleaner UI
 */

export interface CategoryGroup {
  name: string;
  slug: string;
  description: string;
  keywords: string[]; // Keywords to match against post categories
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    name: 'Care Types',
    slug: 'care-types',
    description: 'Assisted living, memory care, skilled nursing, and independent living options',
    keywords: [
      'assisted living',
      'memory care',
      'skilled nursing',
      'independent living',
      'nursing home',
      'continuing care',
      'respite care',
      'dementia',
    ],
  },
  {
    name: 'Costs & Finances',
    slug: 'costs-finances',
    description: 'Pricing guides, Medicare, Medicaid, and financial planning',
    keywords: [
      'cost',
      'pricing',
      'medicaid',
      'medicare',
      'insurance',
      'financial',
      'afford',
      'budget',
      'pay for',
      'waiver',
      'hidden costs',
      'included',
    ],
  },
  {
    name: 'Planning & Tours',
    slug: 'planning-tours',
    description: 'How to choose, tour tips, and questions to ask',
    keywords: [
      'how to choose',
      'questions to ask',
      'tour',
      'planning',
      'starting',
      'placement',
      'what to bring',
      'navigate',
    ],
  },
  {
    name: 'Memory Care',
    slug: 'memory-care',
    description: 'Dementia care, Alzheimer\'s support, and cognitive health',
    keywords: [
      'memory care',
      'dementia',
      'alzheimer',
      'cognitive',
      'brain health',
      'person-centered',
    ],
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Activities, social life, relationships, and daily living',
    keywords: [
      'lifestyle',
      'activities',
      'wellness',
      'games',
      'social',
      'relationship',
      'dating',
      'travel',
      'cruise',
      'entertainment',
      'senior lifestyle',
    ],
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Safety tips, nutrition, and health guidance',
    keywords: [
      'health',
      'wellness',
      'safety',
      'winter',
      'nutrition',
      'magnesium',
      'face lift',
      'medical',
    ],
  },
  {
    name: 'Local Guides',
    slug: 'local-guides',
    description: 'Cleveland neighborhoods and community-specific guides',
    keywords: [
      'cleveland',
      'parma',
      'beachwood',
      'westlake',
      'lakewood',
      'solon',
      'mentor',
      'cuyahoga',
      'lake county',
      'east side',
      'west side',
      'ohio',
      'local',
    ],
  },
  {
    name: 'Family Advice',
    slug: 'family-advice',
    description: 'Talking to parents, family transitions, and caregiver support',
    keywords: [
      'family',
      'talk to',
      'parent',
      'guardian',
      'caregiver',
      'transition',
      'couple',
    ],
  },
];

/**
 * Maps a specific blog post category to its parent group
 */
export function getParentCategory(postCategory: string): CategoryGroup | null {
  const lowerCategory = postCategory.toLowerCase();
  
  for (const group of CATEGORY_GROUPS) {
    for (const keyword of group.keywords) {
      if (lowerCategory.includes(keyword.toLowerCase())) {
        return group;
      }
    }
  }
  
  return null;
}

/**
 * Gets the parent category name for a post category
 */
export function getParentCategoryName(postCategory: string): string {
  const parent = getParentCategory(postCategory);
  return parent?.name || 'General';
}

/**
 * Groups posts by parent category
 */
export function groupPostsByCategory<T extends { category: string }>(
  posts: T[]
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  
  // Initialize with all parent categories
  CATEGORY_GROUPS.forEach((group) => {
    grouped.set(group.name, []);
  });
  grouped.set('General', []);
  
  // Group posts
  posts.forEach((post) => {
    const parentName = getParentCategoryName(post.category);
    const existing = grouped.get(parentName) || [];
    existing.push(post);
    grouped.set(parentName, existing);
  });
  
  // Remove empty categories
  grouped.forEach((posts, name) => {
    if (posts.length === 0) {
      grouped.delete(name);
    }
  });
  
  return grouped;
}

/**
 * Gets category counts for display
 */
export function getCategoryCounts<T extends { category: string }>(
  posts: T[]
): { name: string; count: number }[] {
  const grouped = groupPostsByCategory(posts);
  const counts: { name: string; count: number }[] = [];
  
  // Add "All" first
  counts.push({ name: 'All', count: posts.length });
  
  // Add parent categories in order
  CATEGORY_GROUPS.forEach((group) => {
    const groupPosts = grouped.get(group.name);
    if (groupPosts && groupPosts.length > 0) {
      counts.push({ name: group.name, count: groupPosts.length });
    }
  });
  
  // Add General if it has posts
  const generalPosts = grouped.get('General');
  if (generalPosts && generalPosts.length > 0) {
    counts.push({ name: 'General', count: generalPosts.length });
  }
  
  return counts;
}

