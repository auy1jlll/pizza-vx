-- Step 4: Data Normalization Implementation
-- Normalizing repeated text data into lookup tables for better performance and consistency

-- 1. Create lookup table for topping intensities
CREATE TABLE IF NOT EXISTS topping_intensities (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert standard intensity values
INSERT OR IGNORE INTO topping_intensities (id, name, description, sortOrder) VALUES
('intensity_light', 'LIGHT', 'Light amount of topping', 1),
('intensity_regular', 'REGULAR', 'Regular amount of topping', 2),
('intensity_extra', 'EXTRA', 'Extra amount of topping', 3),
('intensity_double', 'DOUBLE', 'Double amount of topping', 4);

-- 2. Create lookup table for pizza sections
CREATE TABLE IF NOT EXISTS pizza_sections (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert standard section values
INSERT OR IGNORE INTO pizza_sections (id, name, description, sortOrder) VALUES
('section_whole', 'WHOLE', 'Entire pizza', 1),
('section_left', 'LEFT', 'Left half of pizza', 2),
('section_right', 'RIGHT', 'Right half of pizza', 3),
('section_top', 'TOP', 'Top half of pizza', 4),
('section_bottom', 'BOTTOM', 'Bottom half of pizza', 5);

-- 3. Create lookup table for order types
CREATE TABLE IF NOT EXISTS order_types (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN DEFAULT TRUE,
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert standard order types
INSERT OR IGNORE INTO order_types (id, name, description, sortOrder) VALUES
('type_pickup', 'PICKUP', 'Customer pickup order', 1),
('type_delivery', 'DELIVERY', 'Delivery order', 2);

-- 4. Create lookup table for order statuses
CREATE TABLE IF NOT EXISTS order_statuses (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    isActive BOOLEAN DEFAULT TRUE,
    color TEXT, -- For UI display
    sortOrder INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert standard order statuses
INSERT OR IGNORE INTO order_statuses (id, name, description, color, sortOrder) VALUES
('status_pending', 'PENDING', 'Order received, awaiting confirmation', '#FFA500', 1),
('status_confirmed', 'CONFIRMED', 'Order confirmed, ready for preparation', '#0066CC', 2),
('status_preparing', 'PREPARING', 'Order being prepared', '#FF6600', 3),
('status_ready', 'READY', 'Order ready for pickup/delivery', '#00AA00', 4),
('status_completed', 'COMPLETED', 'Order completed', '#006600', 5),
('status_cancelled', 'CANCELLED', 'Order cancelled', '#CC0000', 6);

-- 5. Create indices for lookup tables
CREATE INDEX IF NOT EXISTS idx_topping_intensities_name ON topping_intensities(name);
CREATE INDEX IF NOT EXISTS idx_topping_intensities_sort ON topping_intensities(sortOrder);

CREATE INDEX IF NOT EXISTS idx_pizza_sections_name ON pizza_sections(name);
CREATE INDEX IF NOT EXISTS idx_pizza_sections_sort ON pizza_sections(sortOrder);

CREATE INDEX IF NOT EXISTS idx_order_types_name ON order_types(name);
CREATE INDEX IF NOT EXISTS idx_order_types_active ON order_types(isActive);

CREATE INDEX IF NOT EXISTS idx_order_statuses_name ON order_statuses(name);
CREATE INDEX IF NOT EXISTS idx_order_statuses_active ON order_statuses(isActive);

-- 6. Create normalized component names table for consistent naming
CREATE TABLE IF NOT EXISTS component_names (
    id TEXT PRIMARY KEY,
    componentType TEXT NOT NULL, -- 'SIZE', 'CRUST', 'SAUCE', 'TOPPING'
    displayName TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Populate with existing component names (this will help standardize naming)
INSERT OR IGNORE INTO component_names (id, componentType, displayName, slug)
SELECT 
    'name_size_' || LOWER(REPLACE(name, ' ', '_')),
    'SIZE',
    name,
    LOWER(REPLACE(name, ' ', '_'))
FROM pizza_sizes;

INSERT OR IGNORE INTO component_names (id, componentType, displayName, slug)
SELECT 
    'name_crust_' || LOWER(REPLACE(name, ' ', '_')),
    'CRUST', 
    name,
    LOWER(REPLACE(name, ' ', '_'))
FROM pizza_crusts;

INSERT OR IGNORE INTO component_names (id, componentType, displayName, slug)
SELECT 
    'name_sauce_' || LOWER(REPLACE(name, ' ', '_')),
    'SAUCE',
    name, 
    LOWER(REPLACE(name, ' ', '_'))
FROM pizza_sauces;

INSERT OR IGNORE INTO component_names (id, componentType, displayName, slug)
SELECT 
    'name_topping_' || LOWER(REPLACE(name, ' ', '_')),
    'TOPPING',
    name,
    LOWER(REPLACE(name, ' ', '_'))
FROM pizza_toppings;

-- Create indices for component names
CREATE INDEX IF NOT EXISTS idx_component_names_type ON component_names(componentType);
CREATE INDEX IF NOT EXISTS idx_component_names_slug ON component_names(slug);
CREATE INDEX IF NOT EXISTS idx_component_names_active ON component_names(isActive);
