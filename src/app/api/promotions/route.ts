import { NextRequest, NextResponse } from 'next/server';
import PromotionService, { CartItem, Promotion } from '@/lib/promotion-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, promotionCode } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Validate items structure
    const validItems: CartItem[] = items.map((item: any) => ({
      id: item.id || 'unknown',
      name: item.name,
      basePrice: Number(item.basePrice) || 0,
      totalPrice: Number(item.totalPrice) || Number(item.basePrice) || 0,
      quantity: Number(item.quantity) || 1,
      type: item.type || 'pizza',
      size: item.size,
      menuItemId: item.menuItemId
    }));

    // Get available promotions (in a real app, this would come from database)
    const availablePromotions = PromotionService.getDefaultPromotions();

    // If a specific promotion code is provided, filter to that promotion
    let activePromotions = availablePromotions.filter(p => PromotionService.isPromotionValid(p));
    
    if (promotionCode) {
      activePromotions = activePromotions.filter(p => 
        p.id === promotionCode || p.name.toLowerCase().includes(promotionCode.toLowerCase())
      );
    }

    // Apply the best promotion
    const result = PromotionService.applyBestPromotion(validItems, activePromotions);

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        formattedResult: PromotionService.formatPromotionResult(result),
        availablePromotions: activePromotions.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          type: p.type
        }))
      }
    });

  } catch (error) {
    console.error('Error calculating promotions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate promotions' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return available promotions
    const promotions = PromotionService.getDefaultPromotions()
      .filter(p => PromotionService.isPromotionValid(p))
      .map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        type: p.type,
        termsAndConditions: p.termsAndConditions,
        minimumOrderAmount: p.minimumOrderAmount,
        minimumItemCount: p.minimumItemCount
      }));

    return NextResponse.json({
      success: true,
      data: promotions
    });

  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}
