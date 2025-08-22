import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// GET - Get all employees (admin only)
export async function GET(request: NextRequest) {
  try {
    const tokenData = verifyAdminToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employees = await prisma.user.findMany({
      where: { 
        OR: [
          { role: 'EMPLOYEE' },
          { role: 'ADMIN' }
        ]
      },
      include: {
        employeeProfile: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ employees });

  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new employee (admin only)
export async function POST(request: NextRequest) {
  try {
    const tokenData = verifyAdminToken(request);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      email,
      password,
      role = 'EMPLOYEE',
      firstName,
      lastName,
      phone,
      position,
      department,
      employeeId,
      hourlyWage,
      permissions = [],
      emergencyContactName,
      emergencyContactPhone,
      hireDate
    } = data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Check if employee ID already exists
    const existingEmployee = await prisma.employeeProfile.findUnique({
      where: { employeeId }
    });

    if (existingEmployee) {
      return NextResponse.json({ error: 'Employee ID already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and employee profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
          phone,
          role: role as 'EMPLOYEE' | 'ADMIN',
          isActive: true,
          emailVerified: true
        }
      });

      const employeeProfile = await tx.employeeProfile.create({
        data: {
          userId: user.id,
          employeeId,
          firstName,
          lastName,
          position,
          department,
          phone,
          emergencyContactName,
          emergencyContactPhone,
          hireDate: hireDate ? new Date(hireDate) : new Date(),
          hourlyWage: hourlyWage ? parseFloat(hourlyWage) : null,
          permissions,
          isActive: true
        }
      });

      return { user, employeeProfile };
    });

    return NextResponse.json({ 
      message: 'Employee created successfully',
      employee: result 
    });

  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
