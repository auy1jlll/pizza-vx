'use client';

import { useState } from 'react';
import { MenuItem, PizzaSize, PizzaTopping, CartItem } from '@/types';
import { pizzaSizes, pizzaToppings } from '@/data/menu';
import { X, Plus, Minus } from 'lucide-react';

interface PizzaCustomizerProps {
  pizza: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export default function PizzaCustomizer({ pizza, isOpen, onClose, onAddToCart }: PizzaCustomizerProps) {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(pizzaSizes[0]);
  const [selectedToppings, setSelectedToppings] = useState<PizzaTopping[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const toggleTopping = (topping: PizzaTopping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = pizza.basePrice * selectedSize.multiplier;
    const toppingsPrice = selectedToppings.reduce((total, topping) => total + topping.price, 0);
    return basePrice + toppingsPrice;
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${pizza.id}-${selectedSize.id}-${Date.now()}`,
      menuItem: pizza,
      quantity,
      size: selectedSize,
      toppings: selectedToppings,
      specialInstructions: specialInstructions || undefined,
      totalPrice: calculateTotalPrice(),
    };
    onAddToCart(cartItem);
    onClose();
  };

  if (!isOpen) return null;

  const toppingsByCategory = {
    meat: pizzaToppings.filter(t => t.category === 'meat'),
    vegetable: pizzaToppings.filter(t => t.category === 'vegetable'),
    cheese: pizzaToppings.filter(t => t.category === 'cheese'),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customize Your {pizza.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Choose Size</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pizzaSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    selectedSize.id === size.id
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  <div className="text-sm font-medium">{size.name}</div>
                  <div className="text-xs text-gray-600">
                    ${(pizza.basePrice * size.multiplier).toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Toppings Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Add Toppings</h3>

            {Object.entries(toppingsByCategory).map(([category, toppings]) => (
              <div key={category} className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2 capitalize">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {toppings.map((topping) => {
                    const isSelected = selectedToppings.find(t => t.id === topping.id);
                    return (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping)}
                        className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${
                          isSelected
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-300 hover:border-red-300'
                        }`}
                      >
                        <span className="text-sm">{topping.name}</span>
                        <span className="text-sm font-medium">+${topping.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests for your pizza..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20"
            />
          </div>

          {/* Quantity and Total */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-xl font-bold text-red-600">
                ${(calculateTotalPrice() * quantity).toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Add to Cart - ${(calculateTotalPrice() * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}