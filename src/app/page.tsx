import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-orange-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-6xl">🏛️</div>
          <div className="absolute top-40 right-20 text-4xl">🦞</div>
          <div className="absolute bottom-40 left-20 text-5xl">⚾</div>
          <div className="absolute bottom-20 right-10 text-3xl">🍀</div>
          <div className="absolute top-60 left-1/2 text-4xl">🧱</div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
          {/* Main Hero Content */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Authentic <span className="text-orange-400 drop-shadow-lg">Boston</span>
                <br />
                <span className="text-green-400 drop-shadow-lg">Pizza</span> Experience
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                From the heart of Beantown to your table. Crafted with locally-sourced ingredients 
                and that authentic Boston spirit. Build your perfect slice, wicked good style.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/pizza-builder"
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-orange-500/25"
              >
                🍕 Build Your Pizza
              </Link>
              <Link 
                href="/specialty-pizzas"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-green-500/25"
              >
                🍀 Specialty Pizzas
              </Link>
              <Link 
                href="/order-history"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-blue-500/25"
              >
                📋 Order History
              </Link>
            </div>

            {/* Boston Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-black/40 transition-all duration-300">
                <div className="text-3xl mb-3">🧱</div>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">North End Inspired</h3>
                <p className="text-gray-300 text-sm">Traditional recipes passed down through generations in Boston's historic Italian quarter.</p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-black/40 transition-all duration-300">
                <div className="text-3xl mb-3">🦞</div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Local Ingredients</h3>
                <p className="text-gray-300 text-sm">Fresh from New England farms and the finest local suppliers around Greater Boston.</p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-black/40 transition-all duration-300">
                <div className="text-3xl mb-3">⚾</div>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Game Day Ready</h3>
                <p className="text-gray-300 text-sm">Perfect for Red Sox games, Celtics nights, or any Boston sports celebration.</p>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
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
              <div className="text-gray-300">Years Serving Boston</div>
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
