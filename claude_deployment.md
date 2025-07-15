# 🚀 Postiz Railway Deployment Guide

## 📋 Deployment Progress Tracker

### ✅ COMPLETED
- [x] Set up SSH credentials for GitHub
- [x] Push configuration files to GitHub  
- [x] Clean up conflicting railway-*.toml files
- [x] Railway CLI installed and logged in
- [x] PostgreSQL and Redis databases created in Railway
- [x] Repository ready for Docker deployment

### 🔄 IN PROGRESS  
- [ ] Deploy using Railway CLI with Docker

### 📝 PENDING
- [ ] Configure environment variables via CLI
- [ ] Generate Railway domain
- [ ] Test deployment and verify functionality

---

## 🏗️ Architecture Overview

**Postiz Single Container Deployment:**

**Single Docker Container** containing all services:
1. **Frontend** (`apps/frontend`) - Web UI (Next.js) - Port 4200
2. **Backend** (`apps/backend`) - API & coordination (NestJS) - Port 3000  
3. **Workers** (`apps/workers`) - Background job processing
4. **Cron** (`apps/cron`) - Scheduled tasks

**External Resources:**
- **PostgreSQL Database** - Railway plugin
- **Redis** - Railway plugin  
- **File Storage** - Local filesystem in container

---

## 📁 Railway Configuration Files Created

### Frontend Service (`railway-frontend.toml`)
- **Purpose:** Serves web UI
- **Port:** 4200
- **Build:** `pnpm build:frontend`
- **Start:** `pnpm start:prod:frontend`

### Backend Service (`railway-backend.toml`)
- **Purpose:** Main API and coordination
- **Port:** 3000  
- **Build:** `pnpm build:backend`
- **Start:** `pnpm start:prod:backend`

### Workers Service (`railway-workers.toml`)
- **Purpose:** Process background jobs
- **Port:** None (background service)
- **Build:** `pnpm build:workers`
- **Start:** `pnpm start:prod:workers`

### Cron Service (`railway-cron.toml`)
- **Purpose:** Scheduled tasks
- **Port:** None (background service)
- **Build:** `pnpm build:cron`
- **Start:** `pnpm start:prod:cron`

---

## 🎯 Railway CLI Deployment Steps

### STEP 1: Link to Railway Project ✅
```bash
# Link CLI to your existing Railway project
railway link

# Check current project status  
railway status
```

### STEP 2: Deploy with Docker
```bash
# Deploy current directory using Dockerfile.dev
railway up

# Watch deployment progress
railway logs --build
```

### STEP 3: Set Environment Variables ✅
```bash
# Database connections (COMPLETED ✅)
railway variables --set "DATABASE_URL=postgresql://postgres:jppYxQceeqESVQehyGHuFHmNBbxWEBTb@yamanote.proxy.rlwy.net:25056/railway"
railway variables --set "REDIS_URL=redis://default:hjHUdGWpeMkNUympheIeuLBdVauNkcZT@caboose.proxy.rlwy.net:31174"

# Core application settings (COMPLETED ✅)
railway variables --set "NODE_ENV=production"
railway variables --set "IS_GENERAL=true" 
railway variables --set "JWT_SECRET=postiz-super-long-random-secret-key-for-production-minimum-32-characters-12345"
railway variables --set "STORAGE_PROVIDER=local"
railway variables --set "UPLOAD_DIRECTORY=/uploads"
railway variables --set "NEXT_PUBLIC_UPLOAD_DIRECTORY=/uploads"
railway variables --set "DISABLE_REGISTRATION=false"
railway variables --set "BACKEND_INTERNAL_URL=http://localhost:3000"
```

### STEP 4: Generate Domain & Set URLs ✅
```bash
# Generate Railway domain (COMPLETED ✅)
railway domain
# Result: https://postiz-app-production.up.railway.app

# Set URL variables (COMPLETED ✅)
railway variables --set "MAIN_URL=https://postiz-app-production.up.railway.app"
railway variables --set "FRONTEND_URL=https://postiz-app-production.up.railway.app"
railway variables --set "NEXT_PUBLIC_BACKEND_URL=https://postiz-app-production.up.railway.app/api"
```

### STEP 5: Monitor & Test
```bash
# Watch deployment status
railway logs

# View all variables
railway variables

# Open in browser
railway open

# Redeploy if needed
railway redeploy
```

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### Build Failures
- **Problem:** `pnpm` not found
- **Solution:** Ensure `nixPkgs = ['nodejs']` in railway.toml

#### Service Communication
- **Problem:** Services can't talk to each other
- **Solution:** Use Railway-provided URLs in environment variables

#### Database Connection
- **Problem:** Database connection fails
- **Solution:** Use Railway PostgreSQL plugin connection string

#### File Uploads
- **Problem:** Image uploads not working
- **Solution:** Set `UPLOAD_DIRECTORY=/app/uploads` and ensure directory exists

---

## 📊 Expected Resource Usage

### Frontend Service
- **CPU:** Low (mostly static serving)
- **Memory:** 256MB - 512MB
- **Traffic:** High (user requests)

### Backend Service  
- **CPU:** Medium (API processing)
- **Memory:** 512MB - 1GB
- **Traffic:** Medium (API calls)

### Workers Service
- **CPU:** High (job processing)
- **Memory:** 256MB - 512MB
- **Traffic:** Low (internal only)

### Cron Service
- **CPU:** Low (scheduled tasks)
- **Memory:** 256MB
- **Traffic:** Low (internal only)

---

## 🔗 Useful Railway Links

- **Dashboard:** https://railway.app/dashboard
- **Documentation:** https://docs.railway.app
- **Pricing:** https://railway.app/pricing
- **Status:** https://status.railway.app

---

## 📱 Next Steps After Deployment

1. **Custom Domain:** Add your domain to frontend service
2. **SSL Certificate:** Railway provides automatic HTTPS
3. **Monitoring:** Set up logging and monitoring
4. **Scaling:** Adjust resources based on usage
5. **Backup:** Set up database backups

---

## 🆘 Support & Resources

- **Railway Discord:** https://discord.gg/railway
- **Railway GitHub:** https://github.com/railwayapp
- **Postiz Documentation:** Check project README

---

**Last Updated:** $(date)
**Status:** Setting up GitHub SSH credentials