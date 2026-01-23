'use client';

import { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  // Extract headings from content
  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Only include h2 for cleaner TOC
      if (level === 2) {
        headings.push({ id, text, level });
      }
    }

    setItems(headings);
  }, [content]);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <>
      {/* Desktop Sticky TOC */}
      <aside className="hidden xl:block fixed left-8 top-32 w-64 max-h-[calc(100vh-160px)] overflow-y-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 mb-3"
          >
            <span className="flex items-center gap-2">
              <List className="h-4 w-4" />
              In This Article
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </button>
          
          {isOpen && (
            <nav className="space-y-1">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`block text-sm py-1.5 px-2 rounded transition-colors truncate ${
                    activeId === item.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title={item.text}
                >
                  {item.text.length > 28 ? item.text.substring(0, 28) + '...' : item.text}
                </a>
              ))}
            </nav>
          )}
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            id="reading-progress"
            className="bg-primary h-full transition-all duration-150"
            style={{ width: '0%' }}
          />
        </div>
      </aside>

      {/* Mobile TOC Dropdown */}
      <div className="xl:hidden mb-8 bg-gray-50 rounded-xl p-4 border border-gray-200">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-900"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Jump to Section
          </span>
          <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        
        {isOpen && (
          <nav className="mt-3 space-y-1 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setIsOpen(false);
                }}
                className="block text-sm py-2 px-3 rounded text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
