Restaurant Ordering WebApp – PRD
1. Overview

The restaurant ordering app should allow customers to browse menu categories (Pizza, Sandwiches, Dinner Plates, Drinks, etc.), customize their order with toppings, sides, and condiments, and place an order for delivery or pickup.

2. Goals

Enable category-based browsing (Pizza, Sandwich, Plates, Drinks, etc.)

Support conditional add-ons (e.g., sandwich → toppings + condiments; dinner plate → side selection)

Ensure database schema supports flexible item relationships (categories → items → modifiers)

Provide an easy-to-use UI for customers to add customizations without confusion

Ensure integration with ordering API and potential delivery module later

3. Functional Requirements
3.1 Categories

Categories include:

Pizza

Sandwiches

Dinner Plates (with sides)

Drinks

Desserts

Toppings (global category)

Sides (global category)

Condiments (global category)

3.2 Items

Each item belongs to a category

Each item has:

name

description

base_price

available_toppings (optional, if category = Pizza/Sandwich)

available_sides (optional, if category = Dinner Plate)

available_condiments (optional, if category allows condiments)

3.3 Customizations

Pizza → toppings selection (multiple)

Sandwich → toppings + condiments (lettuce, tomato, extra turkey, mustard, etc.)

Dinner Plate → choice of two sides (mashed potatoes, rice, salad, etc.)

Drinks → size upgrade (Small/Medium/Large)

3.4 Ordering Flow

User browses menu by category

User selects item

If item has customizations → show relevant toppings/sides/condiments UI

User adds to cart

User checks out with selected items + options

4. Non-Functional Requirements

Scalable DB schema for adding new categories/toppings later

Mobile-friendly responsive UI

API-first approach (frontend calls backend APIs for menu + order management)

Secure payments integration (Stripe/PayPal)

5. Database Schema (MySQL)
Tables:

categories (id, name, parent_category_id)

items (id, category_id, name, description, base_price)

modifiers (id, type [topping/side/condiment], name, price)

item_modifiers (id, item_id, modifier_id, is_default, max_selectable)

orders (id, user_id, status, total_price, created_at)

order_items (id, order_id, item_id, quantity, customizations JSON)

6. Tasks & Copilot/Claude Prompts
Task 1 – Update DB Schema

Prompt:
“Generate SQL migrations for MySQL to support a restaurant ordering system with categories, items, modifiers (toppings, sides, condiments), and relationships between them. Ensure that each item can optionally have modifiers, and allow different max selections (like max 2 sides).”

Task 2 – Backend API (Django/FastAPI/Node)

Prompt:
“Create REST API endpoints for:

GET /categories → returns menu categories

GET /items?category_id=x → returns items for category

GET /items/{id} → returns item details + available modifiers

POST /cart/add → adds item with selected modifiers

POST /order → creates order with items, modifiers, and total price.”

Task 3 – Frontend Item Customization UI

Prompt:
“Implement a dynamic React component for an item details page that:

Fetches item data from API

Displays toppings/sides/condiments based on category

Allows multiple selection for toppings, limited selection for sides (e.g., max 2)

Shows live price update as user adds modifiers.”

Task 4 – Sandwich Example

Prompt:
“Generate sample JSON API response for a Sandwich item that includes available toppings (lettuce, tomato, extra turkey), condiments (mayo, mustard, ketchup), and prices for each.”

Task 5 – Dinner Plate Example

Prompt:
“Generate sample JSON API response for a Dinner Plate item with base price, description, and available sides (mashed potatoes, rice, salad, fries). Restrict selection to max 2 sides.”

Task 6 – Cart & Checkout

Prompt:
“Implement a React Cart page that:

Displays items with selected toppings/sides/condiments

Calculates total dynamically

Allows removal of items or updating quantity

Connects to POST /order API endpoint.”

👉 Would you like me to write the actual SQL schema + JSON API response examples for Sandwich and Dinner Plate so you can hand them directly to Copilot, or just keep it at the PRD + prompts level?

You said:
can we add begin task and an end task and do a test before we move on to the next , like taskks to th epd and prompts
ChatGPT said:

Perfect 👌 — you’re thinking about making the PRD task list more actionable, almost like a step-by-step execution plan.
We can structure it like this for each task:

Begin Task → What we’re starting, goal of the task

Prompt → What to tell Copilot/Claude to generate

Test → How to verify it works

End Task → Completion criteria before moving on

I’ll rewrite the PRD tasks into this structured format for you:

🍕 Restaurant Ordering WebApp – PRD with Task Flow
Task 1 – Database Schema Setup

Begin Task:
Set up MySQL schema with support for categories, items, modifiers (toppings, sides, condiments), and relationships.

Prompt for Copilot/Claude:
“Generate SQL migrations for MySQL to support a restaurant ordering system with categories, items, modifiers (toppings, sides, condiments), and relationships between them. Each item should optionally have modifiers with max_selectable rules.”

Test:

Run migration and check that tables exist: categories, items, modifiers, item_modifiers, orders, order_items.

Insert test data (e.g., Sandwich → lettuce/tomato/turkey).

Verify querying with JOIN returns expected modifiers for a given item.

End Task:
Schema confirmed, test data inserted, relationships verified.

Task 2 – Backend API Endpoints

Begin Task:
Build REST API endpoints for categories, items, and order flow.

Prompt for Copilot/Claude:
“Create REST API endpoints for:

GET /categories → returns menu categories

GET /items?category_id=x → returns items for category

GET /items/{id} → returns item details + available modifiers

POST /cart/add → adds item with selected modifiers

POST /order → creates order with items, modifiers, and total price.”

Test:

Call GET /categories → returns list (Pizza, Sandwich, Dinner Plates…).

Call GET /items?category_id=sandwich → returns sandwiches.

Call GET /items/{id} → returns item + modifiers.

Post to /cart/add → confirm cart stores modifiers.

End Task:
All endpoints return correct responses with test data.

Task 3 – Frontend Item Customization UI

Begin Task:
Create dynamic item detail page (React) that shows modifiers depending on category.

Prompt for Copilot/Claude:
“Implement a React component for ItemDetail that:

Fetches item + modifiers from API

Displays toppings/sides/condiments dynamically

Allows multiple toppings, restricts sides (max 2)

Updates total price dynamically.”

Test:

Open Sandwich item → see toppings + condiments checkboxes.

Open Dinner Plate → see sides selection, can only pick 2.

Adding modifiers updates displayed price correctly.

End Task:
UI works for both Sandwich and Dinner Plate examples.

Task 4 – Example Data: Sandwich

Begin Task:
Provide sample JSON API response for Sandwich.

Prompt:
“Generate JSON for Sandwich item with:

Base price: 6.99

Available toppings: lettuce (0.25), tomato (0.25), extra turkey (1.50)

Available condiments: mayo, mustard, ketchup (free).”

Test:

Fetch Sandwich item → modifiers appear as expected in UI.

Selecting extra turkey updates total.

End Task:
Sandwich item fully working with modifiers in frontend.

Task 5 – Example Data: Dinner Plate

Begin Task:
Provide sample JSON API response for Dinner Plate with sides.

Prompt:
“Generate JSON for Dinner Plate item with:

Base price: 12.99

Available sides: mashed potatoes, rice, salad, fries

Restrict selection to max 2 sides.”

Test:

Dinner Plate shows side options in frontend.

Selecting >2 sides triggers validation.

End Task:
Dinner Plate item works correctly in frontend.

Task 6 – Cart & Checkout

Begin Task:
Create cart + checkout flow in React.

Prompt:
“Implement a React Cart page that:

Displays items with toppings/sides/condiments

Calculates total dynamically

Allows item removal or quantity update

Connects to POST /order endpoint.”

Test:

Add Sandwich + Dinner Plate → see correct modifiers in cart.

Change quantity → total updates.

Place order → API receives full order with customizations.

End Task:
Cart + Checkout flow complete.