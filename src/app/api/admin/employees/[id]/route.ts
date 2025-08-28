import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    // Update user record
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        isActive: data.isActive,
      },
    });

    // Update employee profile if it exists
    if (data.firstName || data.lastName || data.position || data.department) {
      await prisma.employeeProfile.upsert({
        where: { userId: id },
        update: {
          firstName: data.firstName,
          lastName: data.lastName,
          position: data.position,
          department: data.department,
        },
        create: {
          userId: id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          position: data.position || '',
          department: data.department || '',
          employeeId: `EMP${Date.now()}`,
          isActive: data.isActive ?? true,
          permissions: [],
        },
      });
    }

    return NextResponse.json({ 
      message: 'Employee updated successfully',
      employee: updatedUser 
    });

  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// DELETE - Delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete employee profile first (if exists)
    await prisma.employeeProfile.deleteMany({
      where: { userId: id },
    });

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Employee deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}
