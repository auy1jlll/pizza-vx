-- DATABASE USAGE EXAMPLES
-- How to handle different menu items in the unified structure

-- ============================================================================
-- EXAMPLE 1: MIXED ORDER (Pizza + Sub + Wings)
-- ============================================================================

-- Step 1: Create the order
INSERT INTO orders (customer_name, customer_phone, order_total, order_type) 
VALUES ('John Doe', '555-1234', 45.97, 'delivery');
-- Let's say this creates order_id = 100

-- Step 2: Add Large Pepperoni Pizza (half pepperoni, half mushroom)
INSERT INTO order_items (order_id, menu_item_id, size_id, quantity, unit_price, total_price, is_half_half)
VALUES (100, 1, 2, 1, 18.99, 18.99, TRUE); -- order_item_id = 200

-- Add pizza customizations
INSERT INTO order_item_customizations (order_item_id, customization_option_id, pizza_half, quantity) VALUES
(200, 1, 'left', 1),   -- Pepperoni on left half
(200, 2, 'right', 1);  -- Mushroom on right half

-- Step 3: Add Italian Sub with mayo and extra salami
INSERT INTO order_items (order_id, menu_item_id, size_id, quantity, unit_price, total_price)
VALUES (100, 5, 8, 1, 12.49, 12.49); -- order_item_id = 201

-- Add sub customizations
INSERT INTO order_item_customizations (order_item_id, customization_option_id, quantity) VALUES
(201, 15, 1),  -- Mayo
(201, 16, 1),  -- Extra Salami (+$2.50)
(201, 17, 1);  -- Lettuce

-- Step 4: Add 10 Buffalo Wings with BBQ sauce
INSERT INTO order_items (order_id, menu_item_id, size_id, quantity, unit_price, total_price)
VALUES (100, 8, 12, 1, 14.49, 14.49); -- order_item_id = 202

-- Add wing sauce
INSERT INTO order_item_customizations (order_item_id, customization_option_id) VALUES
(202, 25); -- BBQ Sauce

-- ============================================================================
-- EXAMPLE 2: DINNER COMBO WITH "PICK 2 SIDES" LOGIC
-- ============================================================================

-- Steak Tip Plate - customer picks 2 out of 3 available sides
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price)
VALUES (100, 10, 1, 16.99, 16.99); -- order_item_id = 203

-- Customer picks French Fries and Mashed Potatoes (2 out of 3 available)
INSERT INTO order_item_customizations (order_item_id, customization_option_id) VALUES
(203, 30), -- French Fries
(203, 31); -- Mashed Potatoes
-- Note: Rice Pilaf (option 32) not selected

-- ============================================================================
-- QUERIES TO RETRIEVE ORDER DATA
-- ============================================================================

-- Get complete order details
SELECT 
    o.id as order_id,
    o.customer_name,
    o.order_total,
    oi.id as order_item_id,
    mi.name as item_name,
    mc.display_name as category,
    so.size_name,
    oi.quantity,
    oi.total_price,
    oi.is_half_half
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN menu_items mi ON oi.menu_item_id = mi.id
JOIN menu_categories mc ON mi.category_id = mc.id
LEFT JOIN size_options so ON oi.size_id = so.id
WHERE o.id = 100;

-- Get all customizations for an order
SELECT 
    oi.id as order_item_id,
    mi.name as item_name,
    cg.group_name,
    co.option_name,
    oic.pizza_half,
    oic.quantity,
    oic.price_modifier
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.id
JOIN order_item_customizations oic ON oi.id = oic.order_item_id
JOIN customization_options co ON oic.customization_option_id = co.id
JOIN customization_groups cg ON co.group_id = cg.id
WHERE oi.order_id = 100
ORDER BY oi.id, cg.sort_order, co.sort_order;

-- ============================================================================
-- MENU DISPLAY QUERIES
-- ============================================================================

-- Get all menu items by category
SELECT 
    mc.display_name as category,
    mi.name,
    mi.description,
    mi.base_price,
    mi.has_size_options,
    mi.allows_half_half
FROM menu_categories mc
JOIN menu_items mi ON mc.id = mi.category_id
WHERE mi.active = TRUE
ORDER BY mc.sort_order, mi.name;

-- Get customization options for a specific menu item (e.g., Italian Sub)
SELECT 
    cg.group_name,
    cg.group_type,
    cg.is_required,
    cg.max_selections,
    cg.allows_half_selection,
    co.option_name,
    co.price_modifier
FROM customization_groups cg
JOIN customization_options co ON cg.id = co.group_id
WHERE cg.menu_item_id = 5  -- Italian Sub
  AND cg.active = TRUE 
  AND co.active = TRUE
ORDER BY cg.sort_order, co.sort_order;

-- ============================================================================
-- BUSINESS LOGIC EXAMPLES IN CODE
-- ============================================================================

-- PHP Example: Validating dinner combo sides (pick 2 of 3)
/*
function validateDinnerComboSides($menuItemId, $selectedSides) {
    $query = "SELECT max_selections FROM customization_groups 
              WHERE menu_item_id = ? AND group_type = 'sides'";
    $maxAllowed = fetchValue($query, [$menuItemId]);
    
    if (count($selectedSides) != $maxAllowed) {
        throw new Exception("Must select exactly {$maxAllowed} sides");
    }
    return true;
}
*/

-- JavaScript Example: Calculating pizza half-half pricing
/*
function calculatePizzaPrice(basePrice, selectedToppings, sizeModifier) {
    let totalPrice = basePrice + sizeModifier;
    
    selectedToppings.forEach(topping => {
        if (topping.pizza_half === 'whole') {
            totalPrice += topping.price_modifier;
        } else {
            // Half toppings cost half price
            totalPrice += (topping.price_modifier / 2);
        }
    });
    
    return totalPrice;
}
*/

-- ============================================================================
-- MIGRATION FROM EXISTING PIZZA-ONLY STRUCTURE
-- ============================================================================

-- If you have existing pizza data, migrate it like this:
/*
-- Step 1: Insert pizza category
INSERT INTO menu_categories (name, display_name, sort_order) 
VALUES ('pizza', 'Pizza', 1);

-- Step 2: Migrate existing pizzas
INSERT INTO menu_items (category_id, name, description, base_price, allows_half_half, has_size_options)
SELECT 1, name, description, price, TRUE, TRUE 
FROM your_existing_pizza_table;

-- Step 3: Migrate existing orders
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, is_half_half)
SELECT order_id, new_menu_item_id, quantity, price, price * quantity, 
       CASE WHEN has_half_toppings THEN TRUE ELSE FALSE END
FROM your_existing_pizza_orders;
*/