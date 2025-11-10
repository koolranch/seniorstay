import { Metadata } from 'next';
import { blogPosts } from '@/data/blog-posts';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Article Not Found | Guide for Seniors',
      description: 'The article you are looking for could not be found.',
    };
  }

  return {
    title: `${post.title} | Guide for Seniors Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: [post.category],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

