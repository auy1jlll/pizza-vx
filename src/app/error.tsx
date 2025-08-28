'use client'

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Error Animation */}
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-pulse">🍕💥</div>
          <div className="flex items-center justify-center space-x-2 text-6xl md:text-7xl font-bold text-white mb-4">
            <AlertTriangle className="w-16 h-16 text-yellow-400 animate-bounce" />
            <span>Oops!</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Something went wrong in our kitchen! 🔥
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Don't worry - our chefs are working to fix this right away. 
            Try refreshing the page or head back to our menu!
          </p>
          
          {/* Error Details (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-900/50 border border-red-600 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-red-300 font-semibold mb-2">Development Error Details:</h3>
              <code className="text-red-200 text-sm break-all">
                {error.message}
              </code>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <button
            onClick={reset}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>
          
          <Link 
            href="/"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link 
            href="/menu"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>🍕 View Menu</span>
          </Link>
          
          <Link 
            href="/build-pizza"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>🛠️ Build Pizza</span>
          </Link>
          
          <Link 
            href="/contact"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>📞 Contact Us</span>
          </Link>
        </div>

        {/* Support Information */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">Still Having Issues?</h3>
          <p className="mb-4">Our support team is here to help you get back to ordering delicious pizza!</p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-6">
            <a 
              href="tel:+1234567890"
              className="flex items-center space-x-2 hover:text-yellow-200 transition-colors"
            >
              <span>📞 Call: (123) 456-7890</span>
            </a>
            <a 
              href="mailto:support@pizzarestaurant.com"
              className="flex items-center space-x-2 hover:text-yellow-200 transition-colors"
            >
              <span>✉️ Email Support</span>
            </a>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 text-gray-400 text-sm">
          <p>🍕 Don't worry, our pizza ovens are still working perfectly! 🔥</p>
        </div>
      </div>
    </div>
  );
}
