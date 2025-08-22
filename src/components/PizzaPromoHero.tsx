'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Clock, Star, UtensilsCrossed } from 'lucide-react';

export default function PizzaPromoHero() {
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
            <div className="flex flex-wrap gap-6 text-gray-200">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-300" />
                <span>Quick Pickup</span>
              </div>
              <div className="flex items-center">
                <UtensilsCrossed className="w-5 h-5 mr-2 text-yellow-300" />
                <span>Dine-In Available</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-300" />
                <span>Fresh Made Daily</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/menu" 
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                ORDER NOW
              </Link>
              
              <Link 
                href="/build-pizza" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 border-2 border-white/30 hover:border-white/50 flex items-center justify-center"
              >
                BUILD YOUR PIZZA
              </Link>
            </div>

            {/* Terms */}
            <p className="text-sm text-gray-300 opacity-80">
              *Valid on regular menu price pizzas. Cannot be combined with other offers. Limited time only.
            </p>
          </div>

          {/* Right Side - Pizza Image */}
          <div className="relative lg:block">
            {/* Main Pizza */}
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glowing effect behind pizza */}
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-3xl transform scale-110"></div>
              
              {/* Real Pizza Image */}
              <div className="relative z-10 transform rotate-12 hover:rotate-6 transition-transform duration-700 w-full max-w-lg mx-auto">
                <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-yellow-400/50 drop-shadow-2xl">
                  <Image 
                    src="/pizza-hero.jpg" 
                    alt="Delicious Pizza - Buy One Get Second Half Off"
                    fill
                    className="object-cover"
                    style={{
                      filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
                    }}
                    priority
                    sizes="(max-width: 768px) 300px, 500px"
                  />
                </div>
              </div>
              
              {/* Steam effect */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 space-y-2 opacity-60">
                <div className="w-1 h-8 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 -left-10 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm transform -rotate-12 shadow-lg animate-bounce">
              FRESH!
            </div>
            
            <div className="absolute bottom-20 -right-10 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm transform rotate-12 shadow-lg animate-bounce" style={{animationDelay: '1s'}}>
              HOT!
            </div>
          </div>
        </div>
      </div>

      {/* Floating Pizza Slices */}
      <div className="absolute top-1/4 left-10 opacity-20 animate-float">
        <div className="w-16 h-16 bg-yellow-400 rounded-full"></div>
      </div>
      
      <div className="absolute bottom-1/4 right-20 opacity-20 animate-float" style={{animationDelay: '2s'}}>
        <div className="w-12 h-12 bg-red-400 rounded-full"></div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
