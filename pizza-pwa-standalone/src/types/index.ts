export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: 'pizza' | 'appetizer' | 'drink' | 'dessert';
  image: string;
  dietary: ('vegetarian' | 'vegan' | 'gluten-free')[];
  popular?: boolean;
}

export interface PizzaTopping {
  id: string;
  name: string;
  price: number;
  category: 'meat' | 'vegetable' | 'cheese' | 'sauce';
}

export interface PizzaSize {
  id: string;
  name: string;
  multiplier: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  size?: PizzaSize;
  toppings?: PizzaTopping[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  tableNumber?: number;
  orderType: 'dine-in' | 'takeout' | 'delivery';
  deliveryAddress?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  status: 'pending' | 'received' | 'preparing' | 'ready' | 'completed';
  createdAt: Date;
  specialInstructions?: string;
}