-- Add missing menu categories to fix menu display issue
-- Generated on 2025-09-13T07:59:38.362Z

INSERT INTO menu_categories (id, name, slug, description, "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES ('cat_pizza_1757750378362', 'Pizza', 'pizza', 'Build your own pizza with fresh ingredients and premium toppings', true, 1, NOW(), NOW());
INSERT INTO menu_categories (id, name, slug, description, "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES ('cat_specialty_pizzas_1757750378362', 'Specialty Pizzas', 'specialty-pizzas', 'Our signature gourmet pizzas with unique flavor combinations', true, 2, NOW(), NOW());
INSERT INTO menu_categories (id, name, slug, description, "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES ('cat_calzones_1757750378362', 'Calzones', 'calzones', 'Build your own calzone with fresh ingredients baked in our stone oven', true, 3, NOW(), NOW());
INSERT INTO menu_categories (id, name, slug, description, "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES ('cat_pasta_1757750378362', 'Pasta', 'pasta', 'Traditional Italian pasta dishes with authentic sauces', true, 10, NOW(), NOW());
INSERT INTO menu_categories (id, name, slug, description, "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES ('cat_beverages_1757750378362', 'Beverages', 'beverages', 'Refreshing drinks, sodas, and specialty beverages', true, 20, NOW(), NOW());
INSERT INTO menu_categories (id, name, slug, description, "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES ('cat_desserts_1757750378362', 'Desserts', 'desserts', 'Sweet treats and traditional Italian desserts', true, 21, NOW(), NOW());

-- Update existing categories sort order to make room
UPDATE menu_categories SET "sortOrder" = "sortOrder" + 10 WHERE "sortOrder" >= 10;

-- Verify categories were added
SELECT id, name, slug, "sortOrder" FROM menu_categories ORDER BY "sortOrder";
