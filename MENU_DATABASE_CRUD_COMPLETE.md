# Menu System Database Tables & CRUD Pages

## 📊 **Database Tables Overview**

### 1. **menu_categories** Table
```sql
- id: String (Primary Key)
- name: String (Unique) - "Sandwiches", "Salads", "Seafood", "Dinner Plates"  
- slug: String (Unique) - "sandwiches", "salads", "seafood", "dinner-plates"
- description: String (Optional)
- imageUrl: String (Optional)
- isActive: Boolean (Default: true)
- sortOrder: Integer (Default: 0)
- createdAt: DateTime
- updatedAt: DateTime
```
**Current Data:** 4 categories populated

### 2. **menu_items** Table  
```sql
- id: String (Primary Key)
- categoryId: String (Foreign Key → menu_categories.id)
- name: String - Item names like "Italian Sub", "Caesar Salad"
- description: String (Optional)
- basePrice: Float - Base pricing before customizations
- imageUrl: String (Optional)
- isActive: Boolean (Default: true)
- isAvailable: Boolean (Default: true)
- sortOrder: Integer (Default: 0)
- preparationTime: Integer (Optional, in minutes)
- allergens: String (Optional, JSON array)
- nutritionInfo: String (Optional, JSON object)
- createdAt: DateTime
- updatedAt: DateTime
```
**Current Data:** 18 menu items across all categories

### 3. **customization_groups** Table
```sql
- id: String (Primary Key)
- categoryId: String (Optional, Foreign Key → menu_categories.id)
- name: String - "Size", "Bread", "Condiments", "Toppings", "Sides"
- description: String (Optional)
- type: Enum - SINGLE_SELECT | MULTI_SELECT | QUANTITY_SELECT | SPECIAL_LOGIC
- isRequired: Boolean (Default: false)
- minSelections: Integer (Default: 0)
- maxSelections: Integer (Optional, null = unlimited)
- sortOrder: Integer (Default: 0)
- isActive: Boolean (Default: true)
- createdAt: DateTime
- updatedAt: DateTime
```
**Current Data:** 14 customization groups
- **Global Groups:** Size (for all categories)
- **Sandwich Groups:** Size, Bread, Cheese, Vegetables, Condiments, Extras
- **Salad Groups:** Protein, Dressing, Extra Toppings
- **Seafood Groups:** Preparation, Seasoning, Side Dish
- **Dinner Plate Groups:** Sides (with SPECIAL_LOGIC for "2 of 3" selection)

### 4. **customization_options** Table
```sql
- id: String (Primary Key)
- groupId: String (Foreign Key → customization_groups.id)
- name: String - "Large", "Cheddar", "Mayo", "Grilled"
- description: String (Optional)
- priceModifier: Float (Default: 0, can be positive/negative)
- priceType: Enum - FLAT | PERCENTAGE | PER_UNIT
- isDefault: Boolean (Default: false)
- isActive: Boolean (Default: true)
- sortOrder: Integer (Default: 0)
- maxQuantity: Integer (Optional, for quantity-based options)
- nutritionInfo: String (Optional, JSON object)
- allergens: String (Optional, JSON array)
- createdAt: DateTime
- updatedAt: DateTime
```
**Current Data:** 61 customization options across all groups

### 5. **menu_item_customizations** Table (Pivot)
```sql
- id: String (Primary Key)
- menuItemId: String (Foreign Key → menu_items.id)
- customizationGroupId: String (Foreign Key → customization_groups.id)
- isRequired: Boolean (Default: false)
- sortOrder: Integer (Default: 0)
- createdAt: DateTime
```
**Purpose:** Links menu items to their available customization groups

## 🔧 **CRUD Admin Pages Created**

### ✅ **Main Menu Manager Dashboard**
**Location:** `/admin/menu-manager`
**Features:**
- Overview of all categories with stats
- Quick access to management sections
- Real-time counts of categories, items, groups, options
- Visual category cards with icons and gradients

### ✅ **Categories Management**
**Location:** `/admin/menu-manager/categories`
**Features:**
- View all menu categories in grid layout
- Search by name or slug
- Filter by status (active/inactive)
- Sort by name, sort order, or creation date
- Toggle category active status
- Delete categories (with confirmation)
- Quick stats showing item and customization counts
- Links to view/edit individual categories

**Data Shown for Each Category:**
- Category name and slug
- Description and status
- Number of menu items
- Number of customization groups
- Sort order and creation date
- Visual category icons (🥪🥗🦞🍽️)

### ✅ **Customizations Management**
**Location:** `/admin/menu-manager/customizations`
**Features:**
- **Two-tab interface:**
  - **Groups Tab:** Manage customization groups
  - **Options Tab:** Manage individual options
- Search functionality for both groups and options
- Filter groups by type and category
- Visual type indicators (⚪☑️🔢⚙️)
- Show usage statistics (how many items use each group)
- Price modifier display for options
- Default option indicators

**Groups Data Shown:**
- Group name and type (Single/Multi/Quantity/Special)
- Category assignment (Global or specific category)
- Required/optional status
- Min/max selection constraints
- Number of options in group
- Number of menu items using the group

**Options Data Shown:**
- Option name and description
- Parent group assignment
- Price modifier (flat rate, percentage, or per-unit)
- Default option status
- Active/inactive status

## 🎯 **System Capabilities**

### **For Administrators:**
1. **Category Management:**
   - Create, edit, delete menu categories
   - Control category ordering and visibility
   - Monitor item counts per category

2. **Item Management:**
   - Add menu items to categories
   - Set base pricing and descriptions
   - Control availability and preparation times

3. **Customization System:**
   - Create flexible customization groups
   - Define selection rules (single, multi, quantity, special logic)
   - Set price modifiers for options
   - Assign customizations to specific categories or globally

4. **Analytics & Monitoring:**
   - Real-time statistics dashboard
   - Usage tracking for customization groups
   - Item performance monitoring

### **For Customers:**
1. **Menu Browsing:**
   - Category-based navigation
   - Visual customization interfaces
   - Real-time price calculations
   - Special logic handling (like "2 of 3" dinner sides)

2. **Ordering System:**
   - Add customized items to cart
   - Mix different menu categories in one order
   - Validate customization requirements

## 🔗 **API Endpoints Available**

### **Categories:**
- `GET /api/admin/menu/categories` - List all categories with counts
- `GET /api/admin/menu/categories/[id]` - Get specific category
- `PUT /api/admin/menu/categories/[id]` - Update category
- `DELETE /api/admin/menu/categories/[id]` - Delete category

### **Items:**
- `GET /api/admin/menu/items` - List all items
- `GET /api/admin/menu/items/[id]` - Get specific item
- `PUT /api/admin/menu/items/[id]` - Update item
- `DELETE /api/admin/menu/items/[id]` - Delete item

### **Customizations:**
- `GET /api/admin/menu/customization-groups` - List all groups
- `GET /api/admin/menu/customization-options` - List all options
- `GET /api/admin/menu/stats` - Get system statistics

### **Public APIs:**
- `GET /api/menu/categories` - Public category listing
- `GET /api/menu/[category]` - Category with items and customizations
- `POST /api/menu/validate` - Validate customization selections
- `POST /api/menu/format-cart` - Format items for cart

## 📋 **Current System Status**

**✅ Database Structure:** Complete with all tables and relationships
**✅ Data Population:** 4 categories, 18 items, 14 groups, 61 options
**✅ Admin Interface:** Main dashboard and category/customization management
**✅ Public Interface:** Customer menu browsing and customization
**✅ API Layer:** Full REST API for all operations
**✅ Cart Integration:** Menu items work with existing cart system
**✅ Order Processing:** Mixed pizza/menu orders supported

The menu system is now fully operational with comprehensive CRUD capabilities for managing all aspects of the menu categories, items, and customization options.
