#!/usr/bin/env node

/**
 * DevOps System Health Monitor
 * Monitors server health, memory usage, and email service status
 * Prevents crashes and provides early warning systems
 */

const http = require('http');
const https = require('https');
const { exec } = require('child_process');
const os = require('os');

const CONFIG = {
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:3005',
  HEALTH_CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000, // 30 seconds
  MEMORY_THRESHOLD: parseInt(process.env.MEMORY_THRESHOLD) || 80, // 80% of available memory
  CPU_THRESHOLD: parseInt(process.env.CPU_THRESHOLD) || 90, // 90% CPU usage
  EMAIL_TEST_INTERVAL: parseInt(process.env.EMAIL_TEST_INTERVAL) || 300000, // 5 minutes
  ALERT_THRESHOLDS: {
    consecutiveFailures: parseInt(process.env.CONSECUTIVE_FAILURES) || 3,
    responseTime: parseInt(process.env.RESPONSE_TIME_THRESHOLD) || 5000, // 5 seconds
  },
  SHUTDOWN_TIMEOUT: parseInt(process.env.SHUTDOWN_TIMEOUT) || 10000,
};

// Global state
let isMonitoring = false;
let healthCheckInterval = null;
let emailTestInterval = null;
let consecutiveFailures = 0;
let lastHealthStatus = null;
let memoryStats = [];
let cpuStats = [];

// Structured logging with severity levels
const logger = {
  info: (message, data = {}) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`, Object.keys(data).length ? JSON.stringify(data) : ''),
  error: (message, error = {}) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error),
  warn: (message, data = {}) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, Object.keys(data).length ? JSON.stringify(data) : ''),
  debug: (message, data = {}) => process.env.DEBUG && console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, Object.keys(data).length ? JSON.stringify(data) : ''),
  critical: (message, data = {}) => console.error(`[CRITICAL] ${new Date().toISOString()} - ${message}`, Object.keys(data).length ? JSON.stringify(data) : ''),
};

// Graceful shutdown
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

async function gracefulShutdown(signal) {
  logger.info(`Received ${signal}, stopping health monitor...`);

  isMonitoring = false;

  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }

  if (emailTestInterval) {
    clearInterval(emailTestInterval);
    emailTestInterval = null;
  }

  // Give some time for cleanup
  setTimeout(() => {
    logger.info('Health monitor stopped');
    process.exit(0);
  }, 2000);
}

function getSystemMetrics() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercent = Math.round((usedMemory / totalMemory) * 100);

  const loadAverage = os.loadavg();
  const cpuUsagePercent = Math.round((loadAverage[0] / os.cpus().length) * 100);

  return {
    memory: {
      total: Math.round(totalMemory / 1024 / 1024), // MB
      used: Math.round(usedMemory / 1024 / 1024), // MB
      free: Math.round(freeMemory / 1024 / 1024), // MB
      usagePercent: memoryUsagePercent
    },
    cpu: {
      usagePercent: Math.min(cpuUsagePercent, 100), // Cap at 100%
      loadAverage: loadAverage.map(avg => Math.round(avg * 100) / 100)
    },
    uptime: Math.round(os.uptime()),
    platform: os.platform(),
    nodeVersion: process.version
  };
}

function checkThresholds(metrics) {
  const alerts = [];

  if (metrics.memory.usagePercent > CONFIG.MEMORY_THRESHOLD) {
    alerts.push({
      type: 'MEMORY',
      severity: 'HIGH',
      message: `Memory usage is ${metrics.memory.usagePercent}% (threshold: ${CONFIG.MEMORY_THRESHOLD}%)`,
      data: metrics.memory
    });
  }

  if (metrics.cpu.usagePercent > CONFIG.CPU_THRESHOLD) {
    alerts.push({
      type: 'CPU',
      severity: 'HIGH',
      message: `CPU usage is ${metrics.cpu.usagePercent}% (threshold: ${CONFIG.CPU_THRESHOLD}%)`,
      data: metrics.cpu
    });
  }

  return alerts;
}

async function performHealthCheck() {
  const startTime = Date.now();

  try {
    logger.debug('Performing health check...');

    const response = await makeHttpRequest(CONFIG.SERVER_URL + '/api/health');
    const responseTime = Date.now() - startTime;

    const healthData = {
      status: response.statusCode,
      responseTime,
      timestamp: new Date().toISOString()
    };

    // Check for issues
    if (response.statusCode !== 200) {
      consecutiveFailures++;
      logger.warn(`Health check failed`, {
        statusCode: response.statusCode,
        responseTime,
        consecutiveFailures
      });

      if (consecutiveFailures >= CONFIG.ALERT_THRESHOLDS.consecutiveFailures) {
        logger.critical('Multiple consecutive health check failures', {
          consecutiveFailures,
          lastStatus: lastHealthStatus
        });
      }
    } else {
      if (consecutiveFailures > 0) {
        logger.info('Health check recovered', {
          previousFailures: consecutiveFailures,
          responseTime
        });
        consecutiveFailures = 0;
      }

      if (responseTime > CONFIG.ALERT_THRESHOLDS.responseTime) {
        logger.warn('Slow response time detected', {
          responseTime,
          threshold: CONFIG.ALERT_THRESHOLDS.responseTime
        });
      }
    }

    lastHealthStatus = healthData;
    return healthData;

  } catch (error) {
    consecutiveFailures++;
    logger.error('Health check error', {
      error: error.message,
      consecutiveFailures
    });

    return {
      status: 0,
      responseTime: Date.now() - startTime,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function testEmailService() {
  try {
    logger.debug('Testing email service...');

    const response = await makeHttpRequest(CONFIG.SERVER_URL + '/api/test-gmail');
    const emailData = JSON.parse(response.body || '{}');

    const result = {
      success: emailData.serviceInfo?.configured || false,
      timestamp: new Date().toISOString(),
      details: emailData
    };

    if (result.success) {
      logger.info('Email service test passed');
    } else {
      logger.error('Email service test failed', { details: emailData });
    }

    return result;

  } catch (error) {
    logger.error('Email service test error', { error: error.message });
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

function makeHttpRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;

    const req = client.request(url, {
      method: 'GET',
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'DevOps-Health-Monitor/1.0'
      }
    }, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

function startMonitoring() {
  logger.info('Starting DevOps health monitoring', {
    config: CONFIG,
    system: getSystemMetrics()
  });

  isMonitoring = true;

  // Health check interval
  healthCheckInterval = setInterval(async () => {
    if (!isMonitoring) return;

    const metrics = getSystemMetrics();
    const alerts = checkThresholds(metrics);

    // Log alerts
    alerts.forEach(alert => {
      if (alert.severity === 'HIGH') {
        logger.critical(alert.message, alert.data);
      } else {
        logger.warn(alert.message, alert.data);
      }
    });

    // Store metrics for trending
    memoryStats.push({
      timestamp: Date.now(),
      usage: metrics.memory.usagePercent
    });

    cpuStats.push({
      timestamp: Date.now(),
      usage: metrics.cpu.usagePercent
    });

    // Keep only last 100 data points
    if (memoryStats.length > 100) memoryStats.shift();
    if (cpuStats.length > 100) cpuStats.shift();

    // Perform health check
    const healthStatus = await performHealthCheck();

    // Log comprehensive status every 10 checks
    if (Math.random() < 0.1) { // ~10% of the time
      logger.info('System status update', {
        metrics,
        health: healthStatus,
        alerts: alerts.length,
        memoryTrend: calculateTrend(memoryStats),
        cpuTrend: calculateTrend(cpuStats)
      });
    }

  }, CONFIG.HEALTH_CHECK_INTERVAL);

  // Email service test interval
  emailTestInterval = setInterval(async () => {
    if (!isMonitoring) return;

    await testEmailService();
  }, CONFIG.EMAIL_TEST_INTERVAL);

  // Make intervals non-blocking
  if (healthCheckInterval.unref) healthCheckInterval.unref();
  if (emailTestInterval.unref) emailTestInterval.unref();
}

function calculateTrend(data) {
  if (data.length < 10) return 0;

  const recent = data.slice(-10);
  const older = data.slice(-20, -10);

  if (older.length === 0) return 0;

  const recentAvg = recent.reduce((sum, item) => sum + item.usage, 0) / recent.length;
  const olderAvg = older.reduce((sum, item) => sum + item.usage, 0) / older.length;

  return Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
}

function printStatus() {
  const metrics = getSystemMetrics();

  console.log('\n🔧 DevOps Health Monitor Status');
  console.log('=' .repeat(40));
  console.log(`📊 Memory: ${metrics.memory.used}MB / ${metrics.memory.total}MB (${metrics.memory.usagePercent}%)`);
  console.log(`⚡ CPU: ${metrics.cpu.usagePercent}% (Load: ${metrics.cpu.loadAverage.join(', ')})`);
  console.log(`⏱️  Uptime: ${Math.round(metrics.uptime / 3600)}h ${Math.round((metrics.uptime % 3600) / 60)}m`);
  console.log(`🔄 Health Checks: ${consecutiveFailures === 0 ? '✅ All passing' : `❌ ${consecutiveFailures} consecutive failures`}`);
  console.log(`📧 Email Service: ${lastHealthStatus?.status === 200 ? '✅ Operational' : '❌ Issues detected'}`);
  console.log(`📈 Memory Trend: ${calculateTrend(memoryStats)}%`);
  console.log(`📈 CPU Trend: ${calculateTrend(cpuStats)}%`);
  console.log('=' .repeat(40));
}

// Main execution
async function main() {
  try {
    logger.info('Initializing DevOps Health Monitor...');

    // Validate configuration
    if (!CONFIG.SERVER_URL) {
      throw new Error('SERVER_URL environment variable is required');
    }

    // Print initial status
    printStatus();

    // Start monitoring
    startMonitoring();

    // Print status every 5 minutes
    setInterval(printStatus, 5 * 60 * 1000);

    logger.info('DevOps Health Monitor started successfully');

  } catch (error) {
    logger.critical('Failed to start health monitor', { error: error.message });
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--status')) {
  printStatus();
  process.exit(0);
} else if (process.argv.includes('--test-email')) {
  testEmailService().then(() => process.exit(0)).catch(() => process.exit(1));
} else if (process.argv.includes('--health-check')) {
  performHealthCheck().then(() => process.exit(0)).catch(() => process.exit(1));
} else {
  main();
}

module.exports = {
  getSystemMetrics,
  performHealthCheck,
  testEmailService,
  checkThresholds
};
