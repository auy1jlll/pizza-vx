import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Basic validation functions
function validateCategoryData(data: any) {
  const errors: string[] = [];
  
  // Check name
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Category name is required and cannot be empty');
  } else if (data.name.trim().length > 100) {
    errors.push('Category name must be under 100 characters');
  }
  
  // Check slug
  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length === 0) {
    errors.push('Category slug is required and cannot be empty');
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('Category slug must contain only lowercase letters, numbers, and hyphens');
  }
  
  // Check description length
  if (data.description && data.description.length > 500) {
    errors.push('Category description must be under 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// GET /api/admin/menu/categories - Get all categories with counts
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.menuCategory.findMany({
      include: {
        _count: {
          select: {
            menuItems: true,
            customizationGroups: true
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/admin/menu/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, imageUrl, isActive = true, sortOrder = 0 } = body;

    // Basic validation
    const validation = validateCategoryData({
      name,
      slug,
      description,
      imageUrl,
      isActive,
      sortOrder
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category validation failed',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await prisma.menuCategory.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.menuCategory.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        isActive,
        sortOrder
      }
    });

    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
