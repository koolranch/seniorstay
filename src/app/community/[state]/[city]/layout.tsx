import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
  params: {
    state: string;
    city: string;
  };
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      {children}
    </div>
  );
} 