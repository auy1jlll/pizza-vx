#!/usr/bin/env node
/**
 * Development Server with Cache Control
 * This script ensures proper cache handling in development vs production
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

console.log('🚀 Starting Pizza VX Development Server...');
console.log(`📍 Environment: ${isDev ? 'Development' : 'Production'}`);
console.log(`🔧 Caching: ${isDev ? 'DISABLED' : 'ENABLED'}`);

// Set development environment variables for cache control
if (isDev) {
  process.env.NEXT_CACHE_DISABLED = 'true';
  process.env.NODE_ENV = 'development';
  console.log('🛑 Cache disabled for development');
}

// Clear development caches if in dev mode
if (isDev) {
  console.log('🧹 Clearing development caches...');
  
  // Clear .next directory
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✅ Cleared .next directory');
  }
  
  // Clear node_modules cache
  const cacheDir = path.join(process.cwd(), 'node_modules', '.cache');
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('✅ Cleared node_modules cache');
  }
  
  // Clear TypeScript build info
  const tsBuildInfo = path.join(process.cwd(), 'tsconfig.tsbuildinfo');
  if (fs.existsSync(tsBuildInfo)) {
    fs.unlinkSync(tsBuildInfo);
    console.log('✅ Cleared TypeScript build info');
  }
}

// Start the Next.js development server
console.log('🌟 Starting Next.js server...');
const nextProcess = spawn('npx', ['next', 'dev', '--port', '3005'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    FORCE_COLOR: '1'
  }
});

nextProcess.on('close', (code) => {
  console.log(`📛 Development server stopped with code ${code}`);
});

nextProcess.on('error', (error) => {
  console.error('❌ Failed to start development server:', error);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down development server...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Terminating development server...');
  nextProcess.kill('SIGTERM');
  process.exit(0);
});
