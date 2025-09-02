// API endpoint for menu categories and customization data
import { NextRequest, NextResponse } from 'next/server';
import { CustomizationEngine } from '@/lib/customization-engine';

// GET /api/menu/categories - Get all categories with their customization options
export async function GET(request: NextRequest) {
  const engine = new CustomizationEngine();
  
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');

    if (categorySlug) {
      // Get specific category data with menu items
      const [categoryInfo, menuItems] = await Promise.all([
        engine.getCategoryBySlug(categorySlug),
        engine.getMenuData(categorySlug)
      ]);

      if (!categoryInfo) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }

      // Transform menu items to match expected structure
      const transformedItems = menuItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        basePrice: item.basePrice,
        imageUrl: item.imageUrl,
        isActive: item.isActive,
        customizationGroups: item.customizationGroups.map(cg => ({
          id: cg.customizationGroup.id,
          name: cg.customizationGroup.name,
          type: cg.customizationGroup.type,
          isRequired: cg.isRequired,
          maxSelections: cg.customizationGroup.maxSelections,
          options: cg.customizationGroup.options.map(opt => ({
            id: opt.id,
            name: opt.name,
            priceModifier: opt.priceModifier,
            isDefault: opt.isDefault
          }))
        }))
      }));

      return NextResponse.json({
        success: true,
        data: {
          id: categoryInfo.id,
          name: categoryInfo.name,
          slug: categoryInfo.slug,
          description: categoryInfo.description,
          menuItems: transformedItems
        }
      });
    } else {
      // Get all categories (optimized for navbar)
      const categories = await engine.getCategoriesForNavbar();
      return NextResponse.json({
        success: true,
        data: categories
      });
    }

  } catch (error) {
    console.error('Menu categories API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch menu data' 
      },
      { status: 500 }
    );
  } finally {
    await engine.disconnect();
  }
}
