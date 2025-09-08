# 🚀 HETZNER SERVER SETUP FOR PIZZA APP

## 📋 WHAT I NEED FROM YOU

### 1. **Hetzner Account & Server Creation**
Please provide me with:

#### Server Details:
- [ ] **Server IP Address** (after you create it)
- [ ] **Server Location** (which Hetzner datacenter?)
- [ ] **Server Size** (recommended: CX31 or CX41 for production)
- [ ] **Operating System** (recommend: Ubuntu 24.04 LTS)

#### Access Credentials:
- [ ] **SSH Username** (usually 'root' for new Hetzner servers)
- [ ] **SSH Private Key** (download after server creation)
- [ ] **Server Password** (if using password auth - not recommended)

### 2. **Domain & DNS Information**
- [ ] **Your Domain Name** (e.g., mypizzarestaurant.com)
- [ ] **DNS Access** (Cloudflare, Hetzner DNS, or domain registrar)
- [ ] **SSL Certificate Preference** (Let's Encrypt auto-setup or custom?)

### 3. **Email Configuration**
- [ ] **Email Provider** (Gmail, Outlook, or Hetzner Mail?)
- [ ] **SMTP Settings** (if using external email service)
- [ ] **Support Email Address** (for customer inquiries)

### 4. **Database Preferences**
- [ ] **Database Location** (on-server PostgreSQL or external like Hetzner DB?)
- [ ] **Backup Strategy** (daily/weekly automated backups?)
- [ ] **Database Size Estimate** (how many menu items/orders expected?)

---

## 🏗️ HETZNER SERVER CREATION STEPS

### Step 1: Create Hetzner Server
1. **Go to:** https://console.hetzner.cloud/
2. **Create Project:** "Pizza Restaurant Production"
3. **Create Server:**
   - **Location:** Choose closest to your customers
   - **Image:** Ubuntu 24.04 LTS
   - **Type:** CX31 (2 vCPU, 8GB RAM) - **$8.06/month**
   - **Networking:** Enable IPv4 & IPv6
   - **SSH Key:** Upload your public key OR create new
   - **Firewall:** We'll configure this later
   - **Name:** pizza-production-server

### Step 2: Configure DNS (Required)
1. **Point your domain to server IP:**
   ```
   A Record: @ → [YOUR_SERVER_IP]
   A Record: www → [YOUR_SERVER_IP]
   ```

### Step 3: Provide Me Access Info
Share with me:
```
Server IP: [IP_ADDRESS]
SSH Username: root
SSH Key: [path to private key file]
Domain: [your-domain.com]
```

---

## 🚀 AUTOMATED DEPLOYMENT PROCESS

Once you provide the info above, I'll run our automated deployment:

### What I'll Do Automatically:
✅ **Server Hardening** - Firewall, security updates, fail2ban
✅ **Docker Installation** - Latest Docker + Docker Compose
✅ **SSL Certificates** - Automatic Let's Encrypt setup
✅ **Database Setup** - PostgreSQL with optimized settings
✅ **App Deployment** - Your pizza app with production config
✅ **Nginx Reverse Proxy** - With gzip, caching, security headers
✅ **Monitoring Setup** - Health checks and log monitoring
✅ **Backup Configuration** - Automated database backups
✅ **Email Integration** - SMTP configuration for orders
✅ **Performance Optimization** - Memory, CPU, and disk optimization

### Deployment Command I'll Run:
```powershell
.\deploy-to-server.ps1 -ServerIP "[YOUR_IP]" -Domain "[YOUR_DOMAIN]" -SSHKey "[KEY_PATH]"
```

---

## 💰 HETZNER COSTS (Monthly)

### Recommended Server: CX31
- **2 vCPU, 8GB RAM, 80GB SSD**
- **Cost:** ~$8.06/month
- **Traffic:** 20TB included
- **Perfect for:** 100-500 concurrent users

### Optional Add-ons:
- **Hetzner Cloud Backup:** +20% server cost (~$1.60/month)
- **Load Balancer:** $5.83/month (if you need high availability)
- **Hetzner DNS:** Free
- **SSL Certificate:** Free (Let's Encrypt)

### Total Monthly Cost: **~$10-15/month**

---

## 🔐 SECURITY FEATURES INCLUDED

- **Automatic Security Updates**
- **SSH Key-Only Access** (no passwords)
- **Firewall:** Only ports 80, 443, 22 open
- **Fail2Ban:** Blocks brute force attempts
- **SSL/TLS Encryption** - A+ rating
- **Database Security:** Non-root user, encrypted connections
- **Application Security:** Docker isolation, security headers

---

## 📊 MONITORING & MAINTENANCE

### Included Monitoring:
- **Application Health Checks**
- **Database Performance Monitoring**
- **SSL Certificate Auto-Renewal**
- **Automatic Backups** (daily database + weekly full)
- **Log Rotation & Management**
- **Resource Usage Alerts**

### Maintenance Tasks (Automated):
- **Security Updates:** Weekly
- **Database Optimization:** Weekly
- **Log Cleanup:** Daily
- **Backup Verification:** Daily
- **SSL Renewal:** Automatic (60 days before expiry)

---

## 🚀 NEXT STEPS

### What You Need To Do:
1. **Create Hetzner account** and server
2. **Purchase/configure domain**
3. **Provide me the details** listed above
4. **I'll handle everything else!**

### Timeline:
- **Server Creation:** 2-3 minutes
- **Initial Setup:** 15-20 minutes (automated)
- **DNS Propagation:** 1-24 hours
- **SSL Certificate:** 2-5 minutes
- **Total Time to Live:** ~30 minutes + DNS wait

---

## 📞 READY TO GO LIVE?

Once you provide the server details, your pizza restaurant will be:
- ✅ **Fully operational**
- ✅ **SSL secured**
- ✅ **Production optimized**
- ✅ **Automatically monitored**
- ✅ **Ready for customers**

**Let's get your pizza business online! 🍕🚀**
