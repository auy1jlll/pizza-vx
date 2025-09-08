# 🐳 DOCKER CONTAINER DEPLOYMENT SYSTEM
## Complete Guide for Bulletproof Production Deployments

### 🎯 **OVERVIEW**
This system creates Docker containers locally and deploys them to production, eliminating deployment inconsistencies and enabling reliable rollbacks.

---

## 🚀 **QUICK START**

### **Full Deployment (Recommended)**
```powershell
# Build, test, and deploy in one command
.\deploy-workflow.ps1 -AutoDeploy
```

### **Step-by-Step Deployment**
```powershell
# 1. Build container with automatic version
.\build-container.ps1

# 2. Deploy to production
.\deploy-container.ps1

# 3. Rollback if needed
.\rollback-container.ps1
```

---

## 📋 **AVAILABLE SCRIPTS**

### **1. build-container.ps1** - Build Production Container
```powershell
# Basic build
.\build-container.ps1

# Build specific version
.\build-container.ps1 -Version "v2.1.0"

# Build without testing
.\build-container.ps1 -SkipTest

# Build and push to registry
.\build-container.ps1 -Push
```

### **2. deploy-container.ps1** - Deploy to Production
```powershell
# Deploy latest version
.\deploy-container.ps1

# Deploy specific version
.\deploy-container.ps1 -Version "v2.1.0"

# Deploy without backup
.\deploy-container.ps1 -SkipBackup

# Quick deploy (skip confirmations)
.\deploy-container.ps1 -QuickDeploy
```

### **3. rollback-container.ps1** - Emergency Rollback
```powershell
# Rollback to previous version
.\rollback-container.ps1
```

### **4. deploy-workflow.ps1** - Complete Workflow
```powershell
# Full automated deployment
.\deploy-workflow.ps1 -AutoDeploy

# Build and test only
.\deploy-workflow.ps1

# Custom version with auto-deploy
.\deploy-workflow.ps1 -Version "v2.1.0" -AutoDeploy
```

---

## 🎯 **DEPLOYMENT WORKFLOW**

### **Development to Production Pipeline:**

1. **🔧 Development**
   - Make code changes locally
   - Test with local staging: `.\start-staging-3001.ps1`

2. **🐳 Container Creation**
   - Build production container: `.\build-container.ps1`
   - Test container locally on port 3002

3. **🚀 Production Deployment**
   - Deploy container: `.\deploy-container.ps1`
   - Automatic health checks and rollback if failure

4. **✅ Verification**
   - Production app running at http://91.99.194.255:3000
   - Monitor logs and performance

5. **🔄 Rollback (if needed)**
   - Instant rollback: `.\rollback-container.ps1`
   - Restores previous working version

---

## 🛡️ **SAFETY FEATURES**

### **Built-in Safeguards:**
- ✅ **Automatic Backup** - Previous container backed up before deployment
- ✅ **Health Checks** - Deployment fails if app doesn't start properly
- ✅ **Rollback System** - One-command rollback to previous version
- ✅ **Confirmation Prompts** - Prevents accidental deployments
- ✅ **Error Handling** - Clear error messages and troubleshooting tips

### **Zero-Downtime Features:**
- ✅ **Atomic Deployments** - Complete container switch in seconds
- ✅ **Database Persistence** - Database remains intact during deployments
- ✅ **Environment Consistency** - Same container runs everywhere

---

## 📊 **MONITORING & MANAGEMENT**

### **Check Production Status:**
```powershell
# View container status
ssh root@91.99.194.255 'docker ps'

# View application logs
ssh root@91.99.194.255 'docker logs pizza-app-production -f'

# Check health endpoint
curl http://91.99.194.255:3000/api/health
```

### **Container Management:**
```powershell
# Restart production container
ssh root@91.99.194.255 'docker restart pizza-app-production'

# View container resource usage
ssh root@91.99.194.255 'docker stats pizza-app-production'

# Execute commands in container
ssh root@91.99.194.255 'docker exec -it pizza-app-production sh'
```

---

## 🔧 **CONFIGURATION**

### **Default Settings:**
- **Server:** 91.99.194.255
- **SSH Key:** C:\Users\auy1j\.ssh\greenland1
- **Production Port:** 3000
- **Test Port:** 3002
- **Container Name:** pizza-app-production

### **Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret
- `NEXTAUTH_URL` - Application URL
- `GMAIL_USER` - Email service user
- `GMAIL_APP_PASSWORD` - Email service password

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues:**

**❌ Build Fails:**
```powershell
# Check Docker is running
docker --version

# Ensure clean build
docker system prune -f
.\build-container.ps1
```

**❌ Deployment Fails:**
```powershell
# Check SSH connectivity
ssh root@91.99.194.255 'echo "Connected"'

# Manual rollback
.\rollback-container.ps1

# Check server logs
ssh root@91.99.194.255 'docker logs pizza-app-production'
```

**❌ Health Check Fails:**
```powershell
# Check application logs
ssh root@91.99.194.255 'docker logs pizza-app-production --tail 50'

# Verify database connectivity
ssh root@91.99.194.255 'docker exec pizza-app-production curl http://localhost:3000/api/health'
```

---

## 🎉 **BENEFITS OF THIS SYSTEM**

### **✅ Reliability:**
- Identical environments everywhere
- Automated testing and validation
- Quick rollback capabilities

### **✅ Efficiency:**
- One-command deployments
- Minimal downtime
- Automated backup and restore

### **✅ Safety:**
- No manual server configuration
- Health checks prevent bad deployments
- Version control for containers

---

## 📞 **SUPPORT**

For issues or questions:
1. Check the troubleshooting section above
2. Review container logs for specific errors
3. Test locally before production deployment
4. Use rollback system for immediate recovery

**🍕 Happy Deploying!**
