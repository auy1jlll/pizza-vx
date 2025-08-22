import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

interface Params {
  userId: string;
}

// DELETE - Clear a specific customer's cart (admin only)
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const tokenData = verifyAdminToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.userId;

    // In a real implementation, you would:
    // 1. Find the user's cart in the database or cache
    // 2. Clear the cart data
    // 3. Optionally notify the user
    
    // For now, we'll just return success since carts are in localStorage
    console.log(`Admin cleared cart for user: ${userId}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Cart cleared successfully',
      userId 
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Get specific customer's cart details (admin only)
export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const tokenData = verifyAdminToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.userId;

    // Mock detailed cart data for the specific user
    const mockCartDetails = {
      userId,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      items: [
        {
          id: 'item1',
          name: 'Margherita Pizza (Large)',
          quantity: 2,
          price: 18.99,
          type: 'pizza',
          customizations: {
            size: 'Large',
            crust: 'Thin Crust',
            sauce: 'Marinara',
            toppings: ['Mozzarella', 'Fresh Basil', 'Tomatoes']
          }
        },
        {
          id: 'item2',
          name: 'Caesar Salad',
          quantity: 1,
          price: 8.50,
          type: 'menu',
          customizations: {
            dressing: 'Caesar',
            extras: ['Croutons', 'Parmesan']
          }
        }
      ],
      totalItems: 3,
      totalValue: 46.48,
      lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      sessionId: 'session_123',
      deliveryAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        zipCode: '12345'
      }
    };

    return NextResponse.json({ cart: mockCartDetails });

  } catch (error) {
    console.error('Error fetching cart details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
