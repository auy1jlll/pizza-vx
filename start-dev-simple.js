console.log('🚀 Starting minimal Next.js dev server...');

const { spawn } = require('child_process');

// Start Next.js on port 3007 to avoid conflicts
const nextDev = spawn('npx', ['next', 'dev', '--port', '3007'], {
  stdio: 'inherit',
  shell: true
});

nextDev.on('error', (error) => {
  console.error('❌ Failed to start Next.js:', error);
});

nextDev.on('close', (code) => {
  console.log(`📦 Next.js process exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  nextDev.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down...');
  nextDev.kill();
  process.exit(0);
});

console.log('🔧 Use Ctrl+C to stop the server');
