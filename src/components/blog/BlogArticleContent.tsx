'use client';

import ReactMarkdown from 'react-markdown';
import TableOfContents from './TableOfContents';
import BackToTop from './BackToTop';
import QuickAnswerBox from './QuickAnswerBox';
import MidArticleCTA from './MidArticleCTA';
import FAQAccordion from './FAQAccordion';

interface BlogArticleContentProps {
  content: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function BlogArticleContent({ content }: BlogArticleContentProps) {
  // Extract Quick Answer section if present
  const quickAnswerMatch = content.match(/## Quick Answer[:\s]*([^\n]*)\n\n([\s\S]*?)(?=\n---\n|\n## [^Q])/i);
  const hasQuickAnswer = !!quickAnswerMatch;
  const quickAnswerContent = quickAnswerMatch ? quickAnswerMatch[2].trim() : '';
  
  // Extract FAQ section
  const { faqItems, processedContent } = extractAndProcessFAQ(content);
  
  // Remove Quick Answer section from main content (we render it separately)
  let mainContent = processedContent;
  if (hasQuickAnswer && quickAnswerMatch) {
    mainContent = mainContent.replace(quickAnswerMatch[0], '');
  }
  
  // Also remove "In This Guide" section since we have TOC
  mainContent = mainContent.replace(/## In This Guide\n\n([\s\S]*?)(?=\n---\n|\n## )/i, '');
  
  // Find good place for mid-article CTA (after ~40% of content or after specific sections)
  const sections = mainContent.split(/\n## /);
  const midPoint = Math.floor(sections.length * 0.4);
  
  return (
    <>
      <TableOfContents content={content} />
      <BackToTop />
      
      {/* Quick Answer Box */}
      {hasQuickAnswer && (
        <QuickAnswerBox content={quickAnswerContent} />
      )}
      
      {/* Main Article Content */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            h2: ({ children }) => {
              const text = children?.toString() || '';
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              
              // Skip rendering FAQ header (we handle it with accordion)
              if (text.toLowerCase().includes('frequently asked questions')) {
                return <div id="frequently-asked-questions" className="scroll-mt-24" />;
              }
              
              return (
                <h2 id={id} className="text-3xl font-bold mt-12 mb-6 text-gray-900 scroll-mt-24 group">
                  {children}
                  <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-50 transition-opacity text-gray-400">#</a>
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = children?.toString() || '';
              const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              
              // Skip FAQ questions (rendered in accordion)
              if (text.startsWith('Q:')) {
                return null;
              }
              
              return (
                <h3 id={id} className="text-2xl font-bold mt-8 mb-4 text-gray-900 scroll-mt-24">{children}</h3>
              );
            },
            h4: ({ children }) => (
              <h4 className="text-xl font-bold mt-6 mb-3 text-gray-900">{children}</h4>
            ),
            p: ({ children }) => {
              const text = children?.toString() || '';
              
              // Skip FAQ answers (rendered in accordion)
              if (text.startsWith('**A**:') || text.startsWith('A:')) {
                return null;
              }
              
              // Handle special callout boxes
              if (text.startsWith('KEY TAKEAWAY:')) {
                return (
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
                    <p className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
                      <span className="text-lg">💡</span> Key Takeaway
                    </p>
                    <p className="text-amber-900">{text.replace('KEY TAKEAWAY:', '').trim()}</p>
                  </div>
                );
              }
              if (text.startsWith('PRO TIP:')) {
                return (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded-r-lg">
                    <p className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
                      <span className="text-lg">✨</span> Pro Tip
                    </p>
                    <p className="text-blue-900">{text.replace('PRO TIP:', '').trim()}</p>
                  </div>
                );
              }
              if (text.startsWith('WARNING:')) {
                return (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6 rounded-r-lg">
                    <p className="font-semibold text-red-800 mb-1 flex items-center gap-2">
                      <span className="text-lg">⚠️</span> Important
                    </p>
                    <p className="text-red-900">{text.replace('WARNING:', '').trim()}</p>
                  </div>
                );
              }
              
              // Skip placeholder
              if (text.includes('FAQ_PLACEHOLDER') || text.includes('MID_CTA_PLACEHOLDER')) {
                return null;
              }
              
              return <p className="mb-6 text-gray-700 leading-relaxed">{children}</p>;
            },
            ul: ({ children }) => (
              <ul className="mb-6 space-y-2 list-disc list-inside">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-6 space-y-2 list-decimal list-inside">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-700 ml-4">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-gray-900">{children}</strong>
            ),
            a: ({ href, children }) => (
              <a href={href} className="text-primary hover:underline font-medium">
                {children}
              </a>
            ),
            hr: () => <hr className="my-8 border-gray-200" />,
            em: ({ children }) => <em className="italic">{children}</em>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary bg-gray-50 pl-6 pr-4 py-4 italic my-6 text-gray-700 rounded-r-lg">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-8 -mx-4 px-4">
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-100">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">{children}</th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">{children}</td>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-gray-50 even:bg-gray-50/50">{children}</tr>
            ),
          }}
        >
          {mainContent}
        </ReactMarkdown>
      </div>
      
      {/* FAQ Accordion */}
      {faqItems.length > 0 && (
        <FAQAccordion items={faqItems} />
      )}
      
      {/* Mid-article CTA */}
      <MidArticleCTA variant="compact" />
    </>
  );
}

// Helper to extract and process FAQ
function extractAndProcessFAQ(content: string): { faqItems: FAQItem[]; processedContent: string } {
  const faqItems: FAQItem[] = [];
  
  // Find FAQ section
  const faqMatch = content.match(/## Frequently Asked Questions\s*\n([\s\S]*?)(?=\n## [^F]|$)/i);
  
  if (!faqMatch) {
    return { faqItems: [], processedContent: content };
  }
  
  const faqSection = faqMatch[1];
  
  // Parse Q&A pairs
  const qaRegex = /### Q: (.+?)\n\n\*\*A\*\*: ([\s\S]+?)(?=\n---\n|\n### Q:|\n## |$)/g;
  let match;
  
  while ((match = qaRegex.exec(faqSection)) !== null) {
    faqItems.push({
      question: match[1].trim(),
      answer: match[2].trim()
    });
  }
  
  // Remove the FAQ section from content (we'll render it separately)
  const processedContent = content.replace(faqMatch[0], '\n\n<!-- FAQ rendered separately -->\n\n');
  
  return { faqItems, processedContent };
}
