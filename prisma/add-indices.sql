-- Step 2: Database Indices for Performance Optimization
-- Adding strategic indices to improve query performance

-- 1. Orders table indices
-- Frequently queried by status (kitchen display, order management)
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Frequently queried by creation date (order history, reporting)  
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(createdAt);

-- Customer order lookup by user
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(userId);

-- Order number lookup (unique orders)
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(orderNumber);

-- Composite index for order status and date (kitchen display with date sorting)
CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(status, createdAt);

-- 2. Order Items table indices  
-- Foreign key lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(orderId);
CREATE INDEX IF NOT EXISTS idx_order_items_size_id ON order_items(pizzaSizeId);
CREATE INDEX IF NOT EXISTS idx_order_items_crust_id ON order_items(pizzaCrustId);
CREATE INDEX IF NOT EXISTS idx_order_items_sauce_id ON order_items(pizzaSauceId);

-- 3. Order Item Toppings table indices
-- Foreign key lookups for toppings
CREATE INDEX IF NOT EXISTS idx_order_item_toppings_order_item_id ON order_item_toppings(orderItemId);
CREATE INDEX IF NOT EXISTS idx_order_item_toppings_topping_id ON order_item_toppings(pizzaToppingId);

-- 4. Users table indices
-- Login lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 5. Pizza Components indices (for admin dashboard performance)
-- Active component filtering
CREATE INDEX IF NOT EXISTS idx_pizza_sizes_active ON pizza_sizes(isActive);
CREATE INDEX IF NOT EXISTS idx_pizza_crusts_active ON pizza_crusts(isActive);  
CREATE INDEX IF NOT EXISTS idx_pizza_sauces_active ON pizza_sauces(isActive);
CREATE INDEX IF NOT EXISTS idx_pizza_toppings_active ON pizza_toppings(isActive);

-- Sort order indices for admin interfaces
CREATE INDEX IF NOT EXISTS idx_pizza_sizes_sort ON pizza_sizes(sortOrder);
CREATE INDEX IF NOT EXISTS idx_pizza_crusts_sort ON pizza_crusts(sortOrder);
CREATE INDEX IF NOT EXISTS idx_pizza_sauces_sort ON pizza_sauces(sortOrder);
CREATE INDEX IF NOT EXISTS idx_pizza_toppings_sort ON pizza_toppings(sortOrder);

-- Category filtering for toppings
CREATE INDEX IF NOT EXISTS idx_pizza_toppings_category ON pizza_toppings(category);

-- 6. App Settings indices
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);

-- 7. Specialty Pizzas indices
CREATE INDEX IF NOT EXISTS idx_specialty_pizzas_active ON specialty_pizzas(isActive);
