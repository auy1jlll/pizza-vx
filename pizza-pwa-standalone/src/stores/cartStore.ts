import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Customer } from '@/types';

interface CartStore {
  items: CartItem[];
  customer: Customer | null;
  tableNumber: number | null;

  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCustomer: (customer: Customer) => void;
  setTableNumber: (tableNumber: number) => void;

  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      customer: null,
      tableNumber: null,

      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += item.quantity;
            return { items: updatedItems };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [], customer: null }),

      setCustomer: (customer) => set({ customer }),

      setTableNumber: (tableNumber) => set({ tableNumber }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return subtotal * 0.08; // 8% tax
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTax();
        return subtotal + tax;
      },
    }),
    {
      name: 'pizza-cart-storage',
    }
  )
);