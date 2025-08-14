const fs = require('fs');
const path = require('path');

// List of files to fix
const files = [
  'src/app/api/admin/sizes/route.ts',
  'src/app/api/admin/crusts/route.ts', 
  'src/app/api/admin/toppings/route.ts',
  'src/app/api/admin/components/route.ts'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`Fixing ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace import
    content = content.replace(
      "import { requireAdmin } from '@/lib/auth';",
      "import { verifyAdminToken } from '@/lib/auth';"
    );
    
    // Replace auth calls in try blocks - more specific patterns
    content = content.replace(
      /try {\s*\/\/ Verify admin authentication\s*requireAdmin\(request\);/g,
      `try {
    // Verify admin authentication
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }`
    );
    
    content = content.replace(
      /try {\s*requireAdmin\(request\);/g,
      `try {
    const user = verifyAdminToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }`
    );
    
    // Remove the redundant Unauthorized error handling since we handle it upfront now
    content = content.replace(
      /if \(error instanceof Error && error\.message\.includes\('Unauthorized'\)\) {\s*return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\s*}\s*/g,
      ''
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('All admin auth files have been fixed!');
