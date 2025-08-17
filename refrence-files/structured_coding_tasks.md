# Structured Coding Tasks for Copilot Agent

## Task 1: Create Menu Categories Database Table

**BEGIN TASK**
Create a new database migration and model for menu categories.

**Specific Requirements:**
- Create migration file: `create_menu_categories_table.php`
- Table name: `menu_categories`
- Required columns:
  - `id` (primary key, auto-increment)
  - `name` (varchar 100, not null) - e.g., "Pizza", "Sandwiches", "Salads"
  - `slug` (varchar 100, unique, not null) - e.g., "pizza", "sandwiches", "salads"
  - `description` (text, nullable)
  - `sort_order` (integer, default 0)
  - `is_active` (boolean, default true)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - `deleted_at` (timestamp, nullable) - for soft deletes

**Expected Output:**
1. Migration file with proper up() and down() methods
2. MenuCategory model class with fillable fields and casts
3. Add soft deletes trait to model

**END TASK**

---

## Task 2: Create Menu Items Database Table

**BEGIN TASK**
Create a new database migration and model for menu items that can belong to any category.

**Specific Requirements:**
- Create migration file: `create_menu_items_table.php`
- Table name: `menu_items`
- Required columns:
  - `id` (primary key, auto-increment)
  - `category_id` (foreign key to menu_categories.id)
  - `name` (varchar 255, not null)
  - `description` (text, nullable)
  - `base_price` (decimal 8,2, not null)
  - `image_path` (varchar 500, nullable)
  - `is_available` (boolean, default true)
  - `sort_order` (integer, default 0)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - `deleted_at` (timestamp, nullable)

**Expected Output:**
1. Migration file with foreign key constraint
2. MenuItem model class with relationship to MenuCategory
3. Add soft deletes and proper model relationships

**END TASK**

---

## Task 3: Create Customization Groups Database Table

**BEGIN TASK**
Create database table to store customization groups (like "Size", "Toppings", "Condiments").

**Specific Requirements:**
- Create migration file: `create_customization_groups_table.php`
- Table name: `customization_groups`
- Required columns:
  - `id` (primary key, auto-increment)
  - `name` (varchar 100, not null) - e.g., "Size", "Toppings", "Condiments"
  - `type` (enum: 'single', 'multiple', 'quantity') - selection type
  - `is_required` (boolean, default false)
  - `min_selections` (integer, default 0)
  - `max_selections` (integer, nullable)
  - `sort_order` (integer, default 0)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

**Expected Output:**
1. Migration file with enum constraint for type
2. CustomizationGroup model class

**END TASK**

---

## Task 4: Create Customization Options Database Table

**BEGIN TASK**
Create database table to store individual customization options within each group.

**Specific Requirements:**
- Create migration file: `create_customization_options_table.php`
- Table name: `customization_options`
- Required columns:
  - `id` (primary key, auto-increment)
  - `customization_group_id` (foreign key)
  - `name` (varchar 100, not null) - e.g., "Large", "Pepperoni", "Mayo"
  - `price_modifier` (decimal 5,2, default 0.00) - additional cost
  - `is_default` (boolean, default false)
  - `is_available` (boolean, default true)
  - `sort_order` (integer, default 0)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

**Expected Output:**
1. Migration file with foreign key constraint
2. CustomizationOption model class with relationship to CustomizationGroup

**END TASK**

---

## Task 5: Create Menu Item Customization Pivot Table

**BEGIN TASK**
Create pivot table to link menu items with their available customization groups.

**Specific Requirements:**
- Create migration file: `create_menu_item_customization_groups_table.php`
- Table name: `menu_item_customization_groups`
- Required columns:
  - `id` (primary key, auto-increment)
  - `menu_item_id` (foreign key to menu_items.id)
  - `customization_group_id` (foreign key to customization_groups.id)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

**Expected Output:**
1. Migration file with composite unique index on menu_item_id and customization_group_id
2. Add many-to-many relationship methods to MenuItem and CustomizationGroup models

**END TASK**

---

## Task 6: Seed Database with Initial Categories

**BEGIN TASK**
Create database seeder to populate initial menu categories.

**Specific Requirements:**
- Create seeder file: `MenuCategoriesSeeder.php`
- Insert these categories:
  1. Pizza (slug: pizza, sort_order: 1)
  2. Sandwiches (slug: sandwiches, sort_order: 2)
  3. Salads (slug: salads, sort_order: 3)
  4. Seafood (slug: seafood, sort_order: 4)
  5. Dinner Plates (slug: dinner-plates, sort_order: 5)

**Expected Output:**
1. Seeder class that inserts 5 categories
2. Update DatabaseSeeder.php to call this seeder
3. Make seeder safe to run multiple times (check if exists before inserting)

**END TASK**

---

## Task 7: Create Migration to Convert Existing Pizza Data

**BEGIN TASK**
Create migration to move existing pizza data into new table structure.

**Specific Requirements:**
- Create migration file: `migrate_existing_pizzas_to_new_structure.php`
- Assume existing table is called `pizzas` with columns: id, name, description, price
- Move all existing pizzas to menu_items table
- Set category_id to the "Pizza" category ID
- Map existing price to base_price
- Preserve original IDs if possible

**Expected Output:**
1. Migration that safely transfers existing data
2. Include rollback method to undo the transfer
3. Add data validation to ensure no data loss

**END TASK**

---

## Task 8: Update Menu Category Dashboard Card

**BEGIN TASK**
Now that database tables exist, update the menu category dashboard card to show real data.

**Specific Requirements:**
- File to modify: (specify your dashboard component file)
- Replace any hardcoded category data with database queries
- Display actual count of menu items per category
- Add links to manage each category
- Show active/inactive status

**Expected Output:**
1. Dashboard card showing real category data from database
2. Categories should display item counts
3. Add "Add New Category" button functionality

**END TASK**