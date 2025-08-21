/**
 * Server Health Monitor
 * 
 * This script monitors the development server health and provides diagnostics
 * for database connection issues.
 */

const { spawn } = require('child_process');
const http = require('http');

class ServerHealthMonitor {
  constructor() {
    this.serverUrl = 'http://localhost:3005';
    this.checkInterval = 30000; // 30 seconds
    this.monitoring = false;
  }

  async checkServerHealth() {
    return new Promise((resolve) => {
      const req = http.get(`${this.serverUrl}/api/health`, (res) => {
        resolve({
          status: res.statusCode === 200 ? 'healthy' : 'unhealthy',
          statusCode: res.statusCode,
          timestamp: new Date().toISOString()
        });
      });

      req.on('error', () => {
        resolve({
          status: 'down',
          statusCode: 0,
          timestamp: new Date().toISOString()
        });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve({
          status: 'timeout',
          statusCode: 0,
          timestamp: new Date().toISOString()
        });
      });
    });
  }

  async checkDatabaseConnection() {
    try {
      const { safeDbOperation } = require('./src/lib/prisma');
      
      const result = await safeDbOperation(async (prisma) => {
        await prisma.$queryRaw`SELECT 1 as test`;
        return { status: 'connected', timestamp: new Date().toISOString() };
      });
      
      return result;
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async restartServer() {
    console.log('🔄 Attempting to restart development server...');
    
    // Kill existing processes
    try {
      const killProcess = spawn('taskkill', ['/F', '/IM', 'node.exe'], { shell: true });
      await new Promise((resolve) => {
        killProcess.on('close', () => resolve());
      });
      console.log('🛑 Killed existing Node processes');
    } catch (error) {
      console.log('⚠️ No existing processes to kill');
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Start new server
    console.log('🚀 Starting new development server...');
    const serverProcess = spawn('npm', ['run', 'dev'], {
      shell: true,
      detached: false,
      stdio: 'inherit'
    });

    return serverProcess;
  }

  async diagnose() {
    console.log('🔍 Running server diagnostics...\n');

    const serverHealth = await this.checkServerHealth();
    console.log('📊 Server Status:', serverHealth.status);
    console.log('   Status Code:', serverHealth.statusCode);
    console.log('   Timestamp:', serverHealth.timestamp);

    const dbHealth = await this.checkDatabaseConnection();
    console.log('\n🗄️ Database Status:', dbHealth.status);
    if (dbHealth.error) {
      console.log('   Error:', dbHealth.error);
    }
    console.log('   Timestamp:', dbHealth.timestamp);

    // Provide recommendations
    console.log('\n💡 Recommendations:');
    if (serverHealth.status === 'down') {
      console.log('   - Server is down. Restart with: npm run dev');
    }
    if (dbHealth.status === 'disconnected') {
      console.log('   - Database connection lost. Check DATABASE_URL in .env');
      console.log('   - Restart PostgreSQL service if needed');
    }
    if (serverHealth.status === 'healthy' && dbHealth.status === 'connected') {
      console.log('   - ✅ All systems operational');
    }

    return {
      server: serverHealth,
      database: dbHealth,
      overall: serverHealth.status === 'healthy' && dbHealth.status === 'connected' ? 'healthy' : 'issues'
    };
  }

  startMonitoring() {
    if (this.monitoring) {
      console.log('⚠️ Already monitoring');
      return;
    }

    this.monitoring = true;
    console.log('👁️ Starting server health monitoring...');
    console.log(`   Checking every ${this.checkInterval / 1000} seconds`);
    console.log('   Press Ctrl+C to stop\n');

    const monitor = async () => {
      if (!this.monitoring) return;

      const health = await this.diagnose();
      
      if (health.overall !== 'healthy') {
        console.log('\n🚨 Issues detected! Consider running: node server-health.js restart\n');
      }

      setTimeout(monitor, this.checkInterval);
    };

    monitor();

    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping health monitoring...');
      this.monitoring = false;
      process.exit(0);
    });
  }
}

// CLI interface
const command = process.argv[2];
const monitor = new ServerHealthMonitor();

switch (command) {
  case 'check':
    monitor.diagnose().then(() => process.exit(0));
    break;
  case 'restart':
    monitor.restartServer().then(() => {
      console.log('✅ Server restart initiated');
      process.exit(0);
    });
    break;
  case 'monitor':
    monitor.startMonitoring();
    break;
  default:
    console.log('🏥 Server Health Monitor');
    console.log('\nUsage:');
    console.log('  node server-health.js check    - Run health diagnostics');
    console.log('  node server-health.js restart  - Restart development server');
    console.log('  node server-health.js monitor  - Start continuous monitoring');
    break;
}

module.exports = ServerHealthMonitor;
