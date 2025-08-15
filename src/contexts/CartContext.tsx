'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useSettings } from './SettingsContext';

// Define the cart item structure
export interface CartItem {
  id: string;
  size: {
    id: string;
    name: string;
    diameter: string;
    basePrice: number;
    isActive: boolean;
    sortOrder: number;
  } | null;
  crust: {
    id: string;
    name: string;
    description: string;
    priceModifier: number;
    isActive: boolean;
    sortOrder: number;
  } | null;
  sauce: {
    id: string;
    name: string;
    description: string;
    color: string;
    spiceLevel: number;
    priceModifier: number;
    isActive: boolean;
    sortOrder: number;
  } | null;
  toppings: Array<{
    id: string;
    name: string;
    category?: string;
    price: number; // Changed from priceModifier to price
    quantity: number; // Added quantity (1 = full, 0.5 = half, etc.)
    section: 'LEFT' | 'RIGHT' | 'WHOLE'; // Changed from optional side to required section
    isActive?: boolean;
  }>;
  quantity: number;
  notes?: string;
  basePrice: number;
  totalPrice: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addPizza: (pizza: Omit<CartItem, 'id'>) => void;
  addDetailedPizza: (pizza: any) => void;
  removePizza: (id: string) => void;
  updatePizzaQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { getTaxAmount } = useSettings();

  const addPizza = (pizza: Omit<CartItem, 'id'>) => {
    const newPizza: CartItem = {
      ...pizza,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setCartItems(prev => [...prev, newPizza]);
  };

  const addDetailedPizza = (pizzaData: any) => {
    // Convert detailed pizza data to CartItem format
    const cartItem: Omit<CartItem, 'id'> = {
      size: pizzaData.size || {
        id: pizzaData.sizeId || 'unknown',
        name: pizzaData.sizeName || 'Unknown Size',
        diameter: '',
        basePrice: pizzaData.basePrice || 0,
        isActive: true,
        sortOrder: 0
      },
      crust: pizzaData.crust || {
        id: pizzaData.crustId || 'unknown',
        name: pizzaData.crustName || 'Unknown Crust',
        description: '',
        priceModifier: 0,
        isActive: true,
        sortOrder: 0
      },
      sauce: pizzaData.sauce || {
        id: pizzaData.sauceId || 'unknown',
        name: pizzaData.sauceName || 'Unknown Sauce',
        description: '',
        color: '',
        spiceLevel: 0,
        priceModifier: 0,
        isActive: true,
        sortOrder: 0
      },
      toppings: (pizzaData.toppings || pizzaData.detailedToppings || []).map((topping: any) => ({
        id: topping.id || topping.toppingId || 'unknown',
        name: topping.name || topping.toppingName || 'Unknown',
        category: topping.category || '',
        price: Number(topping.price || topping.priceModifier || 0),
        quantity: topping.quantity || (topping.intensity === 'LIGHT' ? 0.75 : topping.intensity === 'EXTRA' ? 1.5 : 1),
        section: topping.section || topping.side || 'WHOLE'
      })),
      quantity: pizzaData.quantity || 1,
      notes: pizzaData.notes || '',
      basePrice: pizzaData.basePrice || pizzaData.size?.basePrice || 0,
      totalPrice: pizzaData.totalPrice || 0
    };
    
    addPizza(cartItem);
  };

  const removePizza = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updatePizzaQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removePizza(id);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = Number(item.totalPrice) || 0;
      const itemQuantity = Number(item.quantity) || 1;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    if (isNaN(subtotal)) return 0;
    
    const tax = getTaxAmount(subtotal); // Use dynamic tax rate from settings
    const deliveryFee = subtotal > 0 ? 3.99 : 0;
    const total = subtotal + tax + deliveryFee;
    
    return isNaN(total) ? 0 : total;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addPizza,
      addDetailedPizza,
      removePizza,
      updatePizzaQuantity,
      clearCart,
      calculateSubtotal,
      calculateTotal,
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
