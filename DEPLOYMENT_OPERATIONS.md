# 🚀 Pizza Ordering System - Deployment & Operations Guide

**Version**: 1.0  
**Date**: August 22, 2025  
**Environment**: Production Ready

---

## Pre-Deployment Checklist

### System Requirements
- [ ] **Node.js**: Version 18 or higher
- [ ] **PostgreSQL**: Version 12 or higher
- [ ] **Memory**: Minimum 2GB RAM
- [ ] **Storage**: 10GB available space
- [ ] **Network**: HTTPS-capable domain

### Environment Preparation
- [ ] Production database configured
- [ ] SSL certificates installed
- [ ] Domain name configured
- [ ] Backup systems in place
- [ ] Monitoring tools setup

---

## Production Deployment

### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

### Step 2: Database Setup
```bash
# Create database user
sudo -u postgres createuser --interactive
# Enter username: pizzaapp
# Superuser: n
# Create databases: y
# Create roles: n

# Create database
sudo -u postgres createdb pizzaapp_production

# Set password
sudo -u postgres psql
postgres=# ALTER USER pizzaapp WITH PASSWORD 'secure_password';
postgres=# \q
```

### Step 3: Application Deployment
```bash
# Clone repository
git clone [your-repository-url] /var/www/pizzaapp
cd /var/www/pizzaapp

# Install dependencies
npm install

# Create production environment file
cp .env.example .env.production
```

### Step 4: Environment Configuration
Edit `.env.production`:
```bash
# Database
DATABASE_URL="postgresql://pizzaapp:secure_password@localhost:5432/pizzaapp_production"

# Security
JWT_SECRET="your_super_secure_jwt_secret_here"
NEXTAUTH_SECRET="your_nextauth_secret_here"

# App Configuration
NODE_ENV=production
PORT=3000
```

### Step 5: Database Migration
```bash
# Run migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

### Step 6: Build Application
```bash
# Build for production
npm run build

# Test production build
npm start
```

### Step 7: Process Management
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'pizzaapp',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Reverse Proxy Setup (Nginx)

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Gzip compression
    gzip on;
    gzip_types
        text/plain
        text/css
        text/js
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Image optimization
    location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

---

## Database Backup Strategy

### Automated Backup Script
```bash
#!/bin/bash
# /usr/local/bin/backup-pizza-db.sh

# Configuration
DB_NAME="pizzaapp_production"
DB_USER="pizzaapp"
BACKUP_DIR="/var/backups/pizzaapp"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove old backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Log backup completion
echo "$(date): Database backup completed - backup_$DATE.sql.gz" >> /var/log/pizzaapp-backup.log
```

### Setup Automated Backups
```bash
# Make script executable
chmod +x /usr/local/bin/backup-pizza-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line: 0 2 * * * /usr/local/bin/backup-pizza-db.sh
```

---

## Monitoring & Alerting

### Health Check Script
```bash
#!/bin/bash
# /usr/local/bin/health-check.sh

# Check if application is running
if ! curl -f http://localhost:3000/api/health &> /dev/null; then
    echo "$(date): Application health check failed" >> /var/log/pizzaapp-health.log
    # Restart application
    pm2 restart pizzaapp
    # Send alert (configure email/SMS)
    echo "Pizza app restarted due to health check failure" | mail -s "Pizza App Alert" admin@yourdomain.com
fi

# Check database connectivity
if ! pg_isready -h localhost -U pizzaapp &> /dev/null; then
    echo "$(date): Database health check failed" >> /var/log/pizzaapp-health.log
    # Alert administrators
    echo "Database connectivity issue detected" | mail -s "Pizza App DB Alert" admin@yourdomain.com
fi
```

### Log Monitoring
```bash
# Setup log rotation
cat > /etc/logrotate.d/pizzaapp << EOF
/var/www/pizzaapp/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

---

## Performance Optimization

### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_orders_created_at ON orders(created_at);
CREATE INDEX CONCURRENTLY idx_orders_customer_email ON orders(customer_email);
CREATE INDEX CONCURRENTLY idx_orders_status ON orders(status);
CREATE INDEX CONCURRENTLY idx_order_items_order_id ON order_items(order_id);
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_role ON users(role);

-- Analyze tables for query optimization
ANALYZE orders;
ANALYZE order_items;
ANALYZE users;
```

### Application Performance
```bash
# Configure PM2 for optimal performance
pm2 set pm2:max_memory_threshold 800M
pm2 set pm2:memory_threshold_percentage 0.8

# Enable PM2 monitoring
pm2 install pm2-server-monit
```

---

## Security Configuration

### Firewall Setup
```bash
# Install UFW
sudo apt install ufw

# Configure firewall rules
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

### SSL/TLS Configuration
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### Security Headers
Add to Nginx configuration:
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

---

## Operational Procedures

### Deployment Updates
```bash
#!/bin/bash
# /usr/local/bin/deploy-update.sh

# Navigate to application directory
cd /var/www/pizzaapp

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build

# Restart application with zero downtime
pm2 reload pizzaapp

# Log deployment
echo "$(date): Deployment completed - $(git rev-parse HEAD)" >> /var/log/pizzaapp-deploy.log
```

### Database Maintenance
```bash
#!/bin/bash
# Weekly database maintenance

# Vacuum and analyze database
sudo -u postgres psql pizzaapp_production << EOF
VACUUM ANALYZE;
REINDEX DATABASE pizzaapp_production;
EOF

# Update statistics
sudo -u postgres psql pizzaapp_production << EOF
ANALYZE;
EOF
```

---

## Troubleshooting Guide

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs pizzaapp

# Check port availability
sudo netstat -tulpn | grep :3000

# Check disk space
df -h

# Check memory usage
free -h
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
sudo -u postgres psql pizzaapp_production

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### High Memory Usage
```bash
# Check PM2 processes
pm2 monit

# Restart application
pm2 restart pizzaapp

# Check for memory leaks
pm2 logs pizzaapp --lines 100
```

### Performance Issues
```bash
# Check CPU usage
top

# Check disk I/O
iotop

# Analyze slow queries
sudo -u postgres psql pizzaapp_production
# Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

---

## Maintenance Schedule

### Daily Tasks
- [ ] Monitor application logs
- [ ] Check system resource usage
- [ ] Verify backup completion
- [ ] Review order processing

### Weekly Tasks
- [ ] Update system packages
- [ ] Analyze database performance
- [ ] Review security logs
- [ ] Check SSL certificate status

### Monthly Tasks
- [ ] Full system backup
- [ ] Performance optimization review
- [ ] Security audit
- [ ] Capacity planning review

---

## Emergency Procedures

### Application Downtime
1. **Immediate Response**
   - Check application status: `pm2 status`
   - Review recent logs: `pm2 logs pizzaapp --lines 50`
   - Restart if needed: `pm2 restart pizzaapp`

2. **Investigation**
   - Check system resources
   - Review error logs
   - Verify database connectivity

3. **Communication**
   - Notify stakeholders
   - Update status page
   - Document incident

### Database Issues
1. **Connection Problems**
   - Check PostgreSQL service
   - Verify network connectivity
   - Review connection limits

2. **Performance Issues**
   - Identify slow queries
   - Check for lock contention
   - Consider connection pooling

3. **Data Recovery**
   - Stop application
   - Restore from backup
   - Verify data integrity

---

**System Status**: ✅ Production Ready  
**Deployment Date**: August 22, 2025  
**Next Maintenance**: September 1, 2025

---

*This deployment guide ensures reliable, secure, and maintainable operation of the Pizza Ordering System in production environments.*
