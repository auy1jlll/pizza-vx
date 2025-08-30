import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Greenland Famous Pizza & Roast Beef Delivery in Portsmouth, NH | Best Pizza Near Me',
  description: 'Order the best pizza in Portsmouth, NH from Greenland Famous. Fresh roast beef sandwiches, authentic Italian pizza, and fast delivery to Portsmouth. Family-owned restaurant with great ratings.',
  keywords: 'pizza Portsmouth NH, roast beef Portsmouth, restaurant Portsmouth NH, pizza delivery Portsmouth, Italian restaurant Portsmouth, best pizza Portsmouth NH, Greenland Famous Portsmouth',
  openGraph: {
    title: 'Greenland Famous Pizza & Roast Beef Delivery in Portsmouth, NH',
    description: 'Best pizza and roast beef delivery in Portsmouth, NH. Fresh ingredients, authentic recipes, and fast service.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function PortsmouthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900">
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
            Best Pizza & Roast Beef in Portsmouth, NH
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Greenland Famous delivers the finest pizza and roast beef sandwiches to Portsmouth, NH.
            Fresh local ingredients, authentic Italian recipes, and lightning-fast delivery to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/build-pizza"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105"
            >
              🍕 Order Pizza Now
            </Link>
            <Link
              href="/menu"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105"
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
              Why Portsmouth Loves Greenland Famous
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">🚚 Fast Delivery to Portsmouth</h3>
                <p className="text-gray-600 mb-4">
                  We deliver fresh, hot pizza and roast beef sandwiches throughout Portsmouth, NH.
                  Our delivery area covers downtown Portsmouth, Strawbery Banke, and surrounding neighborhoods.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Average delivery time: 25-35 minutes</li>
                  <li>• Free delivery on orders over $25</li>
                  <li>• Real-time order tracking</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">⭐ Portsmouth Customer Favorites</h3>
                <p className="text-gray-600 mb-4">
                  Portsmouth residents can't get enough of our famous roast beef sandwiches and
                  custom-built pizzas with fresh local toppings.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Famous Roast Beef Sandwich - $12.99</li>
                  <li>• Custom Build-Your-Own Pizza - $14.99</li>
                  <li>• Specialty Calzones - $13.99</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Portsmouth's Best Italian Restaurant
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                For over 25 years, Greenland Famous has been serving Portsmouth with authentic Italian cuisine.
                Our family recipes, fresh ingredients, and commitment to quality make us the go-to choice
                for pizza and roast beef in the Seacoast area.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h4 className="text-lg font-semibold text-green-800 mb-2">📍 Portsmouth Delivery Areas</h4>
                <p className="text-green-700">
                  We deliver to: Downtown Portsmouth, North End, South End, Strawbery Banke,
                  Prescott Park, and most residential areas within Portsmouth city limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Order Now for Portsmouth Delivery
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Fresh pizza and roast beef sandwiches delivered hot to your Portsmouth location
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build-pizza"
              className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              🍕 Build Your Pizza
            </Link>
            <Link
              href="/build-sandwich"
              className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              🥪 Roast Beef Sandwich
            </Link>
            <Link
              href="tel:(555) 123-PIZZA"
              className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              📞 Call (555) 123-PIZZA
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
