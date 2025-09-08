import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

// GET - Get all active customer carts (admin only)
export async function GET(request: NextRequest) {
  try {
    const tokenData = await verifyAdminToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, we'll return mock data since the cart system uses localStorage
    // In a real implementation, you'd store cart data in the database or Redis
    const mockCarts = [
      {
        userId: 'user1',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        items: [
          {
            id: 'item1',
            name: 'Margherita Pizza (Large)',
            quantity: 2,
            price: 18.99,
            type: 'pizza'
          },
          {
            id: 'item2',
            name: 'Caesar Salad',
            quantity: 1,
            price: 8.50,
            type: 'menu'
          }
        ],
        totalItems: 3,
        totalValue: 46.48,
        lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      },
      {
        userId: 'user2',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@example.com',
        items: [
          {
            id: 'item3',
            name: 'Pepperoni Pizza (Medium)',
            quantity: 1,
            price: 15.99,
            type: 'pizza'
          },
          {
            id: 'item4',
            name: 'Garlic Bread',
            quantity: 2,
            price: 4.99,
            type: 'menu'
          },
          {
            id: 'item5',
            name: 'Soft Drink',
            quantity: 2,
            price: 2.50,
            type: 'menu'
          }
        ],
        totalItems: 5,
        totalValue: 25.97,
        lastUpdated: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
      },
      {
        userId: 'user3',
        customerName: 'Mike Johnson',
        customerEmail: 'mike.johnson@example.com',
        items: [
          {
            id: 'item6',
            name: 'Supreme Pizza (Large)',
            quantity: 1,
            price: 22.99,
            type: 'pizza'
          },
          {
            id: 'item7',
            name: 'Buffalo Wings',
            quantity: 1,
            price: 12.99,
            type: 'menu'
          },
          {
            id: 'item8',
            name: 'Chocolate Cake',
            quantity: 1,
            price: 6.99,
            type: 'menu'
          },
          {
            id: 'item9',
            name: 'Garlic Knots',
            quantity: 3,
            price: 3.99,
            type: 'menu'
          }
        ],
        totalItems: 6,
        totalValue: 54.94,
        lastUpdated: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      }
    ];

    return NextResponse.json({ carts: mockCarts });

  } catch (error) {
    console.error('Error fetching carts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
