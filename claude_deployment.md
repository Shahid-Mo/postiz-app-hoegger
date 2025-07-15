# 🚀 Postiz Railway Deployment Guide

## 📋 Deployment Progress Tracker

### ✅ COMPLETED
- [x] Created Railway configuration files for all 4 services
- [x] Documentation created

### 🔄 IN PROGRESS
- [ ] Set up SSH credentials for GitHub
- [ ] Push configuration files to GitHub

### 📝 PENDING
- [ ] Create Railway project and add database/redis
- [ ] Configure and deploy Backend service
- [ ] Configure and deploy Frontend service  
- [ ] Configure and deploy Workers service
- [ ] Configure and deploy Cron service
- [ ] Test all services working together

---

## 🏗️ Architecture Overview

**Postiz consists of 4 microservices:**

1. **Frontend** (`apps/frontend`) - Web UI (Next.js)
2. **Backend** (`apps/backend`) - API & coordination (NestJS)
3. **Workers** (`apps/workers`) - Background job processing
4. **Cron** (`apps/cron`) - Scheduled tasks

**Shared Resources:**
- **PostgreSQL Database** - Stores all data
- **Redis** - Job queue and caching
- **File Storage** - Local filesystem for uploads

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

## 🎯 Step-by-Step Deployment Plan

### STEP 1: GitHub Setup ⏳
1. Set up SSH credentials for GitHub
2. Push Railway configuration files to repository
3. Verify all files are in GitHub

### STEP 2: Railway Project Setup
1. Create new Railway project
2. Add PostgreSQL database plugin
3. Add Redis plugin
4. Note connection strings

### STEP 3: Service Deployment (Deploy in this order)
1. **Backend Service** (API must be ready first)
2. **Frontend Service** (needs backend URL)
3. **Workers Service** (processes backend jobs)
4. **Cron Service** (schedules backend tasks)

### STEP 4: Environment Configuration
Set these variables for ALL services:
```bash
# Database & Redis (from Railway plugins)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Inter-service communication
FRONTEND_URL=https://postiz-frontend.railway.app
BACKEND_URL=https://postiz-backend.railway.app

# Application settings
NODE_ENV=production
STORAGE_PROVIDER=local
UPLOAD_DIRECTORY=/app/uploads
```

### STEP 5: Testing & Verification
1. Test backend API endpoints
2. Test frontend UI loads
3. Test workers processing jobs
4. Test cron jobs running
5. Test complete user workflow

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