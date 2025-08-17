import { z } from 'zod';

// Base validation helpers
export const positiveNumber = z.number().positive();
export const nonNegativeNumber = z.number().min(0);
export const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
export const emailSchema = z.string().email();

// Enums for constants
export const OrderStatus = z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']);
export const OrderType = z.enum(['PICKUP', 'DELIVERY', 'pickup', 'delivery']).transform(val => val.toUpperCase() as 'PICKUP' | 'DELIVERY');
export const ToppingSection = z.enum(['LEFT', 'RIGHT', 'WHOLE']);
export const ToppingIntensity = z.enum(['LIGHT', 'REGULAR', 'EXTRA']);
export const SettingType = z.enum(['STRING', 'NUMBER', 'BOOLEAN', 'JSON']);

// Pizza Component Schemas
export const PizzaSizeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Size name is required'),
  diameter: z.string(),
  basePrice: nonNegativeNumber,
  isActive: z.boolean(),
  sortOrder: z.number(),
  description: z.string().optional(),
});

export const PizzaCrustSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Crust name is required'),
  description: z.string().optional(),
  priceModifier: z.number(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const PizzaSauceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Sauce name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  spiceLevel: z.number().min(0).max(5),
  priceModifier: z.number(),
  isActive: z.boolean(),
  sortOrder: z.number(),
});

export const PizzaToppingSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Topping name is required'),
  description: z.string().optional(),
  category: z.string(),
  price: nonNegativeNumber,
  isActive: z.boolean(),
  sortOrder: z.number(),
  isVegetarian: z.boolean(),
  isVegan: z.boolean(),
  isGlutenFree: z.boolean(),
});

// Cart and Order Schemas - Flexible for both Pizza and Menu Items
export const CartToppingSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: nonNegativeNumber,
  quantity: z.number().min(0.25).max(3), // 1/4, 1/2, 1x, 2x, 3x
  section: ToppingSection,
  intensity: ToppingIntensity.optional(),
});

// Flexible customization schema (works for pizza toppings AND menu item options)
export const CustomizationSchema = z.object({
  optionId: z.string(),
  name: z.string().optional(),
  
  // Pizza-specific fields (optional for non-pizza items)
  pizzaHalf: z.enum(['whole', 'left', 'right']).default('whole').optional(),
  
  // General fields
  quantity: z.number().int().min(1).default(1),
  priceModifier: z.number().min(0).default(0),
  
  // Legacy support for old pizza structure
  toppingId: z.string().optional(), // maps to optionId
  half: z.enum(['whole', 'left', 'right']).optional(), // maps to pizzaHalf
  section: ToppingSection.optional(), // legacy pizza support
  intensity: ToppingIntensity.optional(), // legacy pizza support
  price: z.number().optional(),
});

// Flexible order item schema that supports both pizza and menu items
export const CartItemSchema = z.object({
  // Common fields for all items
  id: z.string().optional(),
  type: z.enum(['pizza', 'menu']).optional(), // To identify item type
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  basePrice: nonNegativeNumber,
  totalPrice: nonNegativeNumber,
  notes: z.string().optional(),
  
  // Menu item fields (for sandwiches, salads, etc.)
  menuItemId: z.string().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
  customizations: z.array(CustomizationSchema).optional(),
  
  // Pizza-specific fields (legacy support)
  size: PizzaSizeSchema.optional(),
  crust: PizzaCrustSchema.optional(), 
  sauce: PizzaSauceSchema.optional(),
  toppings: z.array(CartToppingSchema).optional(),
  
  // Pizza size/crust/sauce IDs (alternative format)
  sizeId: z.string().optional(),
  crustId: z.string().optional(),
  sauceId: z.string().optional(),
}).refine((data) => {
  // Either pizza fields OR menu item fields must be present
  const hasPizzaFields = data.size || data.sizeId;
  const hasMenuFields = data.menuItemId;
  return hasPizzaFields || hasMenuFields;
}, {
  message: "Item must be either a pizza (with size) or a menu item (with menuItemId)"
});

// Customer Information Schema
export const CustomerInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
});

// Delivery Information Schema
export const DeliveryInfoSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  zip: z.string().min(5, 'ZIP code must be at least 5 characters'),
  instructions: z.string().optional(),
});

// Order Schema
export const CreateOrderSchema = z.object({
  orderType: OrderType,
  paymentMethod: z.string().optional(),
  customer: CustomerInfoSchema,
  delivery: DeliveryInfoSchema.nullable().optional(),
  items: z.array(CartItemSchema).min(1, 'At least one item is required'),
  scheduledTime: z.string().datetime().optional(),
  notes: z.string().optional(),
  subtotal: nonNegativeNumber,
  deliveryFee: nonNegativeNumber,
  tipAmount: z.number().nullable().optional(),
  tipPercentage: z.number().nullable().optional(),
  customTipAmount: z.number().nullable().optional(),
  tax: nonNegativeNumber,
  total: positiveNumber,
});

// Settings Schema
export const SettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: SettingType,
  description: z.string().optional(),
});

export const UpdateSettingsSchema = z.record(z.string(), z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.object({}).passthrough(),
]));

// API Request/Response Schemas
export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
});

// Pizza Builder API Schemas
export const PizzaConfigSchema = z.object({
  sizes: z.array(PizzaSizeSchema),
  crusts: z.array(PizzaCrustSchema),
  sauces: z.array(PizzaSauceSchema),
  toppings: z.array(PizzaToppingSchema),
});

// Kitchen Order Update Schema
export const UpdateOrderStatusSchema = z.object({
  status: OrderStatus,
  notes: z.string().optional(),
});

// Specialty Pizza Schema
export const SpecialtyPizzaSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Pizza name is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().optional(),
  basePrice: nonNegativeNumber,
  isActive: z.boolean(),
  category: z.string().optional(),
  toppings: z.array(z.object({
    id: z.number(),
    quantity: z.number().min(0.25).max(3),
    section: ToppingSection,
  })).optional(),
});

// Export type definitions
export type CartItem = z.infer<typeof CartItemSchema>;
export type CartTopping = z.infer<typeof CartToppingSchema>;
export type Customization = z.infer<typeof CustomizationSchema>;
export type CustomerInfo = z.infer<typeof CustomerInfoSchema>;
export type DeliveryInfo = z.infer<typeof DeliveryInfoSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;
export type PizzaConfig = z.infer<typeof PizzaConfigSchema>;
export type SpecialtyPizza = z.infer<typeof SpecialtyPizzaSchema>;
export type Setting = z.infer<typeof SettingSchema>;
export type UpdateSettings = z.infer<typeof UpdateSettingsSchema>;

// Validation helpers
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Invalid data format' };
  }
}

export function createApiResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
  };
}

export function createApiError(error: string, status = 400) {
  return {
    success: false,
    error,
    status,
  };
}
