# Generic Customization Engine Documentation

## Overview

The Generic Customization Engine is a flexible system that handles menu item customizations across multiple restaurant categories (Sandwiches, Salads, Seafood, Dinner Plates) while maintaining complete separation from the existing pizza system.

## Key Features

### ✅ Multi-Category Support
- **Sandwiches**: Bread type, condiments, toppings
- **Salads**: Size, proteins, dressings  
- **Seafood**: Basic items (extensible)
- **Dinner Plates**: Special "2 of 3" sides selection logic

### ✅ Flexible Pricing System
- **FLAT**: Fixed amount (+$2.00)
- **PERCENTAGE**: Percentage of base price (10% = +$1.00 on $10 item)
- **PER_UNIT**: Price per quantity ($1.50 × 2 = $3.00)

### ✅ Validation Engine
- Required vs optional customizations
- Minimum/maximum selection limits
- Special business logic (dinner plate sides)
- Quantity limits and constraints

### ✅ API Endpoints
- `GET /api/menu/categories` - All categories
- `GET /api/menu/[category]` - Category-specific items
- `POST /api/menu/validate` - Validate selections & pricing
- `POST /api/menu/format-cart` - Format for cart display
- `POST /api/menu/dinner-plate-sides` - Special dinner logic

## Architecture

### Core Components

1. **CustomizationEngine** (`/src/lib/customization-engine.ts`)
   - Main engine class with validation and pricing logic
   - Database interaction layer
   - Business rule enforcement

2. **MenuService** (`/src/services/menu-service.ts`)
   - Service layer for menu operations
   - Singleton pattern for resource management
   - Error handling and logging

3. **API Routes** (`/src/app/api/menu/`)
   - RESTful endpoints for frontend consumption
   - Request validation with Zod schemas
   - Proper error responses

### Database Schema

```sql
-- New tables (separate from pizza system)
menu_categories          -- Sandwiches, Salads, etc.
menu_items              -- Individual menu items
customization_groups    -- Size, Condiments, etc.
customization_options   -- Individual choices
menu_item_customizations -- Links items to available customizations

-- Enhanced cart system
cart_items              -- Supports both pizza and menu items
cart_item_customizations -- New menu customizations
cart_item_pizza_toppings -- Existing pizza toppings
```

## Usage Examples

### 1. Sandwich Customization

```typescript
const sandwichSelection = {
  menuItemId: "sandwich-italian-sub",
  customizations: [
    { customizationOptionId: "size-medium" },      // +$2.00
    { customizationOptionId: "bread-italian" },    // +$0.50
    { customizationOptionId: "condiment-mayo" },   // +$0.00
    { customizationOptionId: "sandwich-topping-extra-cheese" } // +$1.50
  ]
};

// Validate and price
const result = await engine.validateSelections(sandwichSelection);
// Returns: isValid: true, errors: [], pricing: $12.99 total
```

### 2. Dinner Plate "2 of 3" Logic

```typescript
const dinnerSelection = {
  menuItemId: "dinner-grilled-chicken-dinner",
  customizations: [
    { customizationOptionId: "side-french-fries" },
    { customizationOptionId: "side-rice-pilaf" }
    // Must select exactly 2 sides, no more, no less
  ]
};

// Special validation for dinner plates
const sidesData = await engine.getDinnerPlateSides(
  "dinner-grilled-chicken-dinner", 
  ["side-french-fries", "side-rice-pilaf"]
);
// Returns: isComplete: true, isValid: true, remainingSelections: 0
```

### 3. Salad with Protein

```typescript
const saladSelection = {
  menuItemId: "salad-caesar-salad",
  customizations: [
    { customizationOptionId: "size-large" },           // +$4.00
    { customizationOptionId: "protein-grilled-chicken" }, // +$4.00
    { customizationOptionId: "dressing-caesar" }       // +$0.00 (required)
  ]
};
```

## Validation Rules

### Required Customizations
- Size is required for sandwiches and salads
- Bread type is required for sandwiches  
- Dressing is required for salads
- Sides selection is required for dinner plates

### Special Logic
- **Dinner Plates**: Must select exactly 2 of 3 available sides
- **No Duplicates**: Cannot select the same side twice
- **Quantity Limits**: Some options have maximum quantities

### Error Messages
```typescript
// Example validation errors
{
  isValid: false,
  errors: [
    "Size is required",
    "You must choose exactly 2 sides for dinner plates",
    "Cannot select the same side twice"
  ],
  warnings: []
}
```

## Integration with Existing System

### Cart Compatibility
The enhanced `CartItem` model supports both pizza and menu items:

```typescript
// Pizza item (existing system)
{
  pizzaSizeId: "size-large",
  pizzaCrustId: "crust-thin",
  pizzaSauceId: "sauce-marinara",
  menuItemId: null
}

// Menu item (new system)  
{
  pizzaSizeId: null,
  pizzaCrustId: null,
  pizzaSauceId: null,
  menuItemId: "sandwich-italian-sub"
}
```

### Checkout Process
Both pizza and menu items flow through the same cart and checkout system, maintaining unified order processing.

## Testing

### Test Coverage
- ✅ Menu data fetching
- ✅ Validation logic (required, optional, limits)
- ✅ Pricing calculations (all price types)
- ✅ Special business logic (dinner plate sides)
- ✅ API endpoint functionality
- ✅ Error handling and edge cases

### Running Tests
```bash
node test-customization-engine.js
```

## Next Steps

The customization engine is ready for **Step 3: Multi-Category UI Framework**, which will create React components that utilize these APIs to provide category-specific customization interfaces.

### Upcoming Features
- React components for each category type
- Mobile-responsive customization interfaces  
- Real-time pricing updates
- Integration with existing cart system
- Admin interface for managing customizations

## Performance Considerations

- Database queries optimized with proper includes
- Singleton service pattern for resource management
- Validation happens client-side and server-side
- Pricing calculated in real-time with caching potential

## Security

- All inputs validated with Zod schemas
- Proper error handling without data leaks
- Database queries use Prisma ORM (SQL injection protected)
- API endpoints follow REST conventions
