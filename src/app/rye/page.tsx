import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Greenland Famous Pizza & Roast Beef Delivery in Rye, NH | Best Local Italian Food',
  description: 'Fresh pizza and roast beef sandwiches delivered to Rye, NH. Authentic Italian cuisine with local ingredients from Greenland Famous.',
  keywords: 'pizza Rye NH, roast beef Rye, Italian restaurant Rye NH, pizza delivery Rye, best food Rye NH',
  openGraph: {
    title: 'Greenland Famous Pizza & Roast Beef Delivery in Rye, NH',
    description: 'Best local Italian food delivery in Rye, NH. Fresh pizza, roast beef sandwiches, and authentic cuisine.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RyePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
      <div className="relative py-20">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Best Pizza & Roast Beef in Rye, NH
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Greenland Famous delivers authentic Italian cuisine to Rye, NH.
            Fresh roast beef sandwiches and custom pizzas with traditional recipes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/build-pizza"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105"
            >
              🍕 Order Pizza Now
            </Link>
            <Link
              href="/menu"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105"
            >
              📋 View Full Menu
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Rye's Favorite Italian Restaurant
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Fast delivery throughout Rye, NH with fresh ingredients and authentic Italian flavors.
            Perfect for families and busy professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build-pizza"
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-colors"
            >
              🍕 Build Your Pizza
            </Link>
            <Link
              href="/build-sandwich"
              className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-emerald-700 transition-colors"
            >
              🥪 Roast Beef Sandwich
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
