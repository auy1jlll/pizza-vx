import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id: orderId } = await params;

    // Validate status - only allow kitchen-relevant statuses
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Convert status to uppercase for Prisma enum
    const prismaStatus = status.toUpperCase();

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: prismaStatus,
        updatedAt: new Date()
      },
      select: {
        id: true,
        status: true,
        updatedAt: true
      }
    });

    console.log(`🍕 Store kitchen: Updated order ${orderId} status to ${status}`);

    return NextResponse.json({ 
      success: true,
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
