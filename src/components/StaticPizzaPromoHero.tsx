import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Clock, Star, UtensilsCrossed } from 'lucide-react';

export default function StaticPizzaPromoHero() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-orange-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full opacity-20"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-300 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-orange-300 rounded-full opacity-25"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 bg-white rounded-full opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Side - Promotion Text */}
          <div className="text-white space-y-8">
            {/* Promo Badge */}
            <div className="inline-flex items-center bg-yellow-400 text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide animate-pulse">
              <Star className="w-4 h-4 mr-2" />
              Limited Time Offer
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                <span className="text-yellow-300">BUY ONE</span>
                <br />
                <span className="text-white">PIZZA</span>
              </h1>
              
              <div className="text-3xl lg:text-5xl font-bold text-yellow-200">
                GET 2ND
                <span className="text-6xl lg:text-8xl text-yellow-400 ml-4">½</span>
                <span className="text-yellow-300 ml-2">OFF</span>
              </div>
            </div>

            {/* Subtext */}
            <p className="text-xl lg:text-2xl text-gray-100 font-medium leading-relaxed">
              Choose from our delicious specialty pizzas or build your own! 
              <br />
              <span className="text-yellow-300">Perfect for families & sharing</span>
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 text-gray-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span>Ready in 15-20 min</span>
              </div>
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="w-5 h-5 text-yellow-400" />
                <span>Fresh daily ingredients</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/build-pizza"
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-2xl hover:shadow-yellow-400/50 hover:scale-105 flex items-center justify-center"
              >
                <UtensilsCrossed className="w-5 h-5 mr-2" />
                Build Your Pizza
              </Link>
              
              <Link 
                href="/gourmet-pizzas"
                className="bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 flex items-center justify-center"
              >
                <Star className="w-5 h-5 mr-2" />
                View Specialties
              </Link>
            </div>

            {/* Promotion Details */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/30">
              <p className="text-sm text-yellow-200">
                <span className="font-semibold">Offer Details:</span> Second pizza must be of equal or lesser value. 
                Valid on pickup orders. Cannot be combined with other offers.
              </p>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black font-bold px-4 py-2 rounded-full text-sm transform rotate-12 shadow-lg animate-bounce">
                HOT DEAL! 🔥
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <Image
                  src="/pizza-hero.jpg"
                  alt="Delicious Pizza - Build Your Own or Choose Specialty"
                  width={600}
                  height={600}
                  className="rounded-2xl shadow-2xl w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-8 left-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              🌿 Fresh Ingredients
            </div>
            <div className="absolute bottom-8 right-8 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              🍕 Hand-tossed Dough
            </div>
          </div>
        </div>
      </div>

      {/* Quick Order Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-6 text-white">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">Quick Order:</span>
            </div>
            <Link href="/build-pizza" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
              Custom Pizza
            </Link>
            <Link href="/gourmet-pizzas" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
              Specialties
            </Link>
            <Link href="/menu" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
              Full Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
