'use client';

import { useState } from 'react';

const categories = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'appetizer', name: 'Appetizers', icon: '🧄' },
  { id: 'drink', name: 'Drinks', icon: '🥤' },
  { id: 'dessert', name: 'Desserts', icon: '🍰' },
];

interface MenuCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function MenuCategories({ selectedCategory, onCategoryChange }: MenuCategoriesProps) {
  return (
    <div className="flex overflow-x-auto pb-2 mb-6 space-x-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-colors ${
            selectedCategory === category.id
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
          }`}
        >
          <span className="text-lg">{category.icon}</span>
          <span className="font-medium whitespace-nowrap">{category.name}</span>
        </button>
      ))}
    </div>
  );
}