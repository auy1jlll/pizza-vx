import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createApiResponse, createApiError } from '@/lib/schemas';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'data', 'content');

interface RouteParams {
  params: Promise<{
    filename: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { filename } = await params;
    const filePath = path.join(CONTENT_DIR, `${filename}.json`);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        createApiError('Content file not found', 404),
        { status: 404 }
      );
    }

    const content = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(content);

    return NextResponse.json(createApiResponse(parsed));
  } catch (error) {
    console.error('Error reading content file:', error);
    return NextResponse.json(
      createApiError('Failed to load content file', 500),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { filename } = await params;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        createApiError('Content is required', 400),
        { status: 400 }
      );
    }

    // Validate that it's valid JSON
    if (typeof content !== 'object' || !content.page) {
      return NextResponse.json(
        createApiError('Invalid content format - must have a "page" object', 400),
        { status: 400 }
      );
    }

    // Update the lastUpdated field
    content.page.lastUpdated = new Date().toISOString().split('T')[0];

    const filePath = path.join(CONTENT_DIR, `${filename}.json`);
    const jsonContent = JSON.stringify(content, null, 2);

    await fs.writeFile(filePath, jsonContent, 'utf8');

    return NextResponse.json(
      createApiResponse({ 
        message: 'Content saved successfully',
        lastUpdated: content.page.lastUpdated
      })
    );
  } catch (error) {
    console.error('Error saving content file:', error);
    return NextResponse.json(
      createApiError('Failed to save content file', 500),
      { status: 500 }
    );
  }
}
