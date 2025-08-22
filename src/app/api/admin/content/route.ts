import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createApiResponse, createApiError } from '@/lib/schemas';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'data', 'content');

export async function GET() {
  try {
    // Get all JSON files in the content directory
    const files = await fs.readdir(CONTENT_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const fileDetails = await Promise.all(
      jsonFiles.map(async (filename) => {
        const filePath = path.join(CONTENT_DIR, filename);
        const content = await fs.readFile(filePath, 'utf8');
        const parsed = JSON.parse(content);
        const stats = await fs.stat(filePath);

        return {
          name: filename.replace('.json', ''),
          title: parsed.page?.title || filename.replace('.json', '').replace('-', ' '),
          lastUpdated: parsed.page?.lastUpdated || stats.mtime.toISOString(),
          size: stats.size
        };
      })
    );

    return NextResponse.json(
      createApiResponse({
        files: fileDetails.sort((a, b) => a.name.localeCompare(b.name))
      })
    );
  } catch (error) {
    console.error('Error reading content files:', error);
    return NextResponse.json(
      createApiError('Failed to load content files', 500),
      { status: 500 }
    );
  }
}
