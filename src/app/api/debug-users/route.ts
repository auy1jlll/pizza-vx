import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        name: true
      }
    });

    return Response.json({
      total: allUsers.length,
      users: allUsers
    });
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
