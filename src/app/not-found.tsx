import Link from 'next/link';
import { Home, Pizza, ShoppingCart, Phone } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-yellow-900 flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Pizza Animation */}
        <div className="mb-8">
          <div className="text-9xl mb-4 animate-bounce">🍕</div>
          <div className="text-6xl md:text-8xl font-bold text-white mb-4">
            4<span className="text-orange-400">0</span>4
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! This page got lost in the oven! 🔥
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            The page you're looking for doesn't exist, but don't worry - we've got plenty of delicious options waiting for you!
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link 
            href="/"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Home</span>
          </Link>
          
          <Link 
            href="/menu"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
          >
            <Pizza className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Menu</span>
          </Link>
          
          <Link 
            href="/build-pizza"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
          >
            <Pizza className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Build Pizza</span>
          </Link>
          
          <Link 
            href="/cart"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Cart</span>
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Popular Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Link 
                href="/gourmet-pizzas"
                className="block text-orange-300 hover:text-orange-200 transition-colors duration-300 hover:underline"
              >
                🍕 Gourmet Pizzas
              </Link>
              <Link 
                href="/specialty-calzones"
                className="block text-orange-300 hover:text-orange-200 transition-colors duration-300 hover:underline"
              >
                🥟 Specialty Calzones
              </Link>
              <Link 
                href="/about"
                className="block text-orange-300 hover:text-orange-200 transition-colors duration-300 hover:underline"
              >
                ℹ️ About Us
              </Link>
            </div>
            <div className="space-y-2">
              <Link 
                href="/contact"
                className="block text-orange-300 hover:text-orange-200 transition-colors duration-300 hover:underline"
              >
                📞 Contact
              </Link>
              <Link 
                href="/locations"
                className="block text-orange-300 hover:text-orange-200 transition-colors duration-300 hover:underline"
              >
                📍 Locations
              </Link>
              <Link 
                href="/promotions"
                className="block text-orange-300 hover:text-orange-200 transition-colors duration-300 hover:underline"
              >
                🏷️ Promotions
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">Need Help?</h3>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-6">
            <a 
              href="tel:+1234567890"
              className="flex items-center space-x-2 hover:text-yellow-200 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Call us: (123) 456-7890</span>
            </a>
            <Link 
              href="/contact"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 text-gray-400 text-sm">
          <p>🍕 Error 404: Page not found, but our pizza is always available! 🍕</p>
        </div>
      </div>
    </div>
  );
}
