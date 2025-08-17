# 🚀 Remote Deployment Guide for Pizza Builder App

## Quick Start Commands

### 1. Check Container Status
```bash
# Check if containers are running
docker-compose ps

# Check specific container health
docker-compose exec app curl http://localhost:3000/api/health
```

### 2. Fix Database Connection Issues
```bash
# Restart database only
docker-compose restart db

# Check database logs
docker-compose logs db

# Test database connection
docker-compose exec db psql -U pizzabuilder -d pizzadb -c "SELECT 1;"
```

### 3. Complete Container Reset
```bash
# Stop everything
docker-compose down

# Remove old containers and networks
docker-compose down --remove-orphans

# Start fresh
docker-compose up -d

# If data is corrupted (⚠️ LOSES ALL DATA)
docker-compose down -v
docker volume prune -f
docker-compose up -d
```

## Remote Deployment Options

### Option 1: VPS/Cloud Server (DigitalOcean, AWS, etc.)

#### Step 1: Server Setup
```bash
# On your remote server (Ubuntu/Debian)
sudo apt update
sudo apt install docker.io docker-compose git curl

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional, to avoid sudo)
sudo usermod -aG docker $USER
```

#### Step 2: Deploy Application
```bash
# Clone repository
git clone https://github.com/auy1jlll/pizzab.git
cd pizzab

# Set up environment
cp .env.production .env
nano .env  # Edit with your production values

# Deploy
chmod +x deploy.sh
./deploy.sh
```

#### Step 3: Domain Setup (Optional)
```bash
# Install Nginx
sudo apt install nginx certbot python3-certbot-nginx

# Configure domain
sudo nano /etc/nginx/sites-available/pizza-app
```

### Option 2: Docker Hub Deployment

#### Build and Push
```bash
# Build production image
docker build -t yourusername/pizza-app:latest .

# Push to Docker Hub
docker login
docker push yourusername/pizza-app:latest
```

#### Remote Server Pull
```bash
# On remote server
docker pull yourusername/pizza-app:latest

# Update docker-compose.yml to use your image
# Replace 'build: .' with 'image: yourusername/pizza-app:latest'

docker-compose up -d
```

### Option 3: Platform as a Service

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## Troubleshooting Common Issues

### 1. Database Connection Lost
```bash
# Check if database is running
docker-compose ps db

# Restart database
docker-compose restart db

# Check database logs for errors
docker-compose logs db | tail -50

# Test connection from app container
docker-compose exec app node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$queryRaw\`SELECT 1\`.then(() => {
  console.log('DB Connected!');
  process.exit(0);
}).catch(err => {
  console.error('DB Error:', err);
  process.exit(1);
});
"
```

### 2. App Won't Start
```bash
# Check app logs
docker-compose logs app | tail -50

# Check if port is in use
netstat -tulpn | grep :3000

# Restart app container
docker-compose restart app

# Rebuild if needed
docker-compose up -d --build app
```

### 3. Network Issues
```bash
# Check networks
docker network ls

# Recreate network
docker-compose down
docker network prune -f
docker-compose up -d
```

### 4. Volume/Permission Issues
```bash
# Check volumes
docker volume ls
docker volume inspect pizza-builder-app_postgres_data

# Fix permissions (if needed)
sudo chown -R 999:999 /var/lib/docker/volumes/pizza-builder-app_postgres_data/_data
```

### 5. Memory/Resource Issues
```bash
# Check resource usage
docker stats

# Clean up unused resources
docker system prune -f
docker volume prune -f
docker image prune -f
```

## Monitoring Commands

### Health Checks
```bash
# Application health
curl http://localhost:3000/api/health

# Database health
docker-compose exec db pg_isready -U pizzabuilder -d pizzadb

# Container status
docker-compose ps
```

### Log Monitoring
```bash
# Follow all logs
docker-compose logs -f

# Follow specific service
docker-compose logs -f app
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100 app
```

### Performance Monitoring
```bash
# Resource usage
docker stats

# Container processes
docker-compose exec app ps aux

# Disk usage
df -h
docker system df
```

## Backup and Restore

### Database Backup
```bash
# Create backup
docker-compose exec db pg_dump -U pizzabuilder -d pizzadb > backup.sql

# Restore backup
docker-compose exec -T db psql -U pizzabuilder -d pizzadb < backup.sql
```

### Full Application Backup
```bash
# Backup volumes
docker run --rm -v pizza-builder-app_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/db-backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v pizza-builder-app_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/db-backup.tar.gz -C /data
```

## Security Considerations

### Production Environment
1. Change all default passwords
2. Use strong NEXTAUTH_SECRET (64 characters)
3. Set up proper firewall rules
4. Use HTTPS with SSL certificates
5. Regular security updates

### Database Security
```bash
# Create read-only user for monitoring
docker-compose exec db psql -U pizzabuilder -d pizzadb -c "
CREATE USER monitor WITH PASSWORD 'monitor_password';
GRANT CONNECT ON DATABASE pizzadb TO monitor;
GRANT USAGE ON SCHEMA public TO monitor;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO monitor;
"
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Separate database server
- Redis for session storage
- CDN for static assets

### Vertical Scaling
```yaml
# In docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

## Quick Recovery Commands

```bash
# Emergency restart
docker-compose restart

# Nuclear option (rebuilds everything)
docker-compose down -v
docker system prune -f
docker-compose up -d --build

# Check everything is working
curl http://localhost:3000/api/health
docker-compose ps
```
