import { MenuItem, PizzaTopping, PizzaSize } from '@/types';

export const pizzaSizes: PizzaSize[] = [
  { id: 'small', name: 'Small (10")', multiplier: 1 },
  { id: 'medium', name: 'Medium (12")', multiplier: 1.3 },
  { id: 'large', name: 'Large (14")', multiplier: 1.6 },
  { id: 'xlarge', name: 'X-Large (16")', multiplier: 2 },
];

export const pizzaToppings: PizzaTopping[] = [
  // Meat
  { id: 'pepperoni', name: 'Pepperoni', price: 2.5, category: 'meat' },
  { id: 'sausage', name: 'Italian Sausage', price: 2.5, category: 'meat' },
  { id: 'bacon', name: 'Bacon', price: 3, category: 'meat' },
  { id: 'ham', name: 'Ham', price: 2.5, category: 'meat' },
  { id: 'chicken', name: 'Grilled Chicken', price: 3, category: 'meat' },

  // Vegetables
  { id: 'mushrooms', name: 'Mushrooms', price: 1.5, category: 'vegetable' },
  { id: 'peppers', name: 'Bell Peppers', price: 1.5, category: 'vegetable' },
  { id: 'onions', name: 'Red Onions', price: 1, category: 'vegetable' },
  { id: 'olives', name: 'Black Olives', price: 2, category: 'vegetable' },
  { id: 'tomatoes', name: 'Fresh Tomatoes', price: 1.5, category: 'vegetable' },
  { id: 'spinach', name: 'Fresh Spinach', price: 2, category: 'vegetable' },

  // Cheese
  { id: 'mozzarella', name: 'Extra Mozzarella', price: 2, category: 'cheese' },
  { id: 'parmesan', name: 'Parmesan', price: 2.5, category: 'cheese' },
  { id: 'ricotta', name: 'Ricotta', price: 2.5, category: 'cheese' },
];

export const menuItems: MenuItem[] = [
  // Pizzas
  {
    id: 'margherita',
    name: 'Margherita',
    description: 'Fresh mozzarella, basil, and tomato sauce',
    basePrice: 14.99,
    category: 'pizza',
    image: '/images/margherita.jpg',
    dietary: ['vegetarian'],
    popular: true,
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni Classic',
    description: 'Pepperoni and mozzarella cheese',
    basePrice: 16.99,
    category: 'pizza',
    image: '/images/pepperoni.jpg',
    dietary: [],
    popular: true,
  },
  {
    id: 'supreme',
    name: 'Supreme',
    description: 'Pepperoni, sausage, peppers, onions, mushrooms, and olives',
    basePrice: 19.99,
    category: 'pizza',
    image: '/images/supreme.jpg',
    dietary: [],
  },
  {
    id: 'veggie',
    name: 'Veggie Deluxe',
    description: 'Mushrooms, peppers, onions, tomatoes, and spinach',
    basePrice: 17.99,
    category: 'pizza',
    image: '/images/veggie.jpg',
    dietary: ['vegetarian'],
  },

  // Appetizers
  {
    id: 'garlic-bread',
    name: 'Garlic Bread',
    description: 'Fresh baked bread with garlic butter and herbs',
    basePrice: 6.99,
    category: 'appetizer',
    image: '/images/garlic-bread.jpg',
    dietary: ['vegetarian'],
  },
  {
    id: 'mozzarella-sticks',
    name: 'Mozzarella Sticks',
    description: 'Crispy breaded mozzarella with marinara sauce',
    basePrice: 8.99,
    category: 'appetizer',
    image: '/images/mozzarella-sticks.jpg',
    dietary: ['vegetarian'],
  },
  {
    id: 'wings',
    name: 'Buffalo Wings',
    description: '8 pieces with celery and blue cheese dip',
    basePrice: 11.99,
    category: 'appetizer',
    image: '/images/wings.jpg',
    dietary: [],
  },

  // Drinks
  {
    id: 'coke',
    name: 'Coca-Cola',
    description: 'Classic Coca-Cola (20oz)',
    basePrice: 2.99,
    category: 'drink',
    image: '/images/coke.jpg',
    dietary: ['vegetarian', 'vegan'],
  },
  {
    id: 'sprite',
    name: 'Sprite',
    description: 'Lemon-lime soda (20oz)',
    basePrice: 2.99,
    category: 'drink',
    image: '/images/sprite.jpg',
    dietary: ['vegetarian', 'vegan'],
  },
  {
    id: 'water',
    name: 'Bottled Water',
    description: 'Pure spring water (16.9oz)',
    basePrice: 1.99,
    category: 'drink',
    image: '/images/water.jpg',
    dietary: ['vegetarian', 'vegan'],
  },

  // Desserts
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    basePrice: 6.99,
    category: 'dessert',
    image: '/images/tiramisu.jpg',
    dietary: ['vegetarian'],
  },
  {
    id: 'cannoli',
    name: 'Cannoli',
    description: 'Sicilian pastry filled with sweet ricotta (2 pieces)',
    basePrice: 5.99,
    category: 'dessert',
    image: '/images/cannoli.jpg',
    dietary: ['vegetarian'],
  },
];