# Developer Implementation Prompts

## Prompt 1: Data Model Refactoring

**Task**: Refactor the existing pizza-centric data models to support multiple menu categories with flexible customization systems.

**Requirements**:
1. Create a new `MenuCategory` model that can represent Pizza, Sandwiches, Salads, Seafood, and Dinner Plates
2. Redesign `MenuItem` model to be category-agnostic with relationships to customization groups
3. Build a flexible `CustomizationGroup` system that can handle:
   - Single selection (size, dressing type)
   - Multiple selection (toppings, condiments)
   - Quantity-based selection (extra cheese, extra meat)
   - Special constraints (dinner plates "2 of 3" sides logic)
4. Ensure backward compatibility with existing pizza data
5. Create migration scripts to convert existing pizza data to the new structure

**Technical Details**:
- Use polymorphic relationships where appropriate
- Implement proper indexing for performance
- Include soft deletes for menu management
- Add validation rules at the model level
- Consider using JSON fields for flexible option storage

**Deliverables**:
- Updated database schema
- Migration scripts
- Model classes with relationships
- Validation rules
- Unit tests for all models

---

## Prompt 2: Generic Customization Engine

**Task**: Build a category-agnostic customization engine that can handle all menu item types with their specific customization rules.

**Requirements**:
1. Create a `CustomizationEngine` class that can process any menu item's customization options
2. Implement pricing calculation logic that handles:
   - Base item pricing
   - Size-based pricing modifiers
   - Add-on pricing (flat rate or percentage)
   - Bulk pricing rules
3. Build validation system for:
   - Required vs optional selections
   - Minimum/maximum selection constraints
   - Mutually exclusive options
   - Special dinner plate "2 of 3" logic
4. Create a clean API for frontend consumption

**Technical Implementation**:
```javascript
class CustomizationEngine {
  validateSelections(menuItem, selections) {
    // Validate all customization rules
  }
  
  calculatePrice(menuItem, selections) {
    // Calculate total price including all modifiers
  }
  
  formatForCart(menuItem, selections) {
    // Format customizations for cart display
  }
  
  getDinnerPlateSides(mainItem, selectedSides) {
    // Special logic for dinner plate side selection
  }
}
```

**Deliverables**:
- CustomizationEngine class
- Pricing calculation methods
- Validation rule engine
- API endpoints for customization data
- Comprehensive test suite

---

## Prompt 3: Multi-Category UI Framework

**Task**: Create a flexible UI framework that can display different menu categories with their specific customization interfaces.

**Requirements**:
1. Build reusable components for menu item display and customization
2. Create category-specific customization interfaces:
   - Sandwich builder with condiments and toppings
   - Salad builder with proteins and dressings
   - Seafood preparation options
   - Dinner plate with "2 of 3" sides selector
3. Ensure mobile responsiveness across all categories
4. Implement smooth navigation between categories
5. Maintain existing pizza functionality without disruption

**Component Structure**:
```jsx
<MenuCategory category="sandwiches">
  <MenuItemList items={sandwichItems} />
  <ItemCustomizer 
    item={selectedItem}
    customizationType="sandwich"
    onCustomizationChange={handleChange}
  />
  <AddToCartButton />
</MenuCategory>
```

**Special Components Needed**:
- `SandwichCustomizer` - handles bread, size, condiments, toppings
- `SaladCustomizer` - manages proteins, dressings, toppings
- `DinnerPlateCustomizer` - enforces "2 of 3" sides selection
- `SeafoodCustomizer` - cooking styles and sides

**Deliverables**:
- Reusable UI components
- Category-specific customization interfaces
- Mobile-responsive layouts
- Navigation system
- Integration with existing cart system

---

## Prompt 4: Enhanced Cart System

**Task**: Upgrade the cart system to handle mixed orders with items from multiple categories while preserving all customizations.

**Requirements**:
1. Extend cart to support mixed menu categories in a single order
2. Preserve detailed customization information for each item
3. Implement category-aware pricing and tax calculations
4. Add item modification capabilities from cart
5. Create order summary that clearly displays all customizations
6. Ensure compatibility with existing checkout process

**Cart Data Structure**:
```javascript
{
  orderId: "uuid",
  items: [
    {
      itemId: "pizza-123",
      category: "pizza",
      name: "Large Pepperoni Pizza",
      basePrice: 15.99,
      customizations: [...],
      quantity: 1,
      totalPrice: 18.99
    },
    {
      itemId: "sub-456",
      category: "sandwiches",
      name: "Large Italian Sub",
      basePrice: 9.99,
      customizations: [
        { group: "condiments", selections: ["mayo", "oil-vinegar"] },
        { group: "toppings", selections: ["lettuce", "tomato"] },
        { group: "extras", selections: ["extra-salami"] }
      ],
      quantity: 1,
      totalPrice: 12.49
    }
  ],
  subtotal: 31.48,
  tax: 2.36,
  total: 33.84
}
```

**Deliverables**:
- Enhanced cart data models
- Multi-category order processing
- Updated cart UI components
- Order summary formatting
- Integration tests with checkout

---

## Prompt 5: Menu Management System

**Task**: Create an administrative interface for managing menu items across all categories with their customization options.

**Requirements**:
1. Build admin interface for menu category management
2. Create item management system with:
   - Add/edit/delete menu items
   - Manage customization groups and options
   - Set pricing and availability
   - Handle seasonal items and specials
3. Implement bulk operations for efficiency
4. Add preview functionality to test customizations
5. Create import/export capabilities for menu data

**Admin Interface Features**:
- Category management dashboard
- Drag-and-drop menu organization
- Customization group builder
- Pricing management tools
- Availability scheduling
- Analytics and reporting

**Deliverables**:
- Admin dashboard interface
- Menu item CRUD operations
- Customization management tools
- Bulk operation capabilities
- Data import/export features
- User role management

---

## Prompt 6: Testing & Quality Assurance

**Task**: Implement comprehensive testing strategy covering all new functionality and existing features.

**Test Categories**:
1. **Unit Tests**:
   - Model validation rules
   - Customization engine logic
   - Pricing calculations
   - Cart operations

2. **Integration Tests**:
   - API endpoint functionality
   - Database operations
   - Third-party service integration
   - Payment processing

3. **End-to-End Tests**:
   - Complete order flows for each category
   - Mixed category orders
   - Mobile responsiveness
   - Cross-browser compatibility

4. **Performance Tests**:
   - Load testing with multiple concurrent users
   - Database query optimization
   - Frontend rendering performance
   - Memory usage optimization

**Test Scenarios**:
- Order pizza and sandwich in same transaction
- Customize dinner plate with side restrictions
- Mobile ordering across all categories
- Admin menu management operations
- Error handling and edge cases

**Deliverables**:
- Comprehensive test suite
- Performance benchmarks
- Browser compatibility matrix
- Mobile device testing results
- Load testing reports

---

## Prompt 7: Migration & Deployment Strategy

**Task**: Plan and execute the migration from pizza-only to multi-category system with zero downtime.

**Migration Steps**:
1. **Pre-Migration**:
   - Backup existing database
   - Set up staging environment
   - Test migration scripts

2. **Schema Migration**:
   - Run database migrations
   - Convert existing pizza data
   - Validate data integrity

3. **Feature Flag Deployment**:
   - Deploy new code with feature flags
   - Gradually enable new categories
   - Monitor system performance

4. **Full Rollout**:
   - Enable all new features
   - Monitor user adoption
   - Collect feedback and iterate

**Rollback Plan**:
- Database rollback procedures
- Feature flag disable process
- Communication plan for issues
- Data recovery procedures

**Deliverables**:
- Migration scripts and procedures
- Deployment checklist
- Rollback procedures
- Monitoring and alerting setup
- Go-live communication plan