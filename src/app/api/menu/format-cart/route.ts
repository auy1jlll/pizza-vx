// API endpoint for formatting menu items for cart
import { NextRequest, NextResponse } from 'next/server';
import { CustomizationEngine, MenuItemSelection } from '@/lib/customization-engine';
import { z } from 'zod';

// Validation schema
const CustomizationSelectionSchema = z.object({
  customizationOptionId: z.string(),
  quantity: z.number().int().min(1).optional()
});

const MenuItemSelectionSchema = z.object({
  menuItemId: z.string(),
  customizations: z.array(CustomizationSelectionSchema)
});

// POST /api/menu/format-cart - Format customizations for cart display
export async function POST(request: NextRequest) {
  const engine = new CustomizationEngine();
  
  try {
    const body = await request.json();
    const validatedData = MenuItemSelectionSchema.parse(body);

    // First validate the selections
    const validation = await engine.validateSelections(validatedData);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid customizations',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Format for cart
    const cartItem = await engine.formatForCart(validatedData);

    return NextResponse.json({
      success: true,
      data: cartItem
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data',
          details: error.issues
        },
        { status: 400 }
      );
    }

    console.error('Menu format cart API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to format item for cart' 
      },
      { status: 500 }
    );
  } finally {
    await engine.disconnect();
  }
}
