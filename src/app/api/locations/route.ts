import { NextRequest, NextResponse } from 'next/server';

const locations = [
  {
    id: 1,
    name: 'Exeter',
    slug: 'exeter',
    address: '123 Main Street, Exeter, NH 03833',
    phone: '(603) 555-0101',
    hours: {
      weekdays: 'Mon-Thu: 11:00 AM - 10:00 PM',
      weekend: 'Fri-Sat: 11:00 AM - 11:00 PM',
      sunday: 'Sun: 12:00 PM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Catering'],
    image: '/images/locations/exeter.jpg'
  },
  {
    id: 2,
    name: 'Hampton',
    slug: 'hampton',
    address: '456 Ocean Boulevard, Hampton, NH 03842',
    phone: '(603) 555-0102',
    hours: {
      weekdays: 'Mon-Thu: 11:00 AM - 10:00 PM',
      weekend: 'Fri-Sat: 11:00 AM - 11:00 PM',
      sunday: 'Sun: 12:00 PM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Catering'],
    image: '/images/locations/hampton.jpg'
  },
  {
    id: 3,
    name: 'Newington',
    slug: 'newington',
    address: '789 Woodbury Avenue, Newington, NH 03801',
    phone: '(603) 555-0103',
    hours: {
      weekdays: 'Mon-Thu: 11:00 AM - 10:00 PM',
      weekend: 'Fri-Sat: 11:00 AM - 11:00 PM',
      sunday: 'Sun: 12:00 PM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery'],
    image: '/images/locations/newington.jpg'
  },
  {
    id: 4,
    name: 'Portsmouth',
    slug: 'portsmouth',
    address: '321 Market Street, Portsmouth, NH 03801',
    phone: '(603) 555-0104',
    hours: {
      weekdays: 'Mon-Thu: 11:00 AM - 10:00 PM',
      weekend: 'Fri-Sat: 11:00 AM - 11:00 PM',
      sunday: 'Sun: 12:00 PM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery', 'Catering'],
    image: '/images/locations/portsmouth.jpg'
  },
  {
    id: 5,
    name: 'Rye',
    slug: 'rye',
    address: '654 Ocean Boulevard, Rye, NH 03870',
    phone: '(603) 555-0105',
    hours: {
      weekdays: 'Mon-Thu: 11:00 AM - 10:00 PM',
      weekend: 'Fri-Sat: 11:00 AM - 11:00 PM',
      sunday: 'Sun: 12:00 PM - 9:00 PM'
    },
    features: ['Dine-in', 'Takeout', 'Delivery'],
    image: '/images/locations/rye.jpg'
  }
];

export async function GET() {
  try {
    console.log('📍 Fetching locations...');
    
    return NextResponse.json({
      success: true,
      locations: locations
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching locations:', {
      message: errorMessage,
      error: error
    });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch locations',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
