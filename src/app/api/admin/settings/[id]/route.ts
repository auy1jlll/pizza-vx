import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { adminLimiter } from '@/lib/simple-rate-limit';

// Delete individual setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
    const limit = adminLimiter.check('admin-settings-delete', ip);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many admin requests. Please slow down.' }, { status: 429 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Setting ID is required' },
        { status: 400 }
      );
    }

    // Delete the setting
    const deletedSetting = await prisma.appSetting.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Setting deleted successfully',
      setting: deletedSetting
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json(
      { error: 'Failed to delete setting' },
      { status: 500 }
    );
  }
}
