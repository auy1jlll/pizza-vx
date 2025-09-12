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
  name?: string; // Added to preserve item names for display
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
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          // Validate cart data structure
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          } else {
            console.warn('Invalid cart data in localStorage, clearing...');
            localStorage.removeItem('cartItems');
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cartItems'); // Clear corrupted data
      }
    };
    
    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const saveCart = () => {
      try {
        // Only save if cartItems is valid
        if (Array.isArray(cartItems)) {
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
        // If we can't save, at least don't crash
        if (error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded, clearing old data');
          localStorage.clear();
        }
      }
    };
    
    saveCart();
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
        basePrice: pizzaData.size?.basePrice || pizzaData.basePrice || 0, // Prioritize specialty size price
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
      basePrice: pizzaData.size?.basePrice || pizzaData.totalPrice || pizzaData.basePrice || 0, // Use specialty size price first
      totalPrice: pizzaData.totalPrice || 0,
      specialtyPizzaName: pizzaData.specialtyPizzaName || undefined,
      name: pizzaData.name || pizzaData.specialtyPizzaName || undefined
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
    try {
      if (!Array.isArray(cartItems)) return 0;
      
      return cartItems.reduce((total, item) => {
        try {
          // Use the pre-calculated totalPrice if available, otherwise calculate it
          if (item.totalPrice && item.totalPrice > 0) {
            const itemQuantity = Number(item.quantity) || 1;
            const itemTotal = item.totalPrice * itemQuantity;
            return isNaN(itemTotal) ? total : total + itemTotal;
          }
          
          // Fallback calculation for legacy items
          const basePrice = Number(item.basePrice) || 0;
          const crustPrice = Number(item.crust?.priceModifier) || 0;
          const saucePrice = Number(item.sauce?.priceModifier) || 0;
          const toppingsPrice = (item.toppings || []).reduce((sum, topping) => {
            const toppingTotal = Number(topping.price) * Number(topping.quantity || 1);
            return isNaN(toppingTotal) ? sum : sum + toppingTotal;
          }, 0);
          
          const itemSubtotal = basePrice + crustPrice + saucePrice + toppingsPrice;
          const itemQuantity = Number(item.quantity) || 1;
          const itemTotal = itemSubtotal * itemQuantity;
          
          return isNaN(itemTotal) ? total : total + itemTotal;
        } catch (itemError) {
          console.warn('Error calculating price for item:', item.id, itemError);
          return total;
        }
      }, 0);
    } catch (error) {
      console.error('Error calculating subtotal:', error);
      return 0;
    }
  };

  const calculateTotal = () => {
    try {
      const subtotal = calculateSubtotal();
      if (isNaN(subtotal) || subtotal < 0) return 0;
      
      const tax = getTaxAmount(subtotal); // Use dynamic tax rate from settings
      // Delivery fee should only be calculated at checkout after user selects order type
      const total = subtotal + (isNaN(tax) ? 0 : tax);
      
      return isNaN(total) || total < 0 ? 0 : Math.round(total * 100) / 100;
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
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
