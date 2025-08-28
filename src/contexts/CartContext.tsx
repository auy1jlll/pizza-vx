'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  intensity?: 'LIGHT' | 'REGULAR' | 'EXTRA'; // Optional explicit intensity for kitchen details
  }>;
  quantity: number;
  notes?: string;
  basePrice: number;
  totalPrice: number;
  specialtyPizzaName?: string; // Added to track specialty pizza names
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

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addPizza = (pizza: Omit<CartItem, 'id'>) => {
    const newPizza: CartItem = {
      ...pizza,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    console.log('📦 Adding pizza to cart state:', newPizza);
    setCartItems(prev => {
      const updated = [...prev, newPizza];
      console.log('📊 Cart updated. New count:', updated.length);
      return updated;
    });
  };

  const addDetailedPizza = (pizzaData: any) => {
    console.log('🍕 Adding detailed pizza to cart:', pizzaData);
    
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
  section: topping.section || topping.side || 'WHOLE',
  intensity: topping.intensity || (topping.quantity && topping.quantity < 1 ? 'LIGHT' : topping.quantity && topping.quantity > 1 ? 'EXTRA' : 'REGULAR')
      })),
      quantity: pizzaData.quantity || 1,
      notes: pizzaData.notes || '',
      basePrice: pizzaData.basePrice || pizzaData.size?.basePrice || 0,
      totalPrice: pizzaData.totalPrice || 0,
      specialtyPizzaName: pizzaData.specialtyPizzaName || undefined
    };
    
    console.log('🛒 Converted cart item:', cartItem);
    addPizza(cartItem);
    console.log('✅ Pizza added to cart');
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
      // Use the pre-calculated totalPrice if available, otherwise calculate it
      if (item.totalPrice && item.totalPrice > 0) {
        const itemQuantity = Number(item.quantity) || 1;
        return total + (item.totalPrice * itemQuantity);
      }
      
      // Fallback calculation for legacy items
      const basePrice = Number(item.basePrice) || 0;
      const crustPrice = Number(item.crust?.priceModifier) || 0;
      const saucePrice = Number(item.sauce?.priceModifier) || 0;
      const toppingsPrice = (item.toppings || []).reduce((sum, topping) => {
        return sum + (Number(topping.price) * Number(topping.quantity));
      }, 0);
      
      const itemSubtotal = basePrice + crustPrice + saucePrice + toppingsPrice;
      const itemQuantity = Number(item.quantity) || 1;
      
      return total + (itemSubtotal * itemQuantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    if (isNaN(subtotal)) return 0;
    
    const tax = getTaxAmount(subtotal); // Use dynamic tax rate from settings
    // Delivery fee should only be calculated at checkout after user selects order type
    const total = subtotal + tax;
    
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
