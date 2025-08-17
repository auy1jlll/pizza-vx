// API endpoint for menu items in a specific category
import { NextRequest, NextResponse } from 'next/server';
import { CustomizationEngine } from '@/lib/customization-engine';

interface Params {
  category: string;
}

// GET /api/menu/[category] - Get menu items for a specific category
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const engine = new CustomizationEngine();
  
  try {
    const { category } = params;
    const menuItems = await engine.getMenuData(category);

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category not found or no items available' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        category: menuItems[0]?.category,
        items: menuItems
      }
    });

  } catch (error) {
    console.error('Menu category items API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch menu items' 
      },
      { status: 500 }
    );
  } finally {
    await engine.disconnect();
  }
}
