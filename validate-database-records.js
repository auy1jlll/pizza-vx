/**
 * Database validation checker for existing menu data
 * Checks all menu categories, items, and customization data for validation issues
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function validateDatabaseRecords() {
  console.log('🔍 Database Menu Records Validation');
  console.log('====================================');

  const issues = [];
  const warnings = [];

  try {
    // 1. Validate Menu Categories
    console.log('\n1. Validating Menu Categories...');
    const categories = await prisma.menuCategory.findMany();
    
    for (const category of categories) {
      const context = `Category "${category.id}"`;
      
      // Check name
      if (!category.name || category.name.trim().length === 0) {
        issues.push(`${context}: Empty or missing name`);
      } else if (category.name.trim().length < 2) {
        warnings.push(`${context}: Very short name "${category.name}"`);
      }
      
      // Check slug
      if (!category.slug || category.slug.trim().length === 0) {
        issues.push(`${context}: Empty or missing slug`);
      } else {
        const slugPattern = /^[a-z0-9-]+$/;
        if (!slugPattern.test(category.slug)) {
          issues.push(`${context}: Invalid slug format "${category.slug}"`);
        }
      }
      
      // Check sort order
      if (category.sortOrder < 0) {
        issues.push(`${context}: Negative sort order ${category.sortOrder}`);
      }
    }
    
    console.log(`   Checked ${categories.length} categories`);

    // 2. Validate Menu Items
    console.log('\n2. Validating Menu Items...');
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: {
          select: { name: true }
        }
      }
    });
    
    for (const item of menuItems) {
      const context = `Item "${item.id}" in category "${item.category.name}"`;
      
      // Check name
      if (!item.name || item.name.trim().length === 0) {
        issues.push(`${context}: Empty or missing name`);
      } else if (item.name.trim().length < 2) {
        warnings.push(`${context}: Very short name "${item.name}"`);
      }
      
      // Check base price
      if (item.basePrice === null || item.basePrice === undefined) {
        issues.push(`${context}: Missing base price`);
      } else if (typeof item.basePrice !== 'number' || isNaN(item.basePrice)) {
        issues.push(`${context}: Invalid base price type ${typeof item.basePrice}`);
      } else if (item.basePrice < 0) {
        issues.push(`${context}: Negative base price ${item.basePrice}`);
      } else if (item.basePrice > 100) {
        warnings.push(`${context}: Unusually high price $${item.basePrice}`);
      }
      
      // Check category relationship
      if (!item.categoryId) {
        issues.push(`${context}: Missing category ID`);
      }
      
      // Check preparation time
      if (item.preparationTime !== null && (item.preparationTime < 1 || item.preparationTime > 180)) {
        warnings.push(`${context}: Unusual preparation time ${item.preparationTime} minutes`);
      }
      
      // Check JSON fields
      if (item.allergens) {
        try {
          JSON.parse(item.allergens);
        } catch {
          issues.push(`${context}: Invalid allergens JSON format`);
        }
      }
      
      if (item.nutritionInfo) {
        try {
          JSON.parse(item.nutritionInfo);
        } catch {
          issues.push(`${context}: Invalid nutrition info JSON format`);
        }
      }
    }
    
    console.log(`   Checked ${menuItems.length} menu items`);

    // 3. Validate Customization Groups
    console.log('\n3. Validating Customization Groups...');
    const customizationGroups = await prisma.customizationGroup.findMany({
      include: {
        category: {
          select: { name: true }
        }
      }
    });
    
    for (const group of customizationGroups) {
      const context = `Customization Group "${group.id}" (${group.category?.name || 'global'})`;
      
      // Check name
      if (!group.name || group.name.trim().length === 0) {
        issues.push(`${context}: Empty or missing name`);
      } else if (group.name.trim().length < 2) {
        warnings.push(`${context}: Very short name "${group.name}"`);
      }
      
      // Check type
      const validTypes = ['SINGLE_SELECT', 'MULTI_SELECT', 'QUANTITY_SELECT', 'SPECIAL_LOGIC'];
      if (!validTypes.includes(group.type)) {
        issues.push(`${context}: Invalid type "${group.type}"`);
      }
      
      // Check selection constraints
      if (group.minSelections < 0) {
        issues.push(`${context}: Negative minimum selections ${group.minSelections}`);
      }
      
      if (group.maxSelections !== null && group.maxSelections < 1) {
        issues.push(`${context}: Invalid maximum selections ${group.maxSelections}`);
      }
      
      if (group.minSelections > group.maxSelections && group.maxSelections !== null) {
        issues.push(`${context}: Min selections (${group.minSelections}) > max selections (${group.maxSelections})`);
      }
      
      // Logic warnings
      if (group.type === 'SINGLE_SELECT' && group.maxSelections !== 1 && group.maxSelections !== null) {
        warnings.push(`${context}: Single select group with max selections != 1`);
      }
      
      if (group.isRequired && group.minSelections === 0) {
        warnings.push(`${context}: Required group with 0 minimum selections`);
      }
    }
    
    console.log(`   Checked ${customizationGroups.length} customization groups`);

    // 4. Validate Customization Options
    console.log('\n4. Validating Customization Options...');
    const customizationOptions = await prisma.customizationOption.findMany({
      include: {
        group: {
          select: { name: true }
        }
      }
    });
    
    for (const option of customizationOptions) {
      const context = `Customization Option "${option.id}" in group "${option.group.name}"`;
      
      // Check name
      if (!option.name || option.name.trim().length === 0) {
        issues.push(`${context}: Empty or missing name`);
      } else if (option.name.trim().length < 1) {
        warnings.push(`${context}: Very short name "${option.name}"`);
      }
      
      // Check price modifier
      if (typeof option.priceModifier !== 'number' || isNaN(option.priceModifier)) {
        issues.push(`${context}: Invalid price modifier type ${typeof option.priceModifier}`);
      } else if (Math.abs(option.priceModifier) > 50) {
        warnings.push(`${context}: Unusually high price modifier $${option.priceModifier}`);
      }
      
      // Check price type
      const validPriceTypes = ['FLAT', 'PERCENTAGE', 'PER_UNIT'];
      if (!validPriceTypes.includes(option.priceType)) {
        issues.push(`${context}: Invalid price type "${option.priceType}"`);
      }
      
      // Check max quantity
      if (option.maxQuantity !== null && option.maxQuantity < 1) {
        issues.push(`${context}: Invalid max quantity ${option.maxQuantity}`);
      }
      
      // Check JSON fields
      if (option.allergens) {
        try {
          JSON.parse(option.allergens);
        } catch {
          issues.push(`${context}: Invalid allergens JSON format`);
        }
      }
      
      if (option.nutritionInfo) {
        try {
          JSON.parse(option.nutritionInfo);
        } catch {
          issues.push(`${context}: Invalid nutrition info JSON format`);
        }
      }
    }
    
    console.log(`   Checked ${customizationOptions.length} customization options`);

    // 5. Check referential integrity
    console.log('\n5. Checking Referential Integrity...');
    
    // Check for orphaned items (items with invalid category IDs)
    const allCategories = await prisma.menuCategory.findMany({ select: { id: true } });
    const categoryIds = allCategories.map(cat => cat.id);
    
    const itemsWithInvalidCategory = await prisma.menuItem.findMany({
      where: {
        categoryId: {
          notIn: categoryIds
        }
      }
    });
    
    if (itemsWithInvalidCategory.length > 0) {
      issues.push(`Found ${itemsWithInvalidCategory.length} menu items with invalid category references`);
    }
    
    // Check for orphaned customization options (options with invalid group IDs)
    const allGroups = await prisma.customizationGroup.findMany({ select: { id: true } });
    const groupIds = allGroups.map(group => group.id);
    
    const optionsWithInvalidGroup = await prisma.customizationOption.findMany({
      where: {
        groupId: {
          notIn: groupIds
        }
      }
    });
    
    if (optionsWithInvalidGroup.length > 0) {
      issues.push(`Found ${optionsWithInvalidGroup.length} customization options with invalid group references`);
    }

    // 6. Summary Report
    console.log('\n📊 Validation Summary:');
    console.log('======================');
    
    if (issues.length === 0 && warnings.length === 0) {
      console.log('✅ All database records passed validation!');
    } else {
      if (issues.length > 0) {
        console.log(`❌ Found ${issues.length} critical validation issues:`);
        issues.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue}`);
        });
      }
      
      if (warnings.length > 0) {
        console.log(`\n⚠️  Found ${warnings.length} warnings:`);
        warnings.forEach((warning, index) => {
          console.log(`   ${index + 1}. ${warning}`);
        });
      }
      
      console.log('\n🔧 Recommendations:');
      if (issues.length > 0) {
        console.log('- Fix critical issues immediately to prevent system problems');
        console.log('- Consider adding validation to prevent future issues');
      }
      if (warnings.length > 0) {
        console.log('- Review warnings and update records if needed');
        console.log('- Consider implementing stricter validation rules');
      }
    }

    // Statistics
    console.log('\n📈 Database Statistics:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Menu Items: ${menuItems.length}`);
    console.log(`   Customization Groups: ${customizationGroups.length}`);
    console.log(`   Customization Options: ${customizationOptions.length}`);

  } catch (error) {
    console.error('❌ Validation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run validation
validateDatabaseRecords().catch(console.error);
