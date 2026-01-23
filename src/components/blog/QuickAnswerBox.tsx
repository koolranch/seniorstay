'use client';

import { Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface QuickAnswerBoxProps {
  content: string;
}

export default function QuickAnswerBox({ content }: QuickAnswerBoxProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-6 mb-8 shadow-sm">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="bg-teal-500 text-white p-2 rounded-lg">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-teal-900">Quick Answer</h2>
            <p className="text-sm text-teal-700">In a hurry? Here's what you need to know</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-teal-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-teal-600" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-teal-200">
          <div className="prose prose-sm max-w-none prose-td:py-2 prose-th:py-2">
            <ReactMarkdown
              components={{
                table: ({ children }) => (
                  <div className="overflow-x-auto -mx-2">
                    <table className="min-w-full text-sm">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-teal-100/50">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="px-3 py-2 text-left text-xs font-semibold text-teal-900 border-b border-teal-200">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-xs text-teal-800 border-b border-teal-100">{children}</td>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-teal-50/50">{children}</tr>
                ),
                p: ({ children }) => (
                  <p className="text-teal-800 mb-2">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-teal-900">{children}</strong>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
