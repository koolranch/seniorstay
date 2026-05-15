import { ReactNode } from 'react';
import { generateMetadata } from './metadata';

export { generateMetadata };

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
