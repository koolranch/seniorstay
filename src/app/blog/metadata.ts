import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Senior Blog | SeniorStay',
    description: 'Explore our collection of articles about senior living, health, travel, technology, and more. Stay informed and inspired with our trusted content.',
    openGraph: {
      title: 'Senior Blog | SeniorStay',
      description: 'Explore our collection of articles about senior living, health, travel, technology, and more. Stay informed and inspired with our trusted content.',
      type: 'website',
      url: 'https://guideforseniors.com/blog',
    },
  }
} 