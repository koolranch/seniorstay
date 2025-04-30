import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Are Superfoods? A Simple Guide for Seniors | SeniorStay',
  description: 'Superfoods are nutrient-rich foods that support healthy aging. Discover what makes them "super" and which ones are best for seniors.',
  openGraph: {
    title: 'What Are Superfoods? A Simple Guide for Seniors',
    description: 'Superfoods are nutrient-rich foods that support healthy aging. Discover what makes them "super" and which ones are best for seniors.',
    type: 'article',
    url: 'https://guideforseniors.com/blog/what-are-superfoods',
  },
};

export default function SuperfoodsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-[#1b4d70] text-white">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-20">
          <Link 
            href="/blog"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">What Are Superfoods? A Simple Guide for Seniors</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Discover nutrient-rich foods that support healthy aging and learn how to incorporate them into your diet.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-12">
        <article className="max-w-4xl mx-auto prose prose-lg">
          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 leading-7">
              "Superfoods" is a term you've probably heard before — but what does it really mean? Simply put, superfoods are whole foods that are especially rich in nutrients that support good health. For seniors, adding the right superfoods to your diet can help improve energy, brain health, digestion, and more.
            </p>
          </section>

          {/* What Makes a Food "Super" */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">What Makes a Food "Super"?</h2>
            <p className="text-gray-700 mb-4">Superfoods typically contain:</p>
            <ul className="space-y-2 text-gray-700">
              <li>High levels of vitamins and minerals</li>
              <li>Antioxidants that fight inflammation and aging</li>
              <li>Fiber for heart and digestive health</li>
              <li>Omega-3 fatty acids for brain and joint support</li>
            </ul>
          </section>

          {/* Best Superfoods for Seniors */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Best Superfoods for Seniors</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Blueberries</strong> – Rich in antioxidants and good for memory</li>
              <li><strong>Salmon</strong> – A great source of omega-3s for heart and brain health</li>
              <li><strong>Leafy Greens</strong> (like spinach & kale) – High in vitamin K, calcium, and fiber</li>
              <li><strong>Greek Yogurt</strong> – Packed with protein and probiotics for digestion</li>
              <li><strong>Oats</strong> – A heart-healthy grain that supports energy and lowers cholesterol</li>
              <li><strong>Avocados</strong> – Healthy fats for joints, brain, and skin</li>
              <li><strong>Nuts</strong> (especially walnuts and almonds) – A crunchy, satisfying source of fiber and good fats</li>
            </ul>
          </section>

          {/* Tips for Adding Superfoods */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Tips for Adding Superfoods to Your Diet</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Add berries to oatmeal or yogurt</li>
              <li>Swap sugary snacks for a handful of nuts or trail mix</li>
              <li>Blend greens into smoothies for an easy boost</li>
              <li>Grill salmon once a week for a brain-friendly dinner</li>
            </ul>
          </section>

          {/* Final Thoughts */}
          <section>
            <h2 className="text-2xl font-semibold text-[#1b4d70] mb-4">Final Thoughts</h2>
            <p className="text-gray-700 leading-7">
              Superfoods don't have to be exotic or expensive — many are simple, everyday ingredients. By incorporating a few of these nutrient-rich foods into your weekly meals, you can support your overall health, maintain energy, and age well with confidence.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
} 