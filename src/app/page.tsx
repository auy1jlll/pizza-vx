import Link from 'next/link';
import { generateMetadata as generateDynamicMetadata } from '@/lib/dynamic-metadata';
import { Star, Clock, Award, MapPin, Phone, Users, ChefHat } from 'lucide-react';
import PizzaImage from '@/components/PizzaImage';

// Generate metadata for this page
export const generateMetadata = generateDynamicMetadata;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-red-900 via-red-700 to-orange-600 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-orange-300 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-white rounded-full opacity-15 animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-20 h-20 bg-yellow-300 rounded-full opacity-25 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
        </div>

        {/* Floating Food Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 text-6xl animate-bounce" style={{animationDelay: '0s'}}>🍕</div>
          <div className="absolute top-40 right-32 text-4xl animate-bounce" style={{animationDelay: '1s'}}>🥪</div>
          <div className="absolute bottom-32 left-16 text-5xl animate-bounce" style={{animationDelay: '2s'}}>🍝</div>
          <div className="absolute bottom-20 right-24 text-3xl animate-bounce" style={{animationDelay: '0.5s'}}>🥗</div>
          <div className="absolute top-60 left-1/2 text-4xl animate-bounce" style={{animationDelay: '1.5s'}}>🧀</div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

            {/* Left Side - Main Content */}
            <div className="text-white space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide shadow-lg">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                ⭐ 4.6/5 Rating • 464 Reviews • Owned Since 2017
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-black leading-tight">
                  <span className="text-yellow-300">Best Pizza & Roast Beef</span>
                  <br />
                  <span className="text-white">Near Me in Greenland, NH</span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-100 font-medium leading-relaxed">
                  Authentic Italian cuisine with fresh local ingredients.
                  <br />
                  <span className="text-yellow-300 font-bold">Great prices • Amazing taste • Family favorite</span>
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-400 p-2 rounded-full">
                    <ChefHat className="w-6 h-6 text-red-700" />
                  </div>
                  <span className="font-semibold">Authentic Italian</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-400 p-2 rounded-full">
                    <Clock className="w-6 h-6 text-red-700" />
                  </div>
                  <span className="font-semibold">Quick Service</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-400 p-2 rounded-full">
                    <Award className="w-6 h-6 text-red-700" />
                  </div>
                  <span className="font-semibold">Best Reviews</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-400 p-2 rounded-full">
                    <Users className="w-6 h-6 text-red-700" />
                  </div>
                  <span className="font-semibold">Family Owned</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/build-pizza"
                  className="bg-yellow-400 hover:bg-yellow-300 text-red-700 font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-yellow-400/50 text-center"
                >
                  🍕 Build Your Pizza Now
                </Link>
                <Link
                  href="/menu"
                  className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-red-700 font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 text-center"
                >
                  📋 View Full Menu
                </Link>
              </div>

              {/* Local Information */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/30">
                <p className="text-yellow-300 font-semibold mb-2">🏠 Located in:</p>
                <p className="text-gray-200 text-sm">
                  Greenland, NH • Serving the Seacoast Area
                </p>
              </div>
            </div>

            {/* Right Side - Visual Appeal */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="text-center space-y-4">
                  {/* Pizza Image */}
                  <div className="relative w-64 h-64 mx-auto">
                    <PizzaImage 
                      src="/images/fresh-pizza.jpg" 
                      alt="Fresh pizza from our oven"
                      className="w-full h-full object-cover rounded-full border-4 border-yellow-400 shadow-xl transform scale-125"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-300">Fresh From Our Oven</h3>
                  <p className="text-gray-200 text-sm">
                    Made with love using traditional Italian recipes and the finest local ingredients
                  </p>

                  {/* Special Offer */}
                  <div className="bg-yellow-400 text-red-700 px-6 py-4 rounded-lg font-bold">
                    <div className="text-2xl">🎉 SPECIAL OFFER</div>
                    <div className="text-lg">Buy One Pizza, Get Second 50% OFF</div>
                    <div className="text-sm mt-1">*Limited time offer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              Discover why we're the best pizza near me, roast beef near me, and Italian restaurant near me. Fresh local ingredients, authentic recipes, and great food for good lunch near me options.
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
              <h3 className="text-lg font-semibold text-orange-400 mb-2">Traditional Local Recipes</h3>
              <p className="text-gray-300 text-sm">Traditional Italian recipes with a local New England twist, serving the best pizza near me for over 25 years.</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-black/40 transition-all duration-300">
              <div className="text-3xl mb-3">🦞</div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Fresh Local Ingredients</h3>
              <p className="text-gray-300 text-sm">Fresh from New England farms and local suppliers. That's why we're known as the best Italian restaurant near me.</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-black/40 transition-all duration-300">
              <div className="text-3xl mb-3">⚾</div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">Perfect for Local Events</h3>
              <p className="text-gray-300 text-sm">Great for game days, family gatherings, or any local celebration. Your go-to restaurant near me.</p>
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
