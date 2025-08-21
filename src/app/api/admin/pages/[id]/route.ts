import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from 'slugify';

// GET /api/admin/pages/[id] - Get single page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const page = await (prisma as any).dynamicPage.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/pages/[id] - Update page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
      status,
      template
    } = body;

    // Update slug if title changed
    let updateData: any = {
      title,
      content,
      excerpt,
      metaTitle: metaTitle || title,
      metaDescription,
      metaKeywords,
      ogImage,
      status,
      template
    };

    // If publishing for the first time, set publishedAt
    if (status === 'PUBLISHED') {
      const currentPage = await (prisma as any).dynamicPage.findUnique({
        where: { id },
        select: { publishedAt: true, status: true }
      });
      
      if (currentPage?.status !== 'PUBLISHED' && !currentPage?.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const page = await (prisma as any).dynamicPage.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/pages/[id] - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await (prisma as any).dynamicPage.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
