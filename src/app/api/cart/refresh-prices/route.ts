import { NextRequest, NextResponse } from 'next/server';
import { refreshCartPrices } from '@/lib/cart-pricing';

export async function POST(request: NextRequest) {
  try {
    const cartData = await request.json();
    
    console.log('🔄 Refreshing cart prices for:', cartData);
    
    const updatedPrices = await refreshCartPrices(cartData);
    
    console.log('✅ Updated prices calculated:', updatedPrices);
    
    return NextResponse.json({
      success: true,
      data: updatedPrices
    });
    
  } catch (error) {
    console.error('❌ Error refreshing cart prices:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to refresh cart prices'
    }, { status: 500 });
  }
}
