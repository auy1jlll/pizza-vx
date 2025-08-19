# CUSTOMIZATION CATEGORY FIX - MANUAL STEPS

## Problem Identified:
All CustomizationGroup records have categoryId pointing to a MenuCategory named "menucategory"

## Solution Steps:

### Step 1: Open Terminal/PowerShell in the project directory
```bash
cd "c:\Users\auy1j\Desktop\restoApp"
```

### Step 2: Run the automated fix script
```bash
node automated-category-fix.js
```

### Alternative: Manual Database Commands (if script doesn't work)

#### A. Create proper MenuCategory records:
```javascript
// Run this in Node.js or add to a script file
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCategories() {
  // Create Sandwiches category
  const sandwiches = await prisma.menuCategory.upsert({
    where: { slug: 'sandwiches' },
    update: {},
    create: {
      name: 'Sandwiches',
      slug: 'sandwiches',
      description: 'Sandwich menu items',
      isActive: true,
      sortOrder: 1
    }
  });

  // Create Salads category  
  const salads = await prisma.menuCategory.upsert({
    where: { slug: 'salads' },
    update: {},
    create: {
      name: 'Salads',
      slug: 'salads', 
      description: 'Fresh salad options',
      isActive: true,
      sortOrder: 2
    }
  });

  // Create Seafood category
  const seafood = await prisma.menuCategory.upsert({
    where: { slug: 'seafood' },
    update: {},
    create: {
      name: 'Seafood',
      slug: 'seafood',
      description: 'Fresh seafood dishes', 
      isActive: true,
      sortOrder: 3
    }
  });

  // Create Dinner Plates category
  const dinnerPlates = await prisma.menuCategory.upsert({
    where: { slug: 'dinner-plates' },
    update: {},
    create: {
      name: 'Dinner Plates',
      slug: 'dinner-plates',
      description: 'Main course dinner plates',
      isActive: true,
      sortOrder: 4
    }
  });

  console.log('Categories created:', { sandwiches: sandwiches.id, salads: salads.id, seafood: seafood.id, dinnerPlates: dinnerPlates.id });
  
  return { sandwiches, salads, seafood, dinnerPlates };
}
```

#### B. Update CustomizationGroups:
```javascript
async function reassignGroups() {
  const categories = await createCategories();
  
  // Get all groups currently assigned to "menucategory"
  const groups = await prisma.customizationGroup.findMany({
    include: { category: true }
  });
  
  for (const group of groups) {
    const name = group.name.toLowerCase();
    let newCategoryId = null;
    
    // Assign based on group name
    if (name.includes('bread') || name.includes('sub') || name.includes('sandwich')) {
      newCategoryId = categories.sandwiches.id;
    } else if (name.includes('salad') || name.includes('dressing')) {
      newCategoryId = categories.salads.id;
    } else if (name.includes('seafood') || name.includes('cooking') || name.includes('fish')) {
      newCategoryId = categories.seafood.id;
    } else if (name.includes('side') || name.includes('sauce') || name.includes('dinner')) {
      newCategoryId = categories.dinnerPlates.id;
    }
    // else: leave as NULL for global groups
    
    if (newCategoryId && group.categoryId !== newCategoryId) {
      await prisma.customizationGroup.update({
        where: { id: group.id },
        data: { categoryId: newCategoryId }
      });
      console.log(`Updated ${group.name} to new category`);
    }
  }
}
```

### Step 3: Verify the fix
```bash
node check-customization-categories.js
```

## Expected Results After Fix:
- CustomizationGroups will be distributed across proper categories
- No more "menucategory" assignments
- Groups like "Bread Choice" → Sandwiches category
- Groups like "Dressing Type" → Salads category
- Groups like "Cooking Style" → Seafood category
- Groups like "Side Choice" → Dinner Plates category
- Generic groups → NULL (global)

## Files Created:
- `automated-category-fix.js` - Main fix script
- `check-customization-categories.js` - Verification script
- `fix-customization-categories.js` - Alternative detailed script

## Quick Test:
To verify it worked, you should see a distribution like:
```
Sandwiches: X groups
Salads: X groups  
Seafood: X groups
Dinner Plates: X groups
GLOBAL: X groups
```
Instead of:
```
menucategory: ALL groups
```
