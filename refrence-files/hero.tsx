import React, { useState, useEffect } from 'react';
import { ChefHat, MapPin, Clock, Star, Salad, Leaf } from 'lucide-react';

const PizzaSubHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const slides = [
    {
      title: "Artisan Pizza & Fresh Subs",
      subtitle: "Crafted with love in your neighborhood",
      image: "🍕"
    },
    {
      title: "Fresh Garden Salads",
      subtitle: "Farm-to-table crispy greens",
      image: "🥗"
    },
    {
      title: "Family Recipes Since 1995",
      subtitle: "Authentic flavors, modern twist",
      image: "🌿"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-green-700 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-600 to-red-600 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-green-400 to-emerald-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-20 right-1/4 w-40 h-40 bg-gradient-to-bl from-green-300 to-green-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-32 h-32 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-orange-600 rounded-full animate-ping opacity-80"></div>
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-green-300 rounded-full animate-ping opacity-70" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-1/6 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/6 right-1/3 w-3 h-3 bg-orange-600 rounded-full animate-ping opacity-70" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className={`flex justify-between items-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-3 rounded-full shadow-lg">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Nonna's Corner</h1>
              <p className="text-sm text-green-200">Est. 1995</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-1">
            <a href="#pizza" className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-green-700">Pizza</a>
            <a href="#subs" className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-green-700">Subs</a>
            <a href="#dinners" className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-green-700">Dinners</a>
            <a href="#seafood" className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-green-700">Seafood</a>
            <a href="#sandwiches" className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-green-700">Sandwiches</a>
            <a href="#roast-beef" className="text-white hover:text-orange-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-green-700">Roast Beef</a>
            <div className="w-px h-6 bg-green-400 mx-2"></div>
            <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Order Now
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button className="p-2 rounded-lg hover:bg-orange-50 transition-colors">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-gray-600 rounded"></div>
                <div className="w-full h-0.5 bg-gray-600 rounded"></div>
                <div className="w-full h-0.5 bg-gray-600 rounded"></div>
              </div>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        <div className="lg:hidden bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-4 space-y-2 hidden" id="mobile-menu">
          <a href="#pizza" className="block text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50">🍕 Pizza</a>
          <a href="#subs" className="block text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50">🥪 Subs</a>
          <a href="#dinners" className="block text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50">🍽️ Dinners</a>
          <a href="#seafood" className="block text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50">🦐 Seafood</a>
          <a href="#sandwiches" className="block text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50">🥙 Sandwiches</a>
          <a href="#roast-beef" className="block text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-orange-50">🥩 Roast Beef</a>
          <div className="pt-2">
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300">
              Order Now
            </button>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[65vh]">
          {/* Left Content */}
          <div className={`lg:w-1/2 space-y-8 transition-all duration-1200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            {/* Sliding text content */}
            <div className="relative h-32 overflow-hidden">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    currentSlide === index 
                      ? 'translate-y-0 opacity-100' 
                      : index < currentSlide 
                        ? '-translate-y-full opacity-0' 
                        : 'translate-y-full opacity-0'
                  }`}
                >
                  <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-xl text-gray-600 font-light">
                    {slide.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 font-medium">Local Favorite</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Salad className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700 font-medium">Fresh Salads</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 font-medium">4.8 Rating</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                Order for Delivery
              </button>
              <button className="border-2 border-green-400 text-green-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-orange-500 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-green-50 transition-all duration-300 bg-white/70 backdrop-blur-sm">
                View Menu
              </button>
            </div>

            {/* Quick info */}
            <div className="flex items-center space-x-6 pt-4 text-sm text-gray-600">
              <span>📍 Downtown Main Street</span>
              <span>🕐 Open until 10 PM</span>
              <span>🚗 Free Delivery</span>
            </div>
          </div>

          {/* Right Visual */}
          <div className={`lg:w-1/2 mt-12 lg:mt-0 transition-all duration-1400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              {/* Main visual container */}
              <div className="relative bg-white/30 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="text-center">
                  <div className="text-8xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
                    {slides[currentSlide].image}
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      <div className="bg-gradient-to-br from-orange-400 to-red-400 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transform rotate-12">
                        🍅
                      </div>
                      <div className="bg-gradient-to-br from-green-400 to-emerald-400 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transform -rotate-12">
                        🌿
                      </div>
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-400 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transform rotate-6">
                        🧀
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-red-400 to-pink-400 w-20 h-20 rounded-full flex items-center justify-center text-white text-xl shadow-lg animate-float">
                🍕
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-green-400 to-teal-400 w-16 h-16 rounded-full flex items-center justify-center text-white text-lg shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                🥗
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-orange-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PizzaSubHero;