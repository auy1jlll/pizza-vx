import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminLimiter } from '@/lib/simple-rate-limit';

// Get single promotion
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-promotions-get-single', ip);
    if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });

    const { id } = params;

    const promotion = await prisma.promotion.findUnique({
      where: { id }
    });

    if (!promotion) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ promotion });
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotion' },
      { status: 500 }
    );
  }
}

// Update promotion
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-promotions-put', ip);
    if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });

    const { id } = params;
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

    const promotion = await prisma.promotion.update({
      where: { id },
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
      message: 'Promotion updated successfully',
      promotion 
    });
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to update promotion' },
      { status: 500 }
    );
  }
}

// Delete promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-promotions-delete', ip);
    if (!limit.allowed) return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });

    const { id } = params;

    const promotion = await prisma.promotion.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Promotion deleted successfully',
      promotion 
    });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { error: 'Failed to delete promotion' },
      { status: 500 }
    );
  }
}
