import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { adminLimiter } from '@/lib/simple-rate-limit';

// GET /api/admin/components - Fetch all pizza components in one request
export async function GET(request: NextRequest) {
  try {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
  const limit = adminLimiter.check('admin-components-get', ip);
  if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    // Verify admin authentication
    const user = await verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch all components in parallel for better performance
    const [sizes, crusts, sauces, toppings] = await Promise.all([
      prisma.pizzaSize.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.pizzaCrust.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.pizzaSauce.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.pizzaTopping.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ]);
    
    return NextResponse.json({
      sizes,
      crusts,
      sauces,
      toppings,
      meta: {
        totalComponents: sizes.length + crusts.length + sauces.length + toppings.length,
        loadedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching components:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch pizza components',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
