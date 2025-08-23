import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch all specialty calzones for admin
export async function GET() {
  try {
    const calzones = await prisma.specialtyCalzone.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          },
          orderBy: {
            pizzaSize: {
              sortOrder: 'asc'
            }
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    // Transform to match frontend expectations
    const transformedCalzones = calzones.map(calzone => ({
      id: calzone.id,
      name: calzone.calzoneName,
      description: calzone.calzoneDescription,
      basePrice: calzone.basePrice,
      category: calzone.category,
      imageUrl: calzone.imageUrl,
      ingredients: calzone.fillings ? 
        (calzone.fillings.startsWith('[') ? JSON.parse(calzone.fillings) : calzone.fillings.split(', ')) : [],
      isActive: calzone.isActive,
      sortOrder: calzone.sortOrder,
      createdAt: calzone.createdAt,
      updatedAt: calzone.updatedAt,
      sizes: calzone.sizes.map(size => ({
        id: size.id,
        specialtyPizzaId: size.specialtyCalzoneId,
        pizzaSizeId: size.pizzaSizeId,
        price: size.price,
        isAvailable: size.isAvailable,
        createdAt: size.createdAt,
        updatedAt: size.updatedAt,
        pizzaSize: size.pizzaSize
      }))
    }));

    return NextResponse.json(transformedCalzones);
  } catch (error) {
    console.error('Error fetching specialty calzones for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specialty calzones' },
      { status: 500 }
    );
  }
}

// POST - Create new specialty calzone
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const calzone = await prisma.specialtyCalzone.create({
      data: {
        calzoneName: data.name,
        calzoneDescription: data.description,
        basePrice: parseFloat(data.basePrice),
        category: data.category || 'CALZONE',
        imageUrl: data.imageUrl,
        fillings: Array.isArray(data.ingredients) ? JSON.stringify(data.ingredients) : data.ingredients,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
        sizes: {
          create: data.sizes?.map((size: any) => ({
            pizzaSizeId: size.pizzaSizeId,
            price: parseFloat(size.price),
            isAvailable: size.isAvailable ?? true
          })) || []
        }
      },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    // Transform response
    const transformedCalzone = {
      id: calzone.id,
      name: calzone.calzoneName,
      description: calzone.calzoneDescription,
      basePrice: calzone.basePrice,
      category: calzone.category,
      imageUrl: calzone.imageUrl,
      ingredients: calzone.fillings ? 
        (calzone.fillings.startsWith('[') ? JSON.parse(calzone.fillings) : calzone.fillings.split(', ')) : [],
      isActive: calzone.isActive,
      sortOrder: calzone.sortOrder,
      createdAt: calzone.createdAt,
      updatedAt: calzone.updatedAt,
      sizes: calzone.sizes.map(size => ({
        id: size.id,
        specialtyPizzaId: size.specialtyCalzoneId,
        pizzaSizeId: size.pizzaSizeId,
        price: size.price,
        isAvailable: size.isAvailable,
        createdAt: size.createdAt,
        updatedAt: size.updatedAt,
        pizzaSize: size.pizzaSize
      }))
    };

    return NextResponse.json(transformedCalzone, { status: 201 });
  } catch (error) {
    console.error('Error creating specialty calzone:', error);
    return NextResponse.json(
      { error: 'Failed to create specialty calzone' },
      { status: 500 }
    );
  }
}

// PUT - Update specialty calzone
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Calzone ID is required' },
        { status: 400 }
      );
    }

    // Update calzone
    const calzone = await prisma.specialtyCalzone.update({
      where: { id },
      data: {
        calzoneName: updateData.name,
        calzoneDescription: updateData.description,
        basePrice: parseFloat(updateData.basePrice),
        category: updateData.category,
        imageUrl: updateData.imageUrl,
        fillings: Array.isArray(updateData.ingredients) ? JSON.stringify(updateData.ingredients) : updateData.ingredients,
        isActive: updateData.isActive,
        sortOrder: updateData.sortOrder
      },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    // Handle sizes update if provided
    if (updateData.sizes) {
      // Delete existing sizes
      await prisma.specialtyCalzoneSize.deleteMany({
        where: { specialtyCalzoneId: id }
      });

      // Create new sizes
      await prisma.specialtyCalzoneSize.createMany({
        data: updateData.sizes.map((size: any) => ({
          specialtyCalzoneId: id,
          pizzaSizeId: size.pizzaSizeId,
          price: parseFloat(size.price),
          isAvailable: size.isAvailable ?? true
        }))
      });
    }

    // Fetch updated calzone with sizes
    const updatedCalzone = await prisma.specialtyCalzone.findUnique({
      where: { id },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    if (!updatedCalzone) {
      return NextResponse.json(
        { error: 'Calzone not found after update' },
        { status: 404 }
      );
    }

    // Transform response
    const transformedCalzone = {
      id: updatedCalzone.id,
      name: updatedCalzone.calzoneName,
      description: updatedCalzone.calzoneDescription,
      basePrice: updatedCalzone.basePrice,
      category: updatedCalzone.category,
      imageUrl: updatedCalzone.imageUrl,
      ingredients: updatedCalzone.fillings ? 
        (updatedCalzone.fillings.startsWith('[') ? JSON.parse(updatedCalzone.fillings) : updatedCalzone.fillings.split(', ')) : [],
      isActive: updatedCalzone.isActive,
      sortOrder: updatedCalzone.sortOrder,
      createdAt: updatedCalzone.createdAt,
      updatedAt: updatedCalzone.updatedAt,
      sizes: updatedCalzone.sizes.map(size => ({
        id: size.id,
        specialtyPizzaId: size.specialtyCalzoneId,
        pizzaSizeId: size.pizzaSizeId,
        price: size.price,
        isAvailable: size.isAvailable,
        createdAt: size.createdAt,
        updatedAt: size.updatedAt,
        pizzaSize: size.pizzaSize
      }))
    };

    return NextResponse.json(transformedCalzone);
  } catch (error) {
    console.error('Error updating specialty calzone:', error);
    return NextResponse.json(
      { error: 'Failed to update specialty calzone' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specialty calzone
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Calzone ID is required' },
        { status: 400 }
      );
    }

    // Delete calzone (sizes will be cascade deleted)
    await prisma.specialtyCalzone.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Calzone deleted successfully' });
  } catch (error) {
    console.error('Error deleting specialty calzone:', error);
    return NextResponse.json(
      { error: 'Failed to delete specialty calzone' },
      { status: 500 }
    );
  }
}
