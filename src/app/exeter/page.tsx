import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Greenland Famous Pizza & Roast Beef Delivery in Exeter, NH | Best Italian Food Near Me',
  description: 'Authentic Italian pizza and roast beef sandwiches delivered to Exeter, NH. Fresh ingredients, family recipes, and fast delivery from Greenland Famous.',
  keywords: 'pizza Exeter NH, roast beef Exeter, Italian restaurant Exeter NH, pizza delivery Exeter, best lunch Exeter NH, Greenland Famous Exeter',
  openGraph: {
    title: 'Greenland Famous Pizza & Roast Beef Delivery in Exeter, NH',
    description: 'Best Italian food delivery in Exeter, NH. Fresh pizza, roast beef sandwiches, and authentic cuisine.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function ExeterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      {/* Hero Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-6xl">🏛️</div>
          <div className="absolute top-40 right-20 text-4xl">🦞</div>
          <div className="absolute bottom-40 left-20 text-5xl">⚾</div>
          <div className="absolute bottom-20 right-10 text-3xl">🍀</div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Best Pizza & Roast Beef in Exeter, NH
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Greenland Famous brings authentic Italian cuisine to Exeter, NH.
            Fresh roast beef sandwiches, custom pizzas, and traditional recipes delivered to your Exeter location.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/build-pizza"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105"
            >
              🍕 Order Pizza Now
            </Link>
            <Link
              href="/menu"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105"
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
              Exeter's Favorite Italian Restaurant
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">🚚 Exeter Delivery Service</h3>
                <p className="text-gray-600 mb-4">
                  Fast, reliable delivery throughout Exeter, NH. We serve Exeter Center,
                  residential neighborhoods, and business districts with hot, fresh food.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Delivery to all Exeter zip codes</li>
                  <li>• Perfect for lunch breaks</li>
                  <li>• Family meal delivery</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">⭐ Exeter Customer Reviews</h3>
                <p className="text-gray-600 mb-4">
                  Exeter residents love our authentic Italian flavors and fresh ingredients.
                  Perfect for busy professionals and families alike.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• "Best lunch in Exeter!" - Sarah M.</li>
                  <li>• "Fresh ingredients every time" - Mike R.</li>
                  <li>• "Family favorite for years" - Jennifer K.</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Perfect for Exeter Lunch & Dinner
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Whether you're at work in Exeter Center or enjoying a family dinner at home,
                Greenland Famous delivers the perfect meal. Our fresh roast beef sandwiches
                and custom pizzas are Exeter's go-to comfort food.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">📍 Exeter Delivery Coverage</h4>
                <p className="text-blue-700">
                  We deliver to: Exeter Center, residential areas, business districts,
                  and most locations within Exeter town limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Order Now for Exeter Delivery
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Fresh Italian cuisine delivered hot to your Exeter location
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build-pizza"
              className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              🍕 Build Your Pizza
            </Link>
            <Link
              href="/build-sandwich"
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
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
