# 🔧 DevOps-Grade Password Reset Testing Suite

## 🛡️ Production-Ready Scripts with Crash Prevention & Memory Management

This suite provides enterprise-grade testing tools for the password reset functionality with comprehensive error handling, resource management, and monitoring capabilities.

## 📋 Scripts Overview

### 1. `create-test-user.js` - DevOps User Creation Script
**Features:**
- ✅ Database connection pooling with timeout management
- ✅ Comprehensive error handling with retry logic
- ✅ Memory leak prevention with monitoring
- ✅ Graceful shutdown with resource cleanup
- ✅ Structured logging for production monitoring
- ✅ Environment validation and health checks

**Usage:**
```bash
# Create test user with default settings
node create-test-user.js

# With custom environment variables
DB_TIMEOUT=45000 MAX_RETRIES=5 node create-test-user.js
```

**Configuration:**
```bash
# Environment Variables
DB_TIMEOUT=30000          # Database connection timeout (ms)
MAX_RETRIES=3            # Maximum retry attempts
RETRY_DELAY=1000         # Delay between retries (ms)
SHUTDOWN_TIMEOUT=5000    # Graceful shutdown timeout (ms)
BCRYPT_ROUNDS=10         # Password hashing rounds
```

### 2. `test-password-reset-direct.js` - DevOps Email Testing Script
**Features:**
- ✅ Memory monitoring and leak detection
- ✅ Timeout management for email operations
- ✅ Retry logic with exponential backoff
- ✅ Graceful error recovery
- ✅ Process signal handling
- ✅ Performance metrics collection

**Usage:**
```bash
# Test password reset email
node test-password-reset-direct.js

# With debug logging
DEBUG=true node test-password-reset-direct.js
```

**Configuration:**
```bash
# Environment Variables
EMAIL_TIMEOUT=30000       # Email send timeout (ms)
MAX_RETRIES=3            # Maximum retry attempts
RETRY_DELAY=2000         # Delay between retries (ms)
MEMORY_CHECK_INTERVAL=5000 # Memory monitoring interval (ms)
MAX_MEMORY_INCREASE=104857600 # Max memory increase (100MB)
```

### 3. `devops-monitor.js` - System Health Monitor
**Features:**
- ✅ Real-time system resource monitoring
- ✅ Memory and CPU usage tracking
- ✅ Automated health checks
- ✅ Email service monitoring
- ✅ Alert system for threshold violations
- ✅ Trend analysis and reporting

**Usage:**
```bash
# Start monitoring
node devops-monitor.js

# Check current status
node devops-monitor.js --status

# Test email service
node devops-monitor.js --test-email

# Run health check
node devops-monitor.js --health-check
```

**Configuration:**
```bash
# Environment Variables
SERVER_URL=http://localhost:3005    # Server URL to monitor
HEALTH_CHECK_INTERVAL=30000         # Health check interval (ms)
MEMORY_THRESHOLD=80                 # Memory usage threshold (%)
CPU_THRESHOLD=90                    # CPU usage threshold (%)
EMAIL_TEST_INTERVAL=300000          # Email test interval (ms)
CONSECUTIVE_FAILURES=3              # Alert threshold for failures
RESPONSE_TIME_THRESHOLD=5000        # Response time threshold (ms)
```

### 4. `test-password-reset.html` - DevOps Web Testing Interface
**Features:**
- ✅ Client-side error handling and recovery
- ✅ Real-time performance monitoring
- ✅ Memory usage tracking
- ✅ Retry logic with exponential backoff
- ✅ Visual progress indicators
- ✅ Comprehensive logging

## 🚀 Quick Start

### Prerequisites
```bash
# Ensure Node.js environment variables are set
export DATABASE_URL="postgresql://user:password@localhost:5432/db"
export GMAIL_USER="your-email@gmail.com"
export GMAIL_APP_PASSWORD="your-app-password"
```

### Basic Testing Workflow
```bash
# 1. Start the health monitor
node devops-monitor.js &

# 2. Create a test user
node create-test-user.js

# 3. Test the email functionality
node test-password-reset-direct.js

# 4. Open web interface for manual testing
# Visit: http://localhost:3005/test-password-reset.html
```

## 🛡️ Safety Features

### Memory Management
- **Automatic garbage collection** when memory usage is high
- **Memory leak detection** with trend analysis
- **Process memory monitoring** with configurable thresholds
- **Resource cleanup** on process termination

### Error Handling
- **Comprehensive try-catch blocks** with proper error classification
- **Retry logic** with exponential backoff for transient errors
- **Graceful degradation** when services are unavailable
- **Structured error logging** for debugging and monitoring

### Process Management
- **Signal handling** for SIGINT, SIGTERM, and uncaught exceptions
- **Graceful shutdown** with configurable timeouts
- **Resource cleanup** before process termination
- **Non-blocking operations** to prevent hanging processes

### Network Safety
- **Connection timeouts** to prevent hanging requests
- **Request cancellation** support with AbortController
- **Retry logic** for network-related failures
- **Circuit breaker pattern** for failing services

## 📊 Monitoring & Alerting

### System Metrics
- **Memory usage** (heap, external, RSS)
- **CPU usage** with load average tracking
- **Response times** for API endpoints
- **Error rates** and failure patterns

### Alert Thresholds
- **Memory usage** > 80% of available RAM
- **CPU usage** > 90% of available cores
- **Response time** > 5 seconds
- **Consecutive failures** > 3 attempts

### Logging
- **Structured JSON logging** for all operations
- **Severity levels** (INFO, WARN, ERROR, CRITICAL)
- **Performance metrics** in logs
- **Error context** with stack traces

## 🔧 Configuration

### Environment Variables
```bash
# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/db
DB_TIMEOUT=30000

# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
EMAIL_TIMEOUT=30000

# Monitoring Configuration
MEMORY_THRESHOLD=80
CPU_THRESHOLD=90
HEALTH_CHECK_INTERVAL=30000

# Retry Configuration
MAX_RETRIES=3
RETRY_DELAY=1000
SHUTDOWN_TIMEOUT=5000
```

### Runtime Options
```bash
# Debug mode
DEBUG=true node script.js

# Custom configuration
MEMORY_THRESHOLD=90 CPU_THRESHOLD=95 node devops-monitor.js
```

## 🚨 Troubleshooting

### Common Issues

#### Memory Leaks
```bash
# Check memory usage
node devops-monitor.js --status

# Force garbage collection (if available)
node --expose-gc script.js
```

#### Database Connection Issues
```bash
# Test database connection
node -e "require('./create-test-user.js').testConnection()"

# Check database logs
tail -f /var/log/postgresql/postgresql.log
```

#### Email Service Issues
```bash
# Test email service directly
node devops-monitor.js --test-email

# Check Gmail service configuration
node -e "console.log(require('./src/lib/gmail-service.js').getServiceInfo())"
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=true node script.js

# Check system resources
node devops-monitor.js --status
```

## 📈 Performance Optimization

### Memory Optimization
- **Object pooling** for frequently used objects
- **Stream processing** for large data sets
- **Lazy loading** of modules
- **Weak references** for cache management

### CPU Optimization
- **Non-blocking I/O** operations
- **Worker threads** for CPU-intensive tasks
- **Request batching** to reduce overhead
- **Caching** with TTL expiration

### Network Optimization
- **Connection pooling** for database connections
- **HTTP/2** support for better performance
- **Compression** for response data
- **CDN integration** for static assets

## 🔒 Security Considerations

### Data Protection
- **Environment variable validation**
- **Secure credential handling**
- **Input sanitization**
- **SQL injection prevention**

### Access Control
- **API rate limiting**
- **Authentication requirements**
- **Authorization checks**
- **Audit logging**

### Network Security
- **HTTPS enforcement**
- **CORS configuration**
- **Helmet.js integration**
- **Security headers**

## 📚 API Reference

### Health Monitor API
```javascript
const monitor = require('./devops-monitor.js');

// Get system metrics
const metrics = monitor.getSystemMetrics();

// Perform health check
const health = await monitor.performHealthCheck();

// Test email service
const emailStatus = await monitor.testEmailService();

// Check thresholds
const alerts = monitor.checkThresholds(metrics);
```

### User Creation API
```javascript
const createUser = require('./create-test-user.js');

// Create test user (main function)
await createUser.main();
```

### Email Testing API
```javascript
const emailTest = require('./test-password-reset-direct.js');

// Test email sending
await emailTest.main();

// Send single email
const result = await emailTest.sendPasswordResetEmail(gmailService, 1);
```

## 🤝 Contributing

### Code Standards
- **ESLint configuration** for code quality
- **Prettier** for code formatting
- **Husky** for git hooks
- **Jest** for unit testing

### Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run performance tests
npm run test:performance
```

### Deployment
```bash
# Build for production
npm run build

# Run in production mode
npm start

# Run with PM2
pm2 start ecosystem.config.js
```

## 📞 Support

### Monitoring
- **Real-time dashboards** with Grafana
- **Alert notifications** via Slack/Email
- **Log aggregation** with ELK stack
- **Performance metrics** with Prometheus

### Incident Response
- **Automated alerts** for critical issues
- **Runbooks** for common problems
- **Rollback procedures** for deployments
- **Post-mortem analysis** for incidents

---

## 🎯 DevOps Best Practices Implemented

✅ **Infrastructure as Code** - Configuration management
✅ **Monitoring & Alerting** - Real-time system monitoring
✅ **Error Handling** - Comprehensive error recovery
✅ **Resource Management** - Memory and connection pooling
✅ **Security** - Secure credential handling
✅ **Performance** - Optimized for production use
✅ **Scalability** - Designed for high availability
✅ **Maintainability** - Clean, documented code

**Status:** 🟢 Production Ready with Enterprise-Grade Reliability
