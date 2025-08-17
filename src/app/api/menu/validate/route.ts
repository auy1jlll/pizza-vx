// API endpoint for customization validation and pricing
import { NextRequest, NextResponse } from 'next/server';
import { CustomizationEngine, MenuItemSelection } from '@/lib/customization-engine';
import { z } from 'zod';

// Validation schema for customization requests
const CustomizationSelectionSchema = z.object({
  customizationOptionId: z.string(),
  quantity: z.number().int().min(1).optional()
});

const MenuItemSelectionSchema = z.object({
  menuItemId: z.string(),
  customizations: z.array(CustomizationSelectionSchema)
});

// POST /api/menu/validate - Validate customization selections
export async function POST(request: NextRequest) {
  const engine = new CustomizationEngine();
  
  try {
    const body = await request.json();
    const validatedData = MenuItemSelectionSchema.parse(body);

    // Validate the selections
    const validation = await engine.validateSelections(validatedData);
    
    // If valid, also calculate pricing
    let pricing = null;
    if (validation.isValid) {
      pricing = await engine.calculatePrice(validatedData);
    }

    return NextResponse.json({
      success: true,
      data: {
        validation,
        pricing
      }
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

    console.error('Menu validation API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to validate customizations' 
      },
      { status: 500 }
    );
  } finally {
    await engine.disconnect();
  }
}
