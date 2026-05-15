import { ReactNode } from 'react';
import { metadata } from './metadata';

export { metadata };

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
