import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Greenland Famous Pizza & Roast Beef Delivery in Hampton, NH | Seacoast Best Italian Food',
  description: 'Delicious pizza and roast beef sandwiches delivered to Hampton, NH. Fresh local ingredients, authentic Italian recipes, and fast Seacoast delivery.',
  keywords: 'pizza Hampton NH, roast beef Hampton, Italian restaurant Hampton NH, pizza delivery Hampton, Seacoast food delivery, best pizza Hampton NH',
  openGraph: {
    title: 'Greenland Famous Pizza & Roast Beef Delivery in Hampton, NH',
    description: 'Best Seacoast pizza and roast beef delivery in Hampton, NH. Fresh ingredients and authentic Italian cuisine.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function HamptonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900">
      {/* Hero Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-6xl">🏖️</div>
          <div className="absolute top-40 right-20 text-4xl">🦞</div>
          <div className="absolute bottom-40 left-20 text-5xl">⚾</div>
          <div className="absolute bottom-20 right-10 text-3xl">🍀</div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Best Pizza & Roast Beef in Hampton, NH
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Greenland Famous delivers exceptional Italian cuisine to Hampton Beach and surrounding areas.
            Fresh roast beef, authentic pizza, and traditional recipes for the entire Seacoast region.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/build-pizza"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105"
            >
              🍕 Order Pizza Now
            </Link>
            <Link
              href="/menu"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105"
            >
              📋 View Full Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Local Information Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Hampton's Seacoast Favorite
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">🏖️ Hampton Beach Delivery</h3>
                <p className="text-gray-600 mb-4">
                  We deliver to Hampton Beach, North Hampton, and all Hampton neighborhoods.
                  Perfect for beach days, family vacations, and weekend getaways.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Hampton Beach area coverage</li>
                  <li>• North Hampton delivery</li>
                  <li>• Weekend crowd favorite</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">⭐ Hampton Customer Favorites</h3>
                <p className="text-gray-600 mb-4">
                  Hampton residents and visitors love our fresh, authentic Italian cuisine.
                  Perfect for beach picnics and family dinners.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Beach-ready sandwiches</li>
                  <li>• Family-size pizza options</li>
                  <li>• Quick lunch specials</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Seacoast's Best Italian Restaurant
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Serving Hampton and the Seacoast for over 25 years with authentic Italian recipes
                and fresh local ingredients. Whether you're at the beach or enjoying a quiet dinner
                at home, Greenland Famous delivers exceptional quality.
              </p>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
                <h4 className="text-lg font-semibold text-teal-800 mb-2">📍 Hampton Delivery Areas</h4>
                <p className="text-teal-700">
                  We deliver to: Hampton Beach, Hampton Falls, North Hampton, South Hampton,
                  and most residential and business areas throughout Hampton.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Order Now for Hampton Delivery
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Fresh Italian cuisine delivered to your Hampton location
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build-pizza"
              className="bg-white text-teal-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              🍕 Build Your Pizza
            </Link>
            <Link
              href="/build-sandwich"
              className="bg-white text-cyan-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              🥪 Roast Beef Sandwich
            </Link>
            <Link
              href="tel:(555) 123-PIZZA"
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              📞 Call (555) 123-PIZZA
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
