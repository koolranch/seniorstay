import { Metadata } from 'next';
import { fetchBlogPostBySlug } from '@/lib/blog-posts';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Article Not Found | Guide for Seniors',
      description: 'The article you are looking for could not be found.',
    };
  }

  const canonicalUrl = `/blog/${params.slug}`;

  return {
    title: `${post.title} | Guide for Seniors Blog`,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: [post.category],
      url: `https://www.guideforseniors.com${canonicalUrl}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

