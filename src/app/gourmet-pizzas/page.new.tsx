'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GourmetPizzasClient from '@/components/GourmetPizzasClient';

interface SpecialtyPizza {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  imageUrl?: string;
  ingredients: string;
  isActive: boolean;
  sizes: {
    id: string;
    price: number;
    isAvailable: boolean;
    pizzaSize: {
      id: string;
      name: string;
      diameter: string;
      basePrice: number;
      description?: string;
    };
  }[];
}

interface PizzaData {
  sizes: {
    id: string;
    name: string;
    diameter: string;
    basePrice: number;
    description: string;
    isActive: boolean;
  }[];
  crusts: any[];
  sauces: any[];
  toppings: any[];
}

export default function GourmetPizzasPage() {
  const [pizzas, setPizzas] = useState<SpecialtyPizza[]>([]);
  const [pizzaData, setPizzaData] = useState<PizzaData>({
    sizes: [
      { id: '1', name: 'Small', diameter: '10"', basePrice: 0, description: 'Perfect for 1-2 people', isActive: true },
      { id: '2', name: 'Medium', diameter: '12"', basePrice: 3, description: 'Great for 2-3 people', isActive: true },
      { id: '3', name: 'Large', diameter: '14"', basePrice: 6, description: 'Ideal for 3-4 people', isActive: true }
    ],
    crusts: [],
    sauces: [],
    toppings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching specialty pizzas from API...');
        const response = await fetch('/api/specialty-pizzas');
        if (response.ok) {
          const data = await response.json();
          console.log('Specialty pizzas fetched successfully:', data);
          setPizzas(data);
        } else {
          console.error('Failed to fetch specialty pizzas, status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching specialty pizzas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700">
        <div className="text-white text-2xl">Loading gourmet pizzas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Gourmet <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">Pizzas</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-8">
              Discover our signature collection of artisan pizzas, crafted with premium ingredients and authentic Italian techniques passed down through generations
            </p>
            
            {/* Quick Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/build-pizza"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                🎨 Build Your Own Pizza
              </Link>
              <Link 
                href="/menu"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300"
              >
                📋 View Full Menu
              </Link>
            </div>
          </div>

          {/* Client-rendered pizza grid with real data from API */}
          <GourmetPizzasClient initialPizzas={pizzas} initialPizzaData={pizzaData} />
        </div>
      </div>
    </div>
  );
}
