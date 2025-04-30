import React from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

/**
 * Individual FAQ item component
 */
export function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{question}</h3>
      <p className="mb-4 font-medium text-gray-700">{answer}</p>
    </div>
  );
}

interface FAQProps {
  items: FAQItemProps[];
  title?: string;
}

/**
 * FAQ component that displays a list of questions and answers
 */
export default function FAQ({ items, title }: FAQProps) {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div>
        {items.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
} 