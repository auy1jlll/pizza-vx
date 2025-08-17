import { NextRequest, NextResponse } from 'next/server';
import { refreshCartPrices } from '@/lib/cart-pricing';

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Cart refresh-prices endpoint called');
    
    // Parse request body with validation
    let cartData;
    try {
      cartData = await request.json();
      console.log('📊 Cart data structure:', {
        hasPizzaItems: !!cartData.pizzaItems,
        pizzaItemsCount: cartData.pizzaItems?.length || 0,
        hasMenuItems: !!cartData.menuItems,
        menuItemsCount: cartData.menuItems?.length || 0
      });
    } catch (parseError) {
      console.error('❌ Failed to parse request JSON:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body'
      }, { status: 400 });
    }
    
    // Validate cart data structure
    if (!cartData || typeof cartData !== 'object') {
      console.error('❌ Invalid cart data structure:', cartData);
      return NextResponse.json({
        success: false,
        error: 'Invalid cart data structure'
      }, { status: 400 });
    }
    
    // Ensure required properties exist
    if (!cartData.pizzaItems) cartData.pizzaItems = [];
    if (!cartData.menuItems) cartData.menuItems = [];
    
    console.log('🔄 Processing cart with:', {
      pizzaItems: cartData.pizzaItems.length,
      menuItems: cartData.menuItems.length
    });
    
    const updatedPrices = await refreshCartPrices(cartData);
    
    console.log('✅ Updated prices calculated successfully:', {
      pizzaItemsProcessed: updatedPrices.pizzaItems.length,
      menuItemsProcessed: updatedPrices.menuItems.length
    });
    
    return NextResponse.json({
      success: true,
      data: updatedPrices
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'Error';
    
    console.error('❌ Error refreshing cart prices:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName,
      error: error
    });
    
    return NextResponse.json({
      success: false,
      error: 'Failed to refresh cart prices',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}
