import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const customizationGroups = await prisma.customizationGroup.findMany({
      where: { isActive: true },
      include: {
        options: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        },
        category: {
          select: { id: true, name: true, slug: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json(customizationGroups);
  } catch (error) {
    console.error('Error fetching customization groups:', error);
    return NextResponse.json({ error: 'Failed to fetch customization groups' }, { status: 500 });
  }
}