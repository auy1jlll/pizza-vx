import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 MINIMAL CHECKOUT TEST - Starting...');
    const body = await request.json();
    console.log('🔥 Request body received:', JSON.stringify(body, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Minimal checkout test successful',
      receivedData: body
    });
  } catch (error) {
    console.error('🔥 MINIMAL CHECKOUT TEST - Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
