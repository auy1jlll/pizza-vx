#!/usr/bin/env node

/**
 * Safe Database Script Runner
 * 
 * This utility runs database scripts without calling prisma.$disconnect(),
 * preventing crashes of the development server.
 * 
 * Usage: node safe-db-runner.js <script-name.js>
 * Example: node safe-db-runner.js create-calzones.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function main() {
  const scriptName = process.argv[2];
  
  if (!scriptName) {
    console.log('❌ Please provide a script name');
    console.log('Usage: node safe-db-runner.js <script-name.js>');
    process.exit(1);
  }

  const scriptPath = path.resolve(scriptName);
  
  if (!fs.existsSync(scriptPath)) {
    console.log(`❌ Script not found: ${scriptPath}`);
    process.exit(1);
  }

  console.log(`🔒 Running script safely: ${scriptName}`);
  console.log(`⚡ Preventing prisma.$disconnect() to keep dev server alive...`);
  
  // Read the script content
  let scriptContent = fs.readFileSync(scriptPath, 'utf8');
  
  // Comment out any prisma.$disconnect() calls
  const modifiedContent = scriptContent.replace(
    /await\s+prisma\.\$disconnect\(\)/g, 
    '// await prisma.$disconnect() // Commented out by safe-db-runner'
  );
  
  // Create a temporary script
  const tempScriptPath = scriptPath.replace('.js', '.safe-temp.js');
  fs.writeFileSync(tempScriptPath, modifiedContent);
  
  console.log(`📝 Created safe temporary script: ${tempScriptPath}`);
  
  // Run the modified script
  const child = spawn('node', [tempScriptPath], {
    stdio: 'inherit',
    shell: true
  });
  
  child.on('close', (code) => {
    // Clean up temporary file
    if (fs.existsSync(tempScriptPath)) {
      fs.unlinkSync(tempScriptPath);
      console.log(`🗑️ Cleaned up temporary script`);
    }
    
    if (code === 0) {
      console.log(`✅ Script completed successfully!`);
      console.log(`🚀 Dev server should still be running safely`);
    } else {
      console.log(`❌ Script exited with code ${code}`);
    }
    
    process.exit(code);
  });
  
  child.on('error', (error) => {
    console.error(`❌ Error running script: ${error.message}`);
    // Clean up temporary file
    if (fs.existsSync(tempScriptPath)) {
      fs.unlinkSync(tempScriptPath);
    }
    process.exit(1);
  });
}

main();
