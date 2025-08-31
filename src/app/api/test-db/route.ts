import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'auy1jll@gmail.com' }
    });

    return Response.json({ user: user ? 'found' : 'not found' });
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}
