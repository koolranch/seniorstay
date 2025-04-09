import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Senior Games Online | SeniorStay',
  description: 'Play safe, easy-to-use online games for seniors. This embedded page offers a distraction-free gaming experience for older adults.',
  openGraph: {
    title: 'Play Senior Games Online',
    description: 'Play safe, easy-to-use online games for seniors. This embedded page offers a distraction-free gaming experience for older adults.',
    type: 'website',
    url: 'https://guideforseniors.com/senior-entertainment/games/senior-online-games/embed',
  },
};

export default function SeniorGamesEmbedPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF5]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1b4d70] mb-4">
              Play Senior Games Online
            </h1>
            <p className="text-gray-700 mb-6">
              Welcome to our embedded senior-friendly gaming page! This distraction-free space is designed to give you easy access to fun, brain-boosting games right from your browser.
            </p>

            <div className="w-full aspect-video mt-6">
              <iframe
                src="https://example.com/embed/senior-game"
                title="Embedded Senior Game"
                className="w-full h-full border rounded shadow-md"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 