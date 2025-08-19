#!/usr/bin/env node

/**
 * Bulk Menu Upload  async clearExistingData() {
    console.log('🧹 Clearing existing menu data...');
    
    // Clear in reverse dependency order
    await prisma.orderItemCustomization.deleteMany();
    await prisma.cartItemCustomization.deleteMany();
    await prisma.customizationOption.deleteMany();
    await prisma.menuItemCustomization.deleteMany();
    await prisma.customizationGroup.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.menuCategory.deleteMany();
    
    console.log('   ✅ Existing data cleared\n');
  }
 * Processes CSV files in the correct order to populate menu database
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const prisma = new PrismaClient();

class BulkMenuUploader {
  constructor() {
    this.uploadOrder = [
      '1-categories.csv',
      '2-menu-items.csv', 
      '3-customization-groups.csv',
      '4-customization-options.csv'
    ];
  }

  async processAllFiles() {
    console.log('🚀 Starting bulk menu upload process...\n');
    
    try {
      // Clear existing data (optional - comment out if you want to append)
      // await this.clearExistingData();
      
      // Process files in order
      for (const filename of this.uploadOrder) {
        await this.processFile(filename);
      }
      
      console.log('\n✅ Bulk upload completed successfully!');
      await this.generateSummary();
      
    } catch (error) {
      console.error('\n❌ Bulk upload failed:', error.message);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async clearExistingData() {
    console.log('🧹 Clearing existing menu data...');
    
    // Delete in reverse order of dependencies
    await prisma.customizationOption.deleteMany();
    await prisma.customizationGroup.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();
    
    console.log('   ✓ Existing data cleared\n');
  }

  async processFile(filename) {
    const filePath = path.join(__dirname, 'bulk-upload-templates', filename);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filename}`);
    }

    console.log(`📁 Processing ${filename}...`);
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`   📊 Found ${records.length} records`);

    switch (filename) {
      case '1-categories.csv':
        await this.processCategories(records);
        break;
      case '2-menu-items.csv':
        await this.processMenuItems(records);
        break;
      case '3-customization-groups.csv':
        await this.processCustomizationGroups(records);
        break;
      case '4-customization-options.csv':
        await this.processCustomizationOptions(records);
        break;
    }

    console.log(`   ✅ ${filename} processed successfully\n`);
  }

  async processCategories(records) {
    for (const record of records) {
      await prisma.menuCategory.upsert({
        where: { slug: record.slug },
        update: {
          name: record.name,
          description: record.description || null,
          imageUrl: record.image_url || null,
          sortOrder: parseInt(record.display_order) || 0,
          isActive: record.is_active === 'true'
        },
        create: {
          name: record.name,
          slug: record.slug,
          description: record.description || null,
          imageUrl: record.image_url || null,
          sortOrder: parseInt(record.display_order) || 0,
          isActive: record.is_active === 'true'
        }
      });
    }
  }

  async processMenuItems(records) {
    for (const record of records) {
      // Find category by slug
      const category = await prisma.menuCategory.findUnique({
        where: { slug: record.category_slug }
      });

      if (!category) {
        throw new Error(`Category not found: ${record.category_slug}`);
      }

      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: record.name,
          categoryId: category.id
        }
      });

      if (existingItem) {
        // Update existing item
        await prisma.menuItem.update({
          where: { id: existingItem.id },
          data: {
            description: record.description || null,
            basePrice: parseFloat(record.base_price),
            imageUrl: record.image_url || null,
            isAvailable: record.is_available === 'true',
            preparationTime: record.prep_time_minutes ? parseInt(record.prep_time_minutes) : null,
            allergens: record.allergens || null
          }
        });
      } else {
        // Create new item
        await prisma.menuItem.create({
          data: {
            name: record.name,
            description: record.description || null,
            basePrice: parseFloat(record.base_price),
            imageUrl: record.image_url || null,
            isAvailable: record.is_available === 'true',
            preparationTime: record.prep_time_minutes ? parseInt(record.prep_time_minutes) : null,
            allergens: record.allergens || null,
            categoryId: category.id
          }
        });
      }
    }
  }

  async processCustomizationGroups(records) {
    for (const record of records) {
      // Find menu item by name
      const menuItem = await prisma.menuItem.findFirst({
        where: { name: record.menu_item_name }
      });

      if (!menuItem) {
        throw new Error(`Menu item not found: ${record.menu_item_name}`);
      }

      // Create the customization group
      const group = await prisma.customizationGroup.create({
        data: {
          name: record.group_name,
          type: record.group_type === 'single' ? 'SINGLE_SELECT' : 'MULTI_SELECT',
          sortOrder: parseInt(record.display_order) || 0,
          isRequired: record.is_required === 'true',
          maxSelections: record.max_selections ? parseInt(record.max_selections) : null,
          minSelections: record.is_required === 'true' ? 1 : 0
        }
      });

      // Link the group to the menu item
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItem.id,
          customizationGroupId: group.id,
          isRequired: record.is_required === 'true',
          sortOrder: parseInt(record.display_order) || 0
        }
      });
    }
  }

  async processCustomizationOptions(records) {
    for (const record of records) {
      // Find menu item and group
      const menuItem = await prisma.menuItem.findFirst({
        where: { name: record.menu_item_name }
      });

      if (!menuItem) {
        throw new Error(`Menu item not found: ${record.menu_item_name}`);
      }

      // Find the customization group linked to this menu item
      const menuItemCustomization = await prisma.menuItemCustomization.findFirst({
        where: { 
          menuItemId: menuItem.id,
          customizationGroup: {
            name: record.group_name
          }
        },
        include: {
          customizationGroup: true
        }
      });

      if (!menuItemCustomization) {
        throw new Error(`Customization group not found: ${record.group_name} for ${record.menu_item_name}`);
      }

      await prisma.customizationOption.create({
        data: {
          name: record.option_name,
          priceModifier: parseFloat(record.price_modifier) || 0,
          isDefault: record.is_default === 'true',
          sortOrder: parseInt(record.display_order) || 0,
          isActive: record.is_available === 'true',
          groupId: menuItemCustomization.customizationGroup.id
        }
      });
    }
  }

  async generateSummary() {
    const categories = await prisma.menuCategory.count();
    const menuItems = await prisma.menuItem.count();
    const groups = await prisma.customizationGroup.count();
    const options = await prisma.customizationOption.count();

    console.log('📊 Upload Summary:');
    console.log(`   Categories: ${categories}`);
    console.log(`   Menu Items: ${menuItems}`);
    console.log(`   Customization Groups: ${groups}`);
    console.log(`   Customization Options: ${options}`);
  }
}

// Run the uploader
if (require.main === module) {
  const uploader = new BulkMenuUploader();
  uploader.processAllFiles().catch(console.error);
}

module.exports = BulkMenuUploader;
