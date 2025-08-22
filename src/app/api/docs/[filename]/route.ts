import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const filename = url.pathname.split('/').pop();
    
    // Validate filename to prevent path traversal
    const allowedFiles = [
      'ADMIN_USER_GUIDE.md',
      'QUICK_REFERENCE.md', 
      'TECHNICAL_HANDOVER.md',
      'DEPLOYMENT_OPERATIONS.md',
      'README.md'
    ];
    
    if (!filename || !allowedFiles.includes(filename)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    const filePath = path.join(process.cwd(), filename);
    const content = await readFile(filePath, 'utf-8');
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `inline; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Error serving documentation:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
