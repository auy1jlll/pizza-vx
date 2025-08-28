import Link from 'next/link';
import StaticPizzaPromoHero from '@/components/StaticPizzaPromoHero';
import { generateMetadata as generateDynamicMetadata } from '@/lib/dynamic-metadata';

// Generate metadata for this page
export const generateMetadata = generateDynamicMetadata;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Static Pizza Promo Hero Section */}
      <StaticPizzaPromoHero />
      
      {/* Additional Content Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900 py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-6xl">🏛️</div>
          <div className="absolute top-40 right-20 text-4xl">🦞</div>
          <div className="absolute bottom-40 left-20 text-5xl">⚾</div>
          <div className="absolute bottom-20 right-10 text-3xl">🍀</div>
          <div className="absolute top-60 left-1/2 text-4xl">🧱</div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          {/* Secondary CTA Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              More Delicious Options
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Explore our full range of authentic local Italian favorites
            </p>
          </div>

          {/* CTA Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            <Link 
              href="/build-pizza"
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold px-6 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-orange-500/25 text-center"
            >
              🍕 Build Your Pizza
            </Link>
            <Link 
              href="/gourmet-pizzas"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-green-500/25 text-center"
            >
              🍀 Specialty Pizzas
            </Link>
            <Link 
              href="/build-calzone"
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold px-6 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-amber-500/25 text-center"
            >
              🥟 Build Your Calzone
            </Link>
            <Link 
              href="/specialty-calzones"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-6 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-purple-500/25 text-center"
            >
              🥟 Specialty Calzones
            </Link>
            <Link 
              href="/menu"
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold px-6 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-slate-500/25 text-center"
            >
              📋 Full Menu
            </Link>
            <Link 
              href="/order-history"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-blue-500/25 text-center"
            >
              📋 Order History
            </Link>
          </div>

          {/* Local Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-black/40 transition-all duration-300">
              <div className="text-3xl mb-3">🧱</div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">Traditional Recipes</h3>
              <p className="text-gray-300 text-sm">Traditional recipes passed down through generations in our local Italian kitchen.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-black/40 transition-all duration-300">
              <div className="text-3xl mb-3">🦞</div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Local Ingredients</h3>
              <p className="text-gray-300 text-sm">Fresh from New England farms and the finest local suppliers in our area.</p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-black/40 transition-all duration-300">
              <div className="text-3xl mb-3">⚾</div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">Game Day Ready</h3>
              <p className="text-gray-300 text-sm">Perfect for game nights, celebrations, or any local sports event.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="bg-black/40 backdrop-blur-sm py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">25+</div>
              <div className="text-gray-300">Years Serving Locally</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
              <div className="text-gray-300">Fresh Toppings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">1000+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-300">Online Ordering</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
