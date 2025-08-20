const fs = require('fs');
const path = require('path');

// Find all remaining alert() calls in admin pages
function findAlerts(dir) {
  const files = fs.readdirSync(dir);
  const alerts = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      alerts.push(...findAlerts(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes('alert(')) {
          alerts.push({
            file: filePath,
            line: index + 1,
            content: line.trim()
          });
        }
      });
    }
  }

  return alerts;
}

console.log('Finding remaining alert() calls in admin pages...\n');

const adminDir = path.join(__dirname, 'src', 'app', 'admin');
const alerts = findAlerts(adminDir);

if (alerts.length === 0) {
  console.log('✅ No alert() calls found in admin pages!');
} else {
  console.log(`Found ${alerts.length} alert() calls to replace:\n`);
  
  alerts.forEach((alert, index) => {
    console.log(`${index + 1}. ${alert.file.replace(__dirname, '')}:${alert.line}`);
    console.log(`   ${alert.content}\n`);
  });
}
