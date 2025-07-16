# 🚀 Postiz Railway Deployment Guide

## 📋 Deployment Progress Tracker

### ✅ COMPLETED
- [x] Set up SSH credentials for GitHub
- [x] Push configuration files to GitHub  
- [x] Clean up conflicting railway-*.toml files
- [x] Railway CLI installed and logged in
- [x] PostgreSQL and Redis databases created in Railway
- [x] Repository ready for Docker deployment
- [x] Linked CLI to Railway project `miraculous-fascination`
- [x] Created service `postiz-app`
- [x] Set all environment variables via CLI
- [x] Generated Railway domain: `https://postiz-app-production.up.railway.app`
- [x] **CRITICAL FIX**: Set `RAILWAY_DOCKERFILE_PATH=Dockerfile.dev` to force Docker build
- [x] **CRITICAL GIT REQUIREMENT**: Must be ahead of commit `484ab226a9d9ad3f719c8bc52af69bb67031ce65` (ThirdPartyController stub fixes) to avoid deployment errors

### 🔄 IN PROGRESS  
- [x] Deploy using Railway CLI with Docker (currently building with Docker instead of Nixpacks)

### 📝 PENDING
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

### STEP 2: Create Service & Deploy ✅
```bash
# Create a new service for the app (COMPLETED ✅)
railway add --service postiz-app

# Deploy current directory using Dockerfile.dev (COMPLETED ✅)
railway up --service postiz-app

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

### STEP 5: 🚨 CRITICAL Docker Configuration Fix ✅
```bash
# PROBLEM: Railway was using Nixpacks instead of Docker
# SOLUTION: Force Railway to use Dockerfile.dev (COMPLETED ✅)
railway variables --set "RAILWAY_DOCKERFILE_PATH=Dockerfile.dev"

# This triggers automatic redeploy with Docker build
# Railway should now show "Using detected Dockerfile!" in logs
```

### STEP 6: Monitor & Test
```bash
# Watch deployment status
railway logs

# View all variables (COMPLETED ✅)
railway variables

# Open in browser
railway open

# Manual redeploy if needed (avoid during active builds)
railway redeploy --yes
```

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### 🚨 CRITICAL: Git Requirements for Deployment
- **Problem:** Deployment fails with ThirdPartyController errors during runtime
- **Root Cause:** Without the stub fixes, the app crashes on startup due to missing third-party controller methods
- **Solution:** Ensure git is ahead of commit `484ab226a9d9ad3f719c8bc52af69bb67031ce65`
  ```bash
  # Check current commit
  git log --oneline -1
  
  # Must be ahead of this commit for stable deployment
  # 484ab22 fix: replace ThirdPartyController methods with safe stubs
  ```
- **Verification:** App should start without ThirdPartyController errors

#### 🚨 CRITICAL: Railway Using Nixpacks Instead of Docker
- **Problem:** "Nixpacks build failed" error despite having Dockerfile.dev
- **Root Cause:** Railway defaults to Nixpacks and doesn't auto-detect custom Dockerfile names
- **Solution:** Set environment variable to force Docker:
  ```bash
  railway variables --set "RAILWAY_DOCKERFILE_PATH=Dockerfile.dev"
  ```
- **Verification:** Look for "Using detected Dockerfile!" in build logs

#### Build Failures (Docker)
- **Problem:** Docker build fails
- **Solution:** Ensure Dockerfile.dev exists in root directory and is properly formatted

#### Service Communication
- **Problem:** Frontend can't reach backend
- **Solution:** Verify all URL environment variables are set correctly

#### Database Connection
- **Problem:** Database connection fails
- **Solution:** Use exact Railway PostgreSQL plugin connection string from dashboard

#### File Uploads
- **Problem:** Image uploads not working
- **Solution:** Set `UPLOAD_DIRECTORY=/uploads` (not `/app/uploads` in Railway)

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

---

## 🎯 **DEPLOYMENT SUMMARY**

### **Successfully Deployed Components:**
- ✅ **Project:** `miraculous-fascination` 
- ✅ **Service:** `postiz-app`
- ✅ **Database:** PostgreSQL with connection string
- ✅ **Cache:** Redis with connection string  
- ✅ **Domain:** https://postiz-app-production.up.railway.app
- ✅ **Build Method:** Docker (Dockerfile.dev) - forced via `RAILWAY_DOCKERFILE_PATH`

### **Key Environment Variables Set:**
```bash
DATABASE_URL=postgresql://postgres:jppYxQceeqESVQehyGHuFHmNBbxWEBTb@yamanote.proxy.rlwy.net:25056/railway
REDIS_URL=redis://default:hjHUdGWpeMkNUympheIeuLBdVauNkcZT@caboose.proxy.rlwy.net:31174
RAILWAY_DOCKERFILE_PATH=Dockerfile.dev  # 🚨 CRITICAL for Docker build
MAIN_URL=https://postiz-app-production.up.railway.app
FRONTEND_URL=https://postiz-app-production.up.railway.app
NEXT_PUBLIC_BACKEND_URL=https://postiz-app-production.up.railway.app/api
NODE_ENV=production
JWT_SECRET=postiz-super-long-random-secret-key-for-production-minimum-32-characters-12345
```

---

---

## 🐛 **CURRENT ISSUE: Port Configuration Problem**

### **Problem Status: PARTIALLY RESOLVED**
- ✅ **Docker Build:** Fixed ThirdPartyController TypeScript errors with stub methods
- ✅ **Deployment:** Successfully deploys to Railway
- ❌ **Frontend Access:** Only shows "App is running" - frontend not accessible

### **Root Cause Analysis:**
The Dockerfile.dev uses a **multi-service architecture**:

1. **Caddy (Port 5000)** - Public reverse proxy
2. **Frontend (Port 4200)** - Next.js application (internal)
3. **Backend (Port 3000)** - NestJS API (internal)
4. **Supervisord** - Manages all services

**Current Issue:** Railway was exposing port 3000 (backend only) instead of port 5000 (Caddy proxy).

### **Architecture Flow:**
```
Internet → Railway (5000) → Caddy → {Frontend (4200), Backend (3000)}
```

### **Attempted Fixes:**
```bash
# Set Railway to expose port 5000 where Caddy runs
railway variables --set "PORT=5000"

# Previous attempt (should be 5000, not 3000)
railway domain --port 5000
```

### **Key Configuration Files:**

#### Dockerfile.dev Architecture:
- **EXPOSE 4200** (should be 5000)
- **CMD ["pnpm", "run", "pm2"]** - Starts supervisord + Caddy + services

#### Caddy Configuration (var/docker/Caddyfile):
```
:5000 {
    handle_path /api/* {
        reverse_proxy * localhost:3000  # Backend
    }
    handle_path /uploads/* {
        root * /uploads/
        file_server
    }
    handle {
        reverse_proxy * localhost:4200  # Frontend
    }
}
```

#### Entrypoint Script (var/docker/entrypoint.sh):
- Waits for ports 4200 and 3000 to be ready
- Starts Caddy on port 5000

### **Next Steps to Try:**

#### Option 1: Fix Dockerfile Port Exposure
```dockerfile
# Change in Dockerfile.dev line 19:
EXPOSE 5000  # Instead of EXPOSE 4200
```

#### Option 2: Verify All Services Start
- Check Railway logs to ensure frontend, backend, and Caddy all start
- Verify supervisord configuration is working

#### Option 3: Simplify Architecture
- Consider single-port deployment if multi-service is problematic
- Modify to serve frontend and backend on same port

### **Environment Variables Status:** ✅ ALL CORRECT
```bash
DATABASE_URL=postgresql://postgres:jpp...@yamanote.proxy.rlwy.net:25056/railway
REDIS_URL=redis://default:hjH...@caboose.proxy.rlwy.net:31174
RAILWAY_DOCKERFILE_PATH=Dockerfile.dev  # ✅ Forces Docker build
PORT=5000  # ✅ Should expose Caddy port
MAIN_URL=https://postiz-app-production.up.railway.app
FRONTEND_URL=https://postiz-app-production.up.railway.app
NEXT_PUBLIC_BACKEND_URL=https://postiz-app-production.up.railway.app/api
NODE_ENV=production
```

### **Current URL Status:**
- **https://postiz-app-production.up.railway.app** → "App is running" (backend only)
- **https://postiz-app-production.up.railway.app/auth/login** → 404 Not Found
- **Expected:** Full Postiz login interface

---

**Last Updated:** July 15, 2025
**Status:** 🔧 Port configuration issue - backend works, frontend not accessible