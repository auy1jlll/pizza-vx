'use client';

import { MenuItem } from '@/types';
import { Plus, Star } from 'lucide-react';
import Image from 'next/image';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
          }}
        />
        {item.popular && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <span className="text-lg font-bold text-red-600">
            ${item.basePrice.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3">{item.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {item.dietary.map((diet) => (
            <span
              key={diet}
              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
            >
              {diet}
            </span>
          ))}
        </div>

        <button
          onClick={() => onAddToCart(item)}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}