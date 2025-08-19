-- SQL SOLUTION FOR CUSTOMIZATION CATEGORY FIX
-- Run this in your database if the Node.js scripts don't work

-- First, create the required MenuCategories if they don't exist
INSERT INTO "MenuCategory" ("name", "slug", "description", "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES 
  ('Sandwiches', 'sandwiches', 'Sub sandwiches and wraps', true, 1, NOW(), NOW()),
  ('Salads', 'salads', 'Fresh salads and bowls', true, 2, NOW(), NOW()),
  ('Seafood', 'seafood', 'Fresh seafood entrees', true, 3, NOW(), NOW()),
  ('Dinner Plates', 'dinner-plates', 'Main course entrees', true, 4, NOW(), NOW()),
  ('Pizza', 'pizza', 'Pizza options', true, 5, NOW(), NOW()),
  ('Appetizers', 'appetizers', 'Starters and appetizers', true, 6, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET 
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "isActive" = true,
  "updatedAt" = NOW();

-- Get the category IDs for reference
SELECT id, name, slug FROM "MenuCategory" WHERE slug IN ('sandwiches', 'salads', 'seafood', 'dinner-plates', 'pizza', 'appetizers');

-- Update CustomizationGroups based on name patterns
-- Sandwiches category
UPDATE "CustomizationGroup" 
SET "categoryId" = (SELECT id FROM "MenuCategory" WHERE slug = 'sandwiches')
WHERE LOWER("name") LIKE '%bread%' 
   OR LOWER("name") LIKE '%sub%' 
   OR LOWER("name") LIKE '%sandwich%'
   OR LOWER("name") LIKE '%roll%'
   OR LOWER("name") LIKE '%wrap%'
   OR LOWER("name") LIKE '%condiment%'
   OR LOWER("name") LIKE '%mayo%'
   OR LOWER("name") LIKE '%mustard%'
   OR "name" ILIKE 'Bread Choice'
   OR "name" ILIKE 'Bread Type'
   OR "name" ILIKE 'Sub Size'
   OR "name" ILIKE 'Sandwich Size'
   OR "name" ILIKE 'Condiments'
   OR "name" ILIKE 'Add-ons';

-- Salads category  
UPDATE "CustomizationGroup"
SET "categoryId" = (SELECT id FROM "MenuCategory" WHERE slug = 'salads')
WHERE LOWER("name") LIKE '%salad%'
   OR LOWER("name") LIKE '%dressing%'
   OR LOWER("name") LIKE '%lettuce%'
   OR LOWER("name") LIKE '%greens%'
   OR LOWER("name") LIKE '%vinaigrette%'
   OR "name" ILIKE 'Dressing Type'
   OR "name" ILIKE 'Dressing Choice'
   OR "name" ILIKE 'Salad Size'
   OR "name" ILIKE 'Salad Toppings'
   OR "name" ILIKE 'Protein Choice';

-- Seafood category
UPDATE "CustomizationGroup"
SET "categoryId" = (SELECT id FROM "MenuCategory" WHERE slug = 'seafood') 
WHERE LOWER("name") LIKE '%fish%'
   OR LOWER("name") LIKE '%seafood%'
   OR LOWER("name") LIKE '%salmon%'
   OR LOWER("name") LIKE '%shrimp%'
   OR LOWER("name") LIKE '%crab%'
   OR LOWER("name") LIKE '%lobster%'
   OR LOWER("name") LIKE '%cooking%'
   OR LOWER("name") LIKE '%grilled%'
   OR LOWER("name") LIKE '%fried%'
   OR "name" ILIKE 'Cooking Style'
   OR "name" ILIKE 'Preparation Style'
   OR "name" ILIKE 'Seafood Size';

-- Dinner Plates category
UPDATE "CustomizationGroup"
SET "categoryId" = (SELECT id FROM "MenuCategory" WHERE slug = 'dinner-plates')
WHERE LOWER("name") LIKE '%side%'
   OR LOWER("name") LIKE '%potato%'
   OR LOWER("name") LIKE '%rice%'
   OR LOWER("name") LIKE '%vegetable%'
   OR LOWER("name") LIKE '%sauce level%'
   OR LOWER("name") LIKE '%temperature%'
   OR LOWER("name") LIKE '%dinner%'
   OR "name" ILIKE 'Side Choice'
   OR "name" ILIKE 'Sides'
   OR "name" ILIKE 'Sauce Level'
   OR "name" ILIKE 'Cooking Temperature'
   OR "name" ILIKE 'Starch Choice';

-- Pizza category
UPDATE "CustomizationGroup"
SET "categoryId" = (SELECT id FROM "MenuCategory" WHERE slug = 'pizza')
WHERE LOWER("name") LIKE '%pizza%'
   OR LOWER("name") LIKE '%crust%'
   OR LOWER("name") LIKE '%sauce type%'
   OR LOWER("name") LIKE '%cheese%'
   OR "name" ILIKE 'Pizza Size'
   OR "name" ILIKE 'Crust Type'
   OR "name" ILIKE 'Sauce Type'
   OR "name" ILIKE 'Pizza Toppings';

-- Appetizers category
UPDATE "CustomizationGroup"
SET "categoryId" = (SELECT id FROM "MenuCategory" WHERE slug = 'appetizers')
WHERE LOWER("name") LIKE '%appetizer%'
   OR LOWER("name") LIKE '%starter%'
   OR LOWER("name") LIKE '%wing%'
   OR LOWER("name") LIKE '%stick%'
   OR LOWER("name") LIKE '%dip%'
   OR "name" ILIKE 'Wing Size'
   OR "name" ILIKE 'Sauce Choice'
   OR "name" ILIKE 'Dip Type';

-- Verification: Check the final distribution
SELECT 
  mc.name as category_name,
  COUNT(cg.id) as group_count,
  ROUND(COUNT(cg.id) * 100.0 / (SELECT COUNT(*) FROM "CustomizationGroup"), 1) as percentage
FROM "MenuCategory" mc
LEFT JOIN "CustomizationGroup" cg ON mc.id = cg."categoryId"
GROUP BY mc.id, mc.name
UNION ALL
SELECT 
  'GLOBAL (NULL)' as category_name,
  COUNT(*) as group_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "CustomizationGroup"), 1) as percentage
FROM "CustomizationGroup" 
WHERE "categoryId" IS NULL
ORDER BY group_count DESC;

-- Check if any groups are still under "menucategory"
SELECT COUNT(*) as menucategory_count
FROM "CustomizationGroup" cg
JOIN "MenuCategory" mc ON cg."categoryId" = mc.id
WHERE mc.name = 'menucategory';

-- List all CustomizationGroups with their new categories
SELECT 
  cg.name as group_name,
  COALESCE(mc.name, 'GLOBAL') as category_name,
  cg."categoryId"
FROM "CustomizationGroup" cg
LEFT JOIN "MenuCategory" mc ON cg."categoryId" = mc.id
ORDER BY mc.name, cg.name;
