#!/usr/bin/env node

/**
 * Emergency Server Fix Script
 * 
 * This script implements emergency fixes for the unstable development server.
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class EmergencyFix {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async killAllNodeProcesses() {
    console.log('🛑 Killing all Node.js processes...');
    try {
      await this.runCommand('taskkill /F /IM node.exe', { ignoreError: true });
      console.log('✅ Node processes terminated');
    } catch (error) {
      console.log('⚠️ No Node processes to kill or permission denied');
    }
  }

  async clearNextCache() {
    console.log('🗑️ Clearing Next.js cache...');
    const nextDir = path.join(this.projectRoot, '.next');
    try {
      if (fs.existsSync(nextDir)) {
        await this.runCommand(`Remove-Item -Recurse -Force "${nextDir}"`, { shell: 'powershell' });
        console.log('✅ .next directory cleared');
      } else {
        console.log('ℹ️ No .next directory found');
      }
    } catch (error) {
      console.log('⚠️ Could not clear .next directory:', error.message);
    }
  }

  async clearNodeCache() {
    console.log('🧹 Clearing npm cache...');
    try {
      await this.runCommand('npm cache clean --force');
      console.log('✅ npm cache cleared');
    } catch (error) {
      console.log('⚠️ Could not clear npm cache:', error.message);
    }
  }

  async checkDatabaseConnection() {
    console.log('🗄️ Testing database connection...');
    try {
      // Simple connection test without Prisma
      const { DATABASE_URL } = process.env;
      if (!DATABASE_URL) {
        console.log('❌ DATABASE_URL not found in environment');
        return false;
      }
      
      console.log('✅ DATABASE_URL found:', DATABASE_URL.replace(/:[^:]*@/, ':***@'));
      return true;
    } catch (error) {
      console.log('❌ Database connection test failed:', error.message);
      return false;
    }
  }

  async createSafePackageScript() {
    console.log('📝 Adding safe development script...');
    const packagePath = path.join(this.projectRoot, 'package.json');
    
    try {
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      if (!packageContent.scripts['dev:safe']) {
        packageContent.scripts['dev:safe'] = 'next dev --port 3005';
        packageContent.scripts['dev:debug'] = 'next dev --port 3005 --inspect';
        packageContent.scripts['dev:no-turbo'] = 'next dev --port 3005';
        
        fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
        console.log('✅ Safe development scripts added');
      } else {
        console.log('ℹ️ Safe scripts already exist');
      }
    } catch (error) {
      console.log('⚠️ Could not update package.json:', error.message);
    }
  }

  async testServerStart() {
    console.log('🚀 Testing server startup...');
    
    return new Promise((resolve) => {
      const serverProcess = spawn('npm', ['run', 'dev:safe'], {
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      let isReady = false;
      
      const timeout = setTimeout(() => {
        if (!isReady) {
          serverProcess.kill();
          console.log('❌ Server failed to start within 30 seconds');
          resolve(false);
        }
      }, 30000);

      serverProcess.stdout.on('data', (data) => {
        output += data.toString();
        if (output.includes('Ready in')) {
          isReady = true;
          clearTimeout(timeout);
          serverProcess.kill();
          console.log('✅ Server started successfully');
          resolve(true);
        }
      });

      serverProcess.stderr.on('data', (data) => {
        output += data.toString();
      });

      serverProcess.on('close', (code) => {
        if (!isReady) {
          console.log('❌ Server exited with code:', code);
          console.log('📄 Output:', output.slice(-500)); // Last 500 chars
          clearTimeout(timeout);
          resolve(false);
        }
      });
    });
  }

  async runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const shell = options.shell || (process.platform === 'win32' ? 'cmd' : 'bash');
      const proc = exec(command, { shell }, (error, stdout, stderr) => {
        if (error && !options.ignoreError) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async fullReset() {
    console.log('🚨 EMERGENCY FULL RESET INITIATED\n');
    
    await this.killAllNodeProcesses();
    await this.clearNextCache();
    await this.clearNodeCache();
    await this.checkDatabaseConnection();
    await this.createSafePackageScript();
    
    console.log('\n🧪 Testing server startup...');
    const success = await this.testServerStart();
    
    if (success) {
      console.log('\n🎉 Emergency reset completed successfully!');
      console.log('💡 You can now start the server with:');
      console.log('   npm run dev:safe');
      console.log('   npm run dev:no-turbo (if still having issues)');
    } else {
      console.log('\n💥 Emergency reset failed!');
      console.log('🆘 Manual intervention required:');
      console.log('   1. Check Windows Event Viewer for Node.js crashes');
      console.log('   2. Verify PostgreSQL is running');
      console.log('   3. Check antivirus software interference');
      console.log('   4. Try different port: npm run dev -- --port 3006');
    }
  }

  async quickFix() {
    console.log('⚡ QUICK FIX INITIATED\n');
    
    await this.killAllNodeProcesses();
    await this.clearNextCache();
    
    console.log('\n🚀 Starting server...');
    console.log('Run: npm run dev');
  }

  async diagnose() {
    console.log('🔍 DIAGNOSTIC MODE\n');
    
    console.log('📊 Environment Check:');
    console.log('   Node.js:', process.version);
    console.log('   Platform:', process.platform);
    console.log('   Working Directory:', process.cwd());
    
    await this.checkDatabaseConnection();
    
    // Check for problematic files
    console.log('\n📁 File System Check:');
    const nextExists = fs.existsSync('.next');
    console.log('   .next directory:', nextExists ? 'EXISTS' : 'NOT FOUND');
    
    const packageExists = fs.existsSync('package.json');
    console.log('   package.json:', packageExists ? 'EXISTS' : 'NOT FOUND');
    
    // Check for running processes
    console.log('\n🔍 Process Check:');
    try {
      const { stdout } = await this.runCommand('tasklist /FI "IMAGENAME eq node.exe"', { ignoreError: true });
      if (stdout.includes('node.exe')) {
        console.log('   Node processes: RUNNING');
        console.log('   Consider running: node emergency-fix.js reset');
      } else {
        console.log('   Node processes: NONE');
      }
    } catch (error) {
      console.log('   Process check: FAILED');
    }
  }
}

// CLI interface
const command = process.argv[2];
const fix = new EmergencyFix();

switch (command) {
  case 'reset':
    fix.fullReset();
    break;
  case 'quick':
    fix.quickFix();
    break;
  case 'diagnose':
    fix.diagnose();
    break;
  default:
    console.log('🚨 Emergency Server Fix Tool');
    console.log('\nCommands:');
    console.log('  reset     - Full emergency reset (recommended)');
    console.log('  quick     - Quick fix (kill processes + clear cache)');
    console.log('  diagnose  - Run diagnostics only');
    console.log('\nExample: node emergency-fix.js reset');
    break;
}

module.exports = EmergencyFix;
