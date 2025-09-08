# 🚀 Docker Deployment Guide for Pizza Restaurant App

## 🎯 Quick Start (Local Development)

### 1. Build and Run Locally
```powershell
# Build the optimized Docker image
docker build -f Dockerfile.optimized -t pizza-app:latest .

# Run with Docker Compose
docker compose -f docker-compose.production-ready.yml up -d

# Check status
docker compose -f docker-compose.production-ready.yml ps
```

### 2. Quick Deploy Script
```powershell
# Deploy with automatic setup
.\docker-deploy.ps1 -Environment production -Version latest
```

---

## 🚀 Production Deployment Options

### Option 1: Local Build + Server Upload

```powershell
# Step 1: Build locally and deploy to server
.\deploy-to-server.ps1 -ServerIP "your-server-ip" -ServerUser "ubuntu" -SSHKey "path\to\your\key.pem"

# Example:
.\deploy-to-server.ps1 -ServerIP "192.168.1.100" -ServerUser "ubuntu" -DeployPath "/opt/pizza-app"
```

### Option 2: Direct Server Build

```bash
# On your server
git clone https://github.com/your-username/pizza-vx.git
cd pizza-vx

# Copy and configure environment
cp .env.production.template .env.production
# Edit .env.production with your settings

# Deploy
chmod +x docker-deploy.sh
./docker-deploy.sh
```

### Option 3: Container Registry (Recommended)

```powershell
# 1. Build and push to registry
docker build -f Dockerfile.optimized -t your-registry.com/pizza-app:latest .
docker push your-registry.com/pizza-app:latest

# 2. On server, pull and run
docker pull your-registry.com/pizza-app:latest
docker compose -f docker-compose.production-ready.yml up -d
```

---

## 📋 Pre-Deployment Checklist

### ✅ Required Files
- [ ] `Dockerfile.optimized` - Production Docker build
- [ ] `docker-compose.production-ready.yml` - Production compose file
- [ ] `.env.production` - Production environment variables
- [ ] SSL certificates (if using HTTPS)

### ✅ Environment Variables
```bash
# Required
DATABASE_URL=postgresql://user:pass@database:5432/pizzadb
NEXTAUTH_SECRET=your-secret-key-minimum-32-chars
NEXTAUTH_URL=https://your-domain.com

# Email (Optional)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Database
POSTGRES_USER=pizzauser
POSTGRES_PASSWORD=secure-password-here
POSTGRES_DB=pizzadb
```

### ✅ Server Requirements
- Docker 20.10+
- Docker Compose 2.0+
- 2GB+ RAM
- 10GB+ disk space
- Ports 3000, 5432 available

---

## 🛠️ Management Commands

### Container Management
```bash
# View running containers
docker compose -f docker-compose.production-ready.yml ps

# View logs
docker compose -f docker-compose.production-ready.yml logs -f app
docker compose -f docker-compose.production-ready.yml logs -f database

# Restart services
docker compose -f docker-compose.production-ready.yml restart app

# Stop all services
docker compose -f docker-compose.production-ready.yml down

# Update application
docker compose -f docker-compose.production-ready.yml pull app
docker compose -f docker-compose.production-ready.yml up -d app
```

### Database Management
```bash
# Database backup
docker compose -f docker-compose.production-ready.yml exec database pg_dump -U pizzauser pizzadb > backup.sql

# Database restore
docker compose -f docker-compose.production-ready.yml exec -T database psql -U pizzauser pizzadb < backup.sql

# Access database
docker compose -f docker-compose.production-ready.yml exec database psql -U pizzauser pizzadb
```

### Health Monitoring
```bash
# Health check
curl -f http://localhost:3000/api/health

# Container health
docker compose -f docker-compose.production-ready.yml exec app curl -f http://localhost:3000/api/health

# Resource usage
docker stats pizza-app-prod pizza-db-prod
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. App Won't Start
```bash
# Check logs
docker compose -f docker-compose.production-ready.yml logs app

# Check environment variables
docker compose -f docker-compose.production-ready.yml exec app env | grep DATABASE

# Restart with clean state
docker compose -f docker-compose.production-ready.yml down -v
docker compose -f docker-compose.production-ready.yml up -d
```

#### 2. Database Connection Issues
```bash
# Check database health
docker compose -f docker-compose.production-ready.yml exec database pg_isready -U pizzauser

# Check network connectivity
docker compose -f docker-compose.production-ready.yml exec app ping database

# Reset database
docker compose -f docker-compose.production-ready.yml down -v
docker volume rm pizza-postgres-data
docker compose -f docker-compose.production-ready.yml up -d
```

#### 3. Performance Issues
```bash
# Check resource usage
docker stats

# Scale if needed (not applicable for single-instance database)
docker compose -f docker-compose.production-ready.yml up -d --scale app=2
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
- Never commit `.env.production` to git
- Use strong, unique passwords
- Rotate secrets regularly

### 2. Network Security
- Use internal Docker networks
- Expose only necessary ports
- Implement SSL/TLS for production

### 3. Container Security
- Run as non-root user (already implemented)
- Keep base images updated
- Scan for vulnerabilities

---

## 📊 Performance Optimization

### 1. Resource Limits
```yaml
# Add to docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

### 2. Monitoring
```bash
# Resource monitoring
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Application metrics
curl http://localhost:3000/api/metrics
```

---

## 🎉 Success!

Your pizza restaurant app is now containerized and ready for production! 🍕

### Quick Links:
- **Application**: http://your-server:3000
- **Admin Panel**: http://your-server:3000/management-portal
- **Health Check**: http://your-server:3000/api/health

### Support:
If you encounter issues, check the logs and refer to this guide. Your app is production-ready with:
- ✅ Optimized Docker builds
- ✅ Health checks and monitoring  
- ✅ Database persistence
- ✅ Security best practices
- ✅ Easy deployment scripts
