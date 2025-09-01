import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminLimiter } from '@/lib/simple-rate-limit';
import { verifyAdminToken } from '@/lib/auth';

// Get all promotions
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-promotions-get', ip);
    if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });

    const url = new URL(request.url);
    const isActive = url.searchParams.get('active');
    const type = url.searchParams.get('type');
    const category = url.searchParams.get('category');

    const where: any = {};
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (type) {
      where.type = type;
    }
    
    if (category) {
      where.applicableCategories = {
        has: category
      };
    }

    const promotions = await prisma.promotion.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ promotions });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}

// Create new promotion
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-promotions-post', ip);
    if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.type || !data.discountType || data.discountValue === undefined) {
      return NextResponse.json(
        { error: 'Name, type, discount type, and discount value are required' },
        { status: 400 }
      );
    }

    // Validate discount value
    if (data.discountValue < 0) {
      return NextResponse.json(
        { error: 'Discount value must be positive' },
        { status: 400 }
      );
    }

    // Validate percentage discounts
    if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
      return NextResponse.json(
        { error: 'Percentage discount cannot exceed 100%' },
        { status: 400 }
      );
    }

    // Validate date range
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start >= end) {
        return NextResponse.json(
          { error: 'Start date must be before end date' },
          { status: 400 }
        );
      }
    }

    const promotion = await prisma.promotion.create({
      data: {
        name: data.name,
        description: data.description || null,
        type: data.type,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minimumOrderAmount: data.minimumOrderAmount || null,
        maximumDiscountAmount: data.maximumDiscountAmount || null,
        minimumQuantity: data.minimumQuantity || null,
        applicableCategories: data.applicableCategories || [],
        applicableItems: data.applicableItems || [],
        requiresLogin: data.requiresLogin || false,
        userGroupRestrictions: data.userGroupRestrictions || [],
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        usageLimit: data.usageLimit || null,
        perUserLimit: data.perUserLimit || null,
        stackable: data.stackable || false,
        priority: data.priority || 0,
        terms: data.terms || null
      }
    });

    return NextResponse.json({ 
      message: 'Promotion created successfully',
      promotion 
    });
  } catch (error: any) {
    console.error('Error creating promotion:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { 
        error: 'Failed to create promotion',
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    );
  }
}
