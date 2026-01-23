'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <div className="my-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h2 id="frequently-asked-questions" className="text-2xl font-bold text-gray-900 scroll-mt-24">
          Frequently Asked Questions
        </h2>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
              <ChevronDown 
                className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-4 pt-0 bg-gray-50 border-t border-gray-100">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="text-gray-700 mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 text-gray-700">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-700">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                      ),
                    }}
                  >
                    {item.answer}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to extract FAQ items from markdown content
export function extractFAQItems(content: string): { faqItems: FAQItem[]; contentWithoutFAQ: string } {
  const faqItems: FAQItem[] = [];
  
  // Find the FAQ section - look for "## Frequently Asked Questions" or similar
  const faqHeaderRegex = /## Frequently Asked Questions\s*\n/i;
  const faqMatch = content.match(faqHeaderRegex);
  
  if (!faqMatch) {
    return { faqItems: [], contentWithoutFAQ: content };
  }
  
  const faqStartIndex = faqMatch.index! + faqMatch[0].length;
  const contentBeforeFAQ = content.substring(0, faqMatch.index);
  const faqSection = content.substring(faqStartIndex);
  
  // Find where FAQ section ends (next h2 or end of content)
  const nextH2Match = faqSection.match(/\n## [^#]/);
  const faqContent = nextH2Match 
    ? faqSection.substring(0, nextH2Match.index)
    : faqSection;
  
  const contentAfterFAQ = nextH2Match 
    ? faqSection.substring(nextH2Match.index! + 1)
    : '';
  
  // Parse FAQ items - look for ### Q: pattern
  const questionRegex = /### Q: (.+?)\n\n\*\*A\*\*: ([\s\S]+?)(?=\n---|\n### Q:|\n## |$)/g;
  let match;
  
  while ((match = questionRegex.exec(faqContent)) !== null) {
    faqItems.push({
      question: match[1].trim(),
      answer: match[2].trim()
    });
  }
  
  // If no matches found with that pattern, try alternative pattern
  if (faqItems.length === 0) {
    const altRegex = /### Q: (.+?)\n\n([\s\S]+?)(?=\n---|\n### |\n## |$)/g;
    while ((match = altRegex.exec(faqContent)) !== null) {
      faqItems.push({
        question: match[1].trim(),
        answer: match[2].trim()
      });
    }
  }
  
  // Content without the FAQ section (we'll render FAQ separately with accordion)
  const contentWithoutFAQ = contentBeforeFAQ + '\n\n<!-- FAQ_PLACEHOLDER -->\n\n' + contentAfterFAQ;
  
  return { faqItems, contentWithoutFAQ };
}
