'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  type: 'custom' | 'specialty';
  name: string;
  price: number;
  quantity: number;
  
  // Basic pizza info (for simple specialty pizzas)
  size?: string;
  crust?: string;
  sauce?: string;
  toppings?: string[];
  specialtyPizzaId?: string;
  customizations?: string;
  
  // Detailed pizza builder info (for custom and customized specialty pizzas)
  sizeId?: string;
  sizeName?: string;
  crustId?: string;
  crustName?: string;
  sauceId?: string;
  sauceName?: string;
  sauceIntensity?: 'LIGHT' | 'REGULAR' | 'EXTRA';
  crustCookingLevel?: 'LIGHT' | 'REGULAR' | 'WELL_DONE';
  detailedToppings?: Array<{
    toppingId: string;
    toppingName: string;
    section: 'WHOLE' | 'LEFT' | 'RIGHT';
    intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    price: number;
  }>;
  notes?: string;
  totalPrice?: number;
  specialtyPizzaName?: string;
  specialtyPizzaChanges?: {
    addedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    }>;
    removedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    }>;
    modifiedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      originalIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      newIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    }>;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  addDetailedPizza: (pizza: {
    sizeId: string;
    sizeName: string;
    crustId: string;
    crustName: string;
    sauceId: string;
    sauceName: string;
    sauceIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    crustCookingLevel: 'LIGHT' | 'REGULAR' | 'WELL_DONE';
    detailedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      price: number;
    }>;
    notes?: string;
    totalPrice: number;
    specialtyPizzaName?: string;
    specialtyPizzaChanges?: {
      addedToppings: Array<{
        toppingId: string;
        toppingName: string;
        section: 'WHOLE' | 'LEFT' | 'RIGHT';
        intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      }>;
      removedToppings: Array<{
        toppingId: string;
        toppingName: string;
        section: 'WHOLE' | 'LEFT' | 'RIGHT';
        intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      }>;
      modifiedToppings: Array<{
        toppingId: string;
        toppingName: string;
        section: 'WHOLE' | 'LEFT' | 'RIGHT';
        originalIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
        newIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      }>;
    };
  }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pizza-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('pizza-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'id' | 'quantity'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const cartItem: CartItem = {
      ...newItem,
      id,
      quantity: 1
    };

    setItems(prev => {
      // Check if identical item exists (for specialty pizzas without customizations)
      if (newItem.type === 'specialty' && !newItem.customizations && !newItem.specialtyPizzaChanges) {
        const existingItem = prev.find(item => 
          item.type === 'specialty' && 
          item.specialtyPizzaId === newItem.specialtyPizzaId &&
          !item.customizations &&
          !item.specialtyPizzaChanges
        );
        
        if (existingItem) {
          return prev.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
      }

      return [...prev, cartItem];
    });
  };

  const addDetailedPizza = (pizza: {
    sizeId: string;
    sizeName: string;
    crustId: string;
    crustName: string;
    sauceId: string;
    sauceName: string;
    sauceIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
    crustCookingLevel: 'LIGHT' | 'REGULAR' | 'WELL_DONE';
    detailedToppings: Array<{
      toppingId: string;
      toppingName: string;
      section: 'WHOLE' | 'LEFT' | 'RIGHT';
      intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      price: number;
    }>;
    notes?: string;
    totalPrice: number;
    specialtyPizzaName?: string;
    specialtyPizzaChanges?: {
      addedToppings: Array<{
        toppingId: string;
        toppingName: string;
        section: 'WHOLE' | 'LEFT' | 'RIGHT';
        intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      }>;
      removedToppings: Array<{
        toppingId: string;
        toppingName: string;
        section: 'WHOLE' | 'LEFT' | 'RIGHT';
        intensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      }>;
      modifiedToppings: Array<{
        toppingId: string;
        toppingName: string;
        section: 'WHOLE' | 'LEFT' | 'RIGHT';
        originalIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
        newIntensity: 'LIGHT' | 'REGULAR' | 'EXTRA';
      }>;
    };
  }) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate a descriptive name for the pizza
    let pizzaName = pizza.specialtyPizzaName 
      ? `${pizza.specialtyPizzaName} (${pizza.sizeName})`
      : `Custom ${pizza.sizeName} Pizza`;
    
    if (pizza.specialtyPizzaName && pizza.specialtyPizzaChanges) {
      const hasChanges = pizza.specialtyPizzaChanges.addedToppings.length > 0 || 
                        pizza.specialtyPizzaChanges.removedToppings.length > 0 || 
                        pizza.specialtyPizzaChanges.modifiedToppings.length > 0;
      if (hasChanges) {
        pizzaName += ' (Customized)';
      }
    }

    const cartItem: CartItem = {
      id,
      type: pizza.specialtyPizzaName ? 'specialty' : 'custom',
      name: pizzaName,
      price: pizza.totalPrice,
      quantity: 1,
      
      // Detailed pizza builder data
      sizeId: pizza.sizeId,
      sizeName: pizza.sizeName,
      crustId: pizza.crustId,
      crustName: pizza.crustName,
      sauceId: pizza.sauceId,
      sauceName: pizza.sauceName,
      sauceIntensity: pizza.sauceIntensity,
      crustCookingLevel: pizza.crustCookingLevel,
      detailedToppings: pizza.detailedToppings,
      notes: pizza.notes,
      totalPrice: pizza.totalPrice,
      specialtyPizzaName: pizza.specialtyPizzaName,
      specialtyPizzaChanges: pizza.specialtyPizzaChanges
    };

    setItems(prev => [...prev, cartItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      // Use totalPrice if available (from detailed pizzas), otherwise use price
      const itemPrice = item.totalPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      addDetailedPizza,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
