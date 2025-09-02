// API endpoint for menu items in a specific category
import { NextRequest, NextResponse } from 'next/server';
import { CustomizationEngine } from '@/lib/customization-engine';

interface Params {
  category: string;
}

// GET /api/menu/[category] - Get menu items for a specific category
export async function GET(request: NextRequest, { params }: { params: Params }) {
  console.log('🔍 API called with params:', params);
  
  const engine = new CustomizationEngine();
  
  try {
    const { category } = await params;
    console.log('🔍 Category parameter:', category);
    
    const menuItems = await engine.getMenuData(category);
    console.log('🔍 Found menu items:', menuItems?.length || 0);
    console.log('🔍 First item:', menuItems?.[0]);

    if (!menuItems || menuItems.length === 0) {
      console.log('❌ No menu items found for category:', category);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category not found or no items available',
          category: category
        },
        { status: 404 }
      );
    }

    // Get the category info - either from the first item or find the parent category
    let categoryInfo = menuItems[0]?.category;
    
    // If items are from subcategories, get the parent category info
    if (menuItems.length > 0) {
      const firstItemCategory = menuItems[0].category;
      if (firstItemCategory.parentCategoryId) {
        // These are items from subcategories, get the parent category
        const parentCategory = await engine.getCategoryBySlug(category);
        if (parentCategory) {
          categoryInfo = parentCategory;
        }
      }
    }

    console.log('✅ Returning menu items for category:', category);
    return NextResponse.json({
      success: true,
      data: {
        category: categoryInfo,
        items: menuItems
      }
    });

  } catch (error) {
    console.error('❌ Menu category items API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch menu items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await engine.disconnect();
  }
}
