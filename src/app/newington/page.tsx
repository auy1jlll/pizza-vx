import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Greenland Famous Pizza & Roast Beef Delivery in Newington, NH | Authentic Italian Cuisine',
  description: 'Delicious pizza and roast beef sandwiches delivered to Newington, NH. Fresh local ingredients and traditional Italian recipes from Greenland Famous.',
  keywords: 'pizza Newington NH, roast beef Newington, Italian restaurant Newington NH, pizza delivery Newington, best Italian food Newington NH',
  openGraph: {
    title: 'Greenland Famous Pizza & Roast Beef Delivery in Newington, NH',
    description: 'Authentic Italian cuisine delivered to Newington, NH. Fresh pizza, roast beef sandwiches, and traditional recipes.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function NewingtonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900">
      <div className="relative py-20">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Best Pizza & Roast Beef in Newington, NH
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Greenland Famous delivers exceptional Italian cuisine to Newington, NH.
            Fresh roast beef sandwiches and authentic pizza with traditional family recipes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/build-pizza"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105"
            >
              🍕 Order Pizza Now
            </Link>
            <Link
              href="/menu"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105"
            >
              📋 View Full Menu
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Newington's Italian Restaurant Choice
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Reliable delivery throughout Newington, NH with fresh ingredients and authentic Italian flavors.
            Perfect for families, businesses, and quick lunch orders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build-pizza"
              className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-colors"
            >
              🍕 Build Your Pizza
            </Link>
            <Link
              href="/build-sandwich"
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors"
            >
              🥪 Roast Beef Sandwich
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
