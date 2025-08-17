// API endpoint for dinner plate sides (special "2 of 3" logic)
import { NextRequest, NextResponse } from 'next/server';
import { CustomizationEngine } from '@/lib/customization-engine';
import { z } from 'zod';

const DinnerPlateSidesSchema = z.object({
  mainItemId: z.string(),
  selectedSideIds: z.array(z.string())
});

// POST /api/menu/dinner-plate-sides - Handle dinner plate sides selection
export async function POST(request: NextRequest) {
  const engine = new CustomizationEngine();
  
  try {
    const body = await request.json();
    const { mainItemId, selectedSideIds } = DinnerPlateSidesSchema.parse(body);

    const sidesData = await engine.getDinnerPlateSides(mainItemId, selectedSideIds);

    return NextResponse.json({
      success: true,
      data: sidesData
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

    console.error('Dinner plate sides API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process dinner plate sides' 
      },
      { status: 500 }
    );
  } finally {
    await engine.disconnect();
  }
}
