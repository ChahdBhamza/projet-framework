# 📋 Deployment Checklist

## Pre-Deployment Checklist

### Local Setup
- [ ] Cloned/downloaded project
- [ ] Installed Node.js v18+ 
- [ ] Opened project in VS Code

### Backend Setup
- [ ] Navigated to `backend/` folder
- [ ] Ran `npm install`
- [ ] Created `.env` file (copy from `.env.example`)
- [ ] Added MongoDB URI
- [ ] Added JWT_SECRET
- [ ] Started backend: `npm run dev` (should run on :5000)
- [ ] Tested with: `curl http://localhost:5000/api/health`

### Frontend Setup
- [ ] Navigated to `frontend/` folder
- [ ] Ran `npm install`
- [ ] Created `.env.local` file (copy from `.env.example`)
- [ ] Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- [ ] Started frontend: `npm run dev` (should run on :3000)
- [ ] Opened http://localhost:3000 in browser

### Local Testing
- [ ] Accessed frontend at http://localhost:3000
- [ ] Tried signing up
- [ ] Checked browser console for API errors
- [ ] Checked backend console for request logs
- [ ] Tested at least 3 different features

### Git Setup
- [ ] Initialized git: `git init`
- [ ] Added all files: `git add .`
- [ ] Committed: `git commit -m "Initial commit"`
- [ ] Created GitHub repository
- [ ] Added remote: `git remote add origin <URL>`
- [ ] Pushed code: `git push -u origin main`

---

## Database Setup (MongoDB Atlas)

### Create Account & Cluster
- [ ] Created MongoDB Atlas account
- [ ] Created free cluster
- [ ] Selected region (closest to users)
- [ ] Waited for cluster to initialize (~5 minutes)

### Create Database User
- [ ] Went to Database Access
- [ ] Created new user (username + password)
- [ ] Assigned appropriate permissions
- [ ] Noted down credentials

### Get Connection String
- [ ] Went to Clusters → Connect
- [ ] Selected "Drivers" option
- [ ] Copied connection string
- [ ] Replaced `<username>` and `<password>`
- [ ] Replaced database name with `dietapp`
- [ ] Tested connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/dietapp?retryWrites=true&w=majority`

### Network Access
- [ ] Went to Network Access
- [ ] Added IP addresses (at minimum: 0.0.0.0/0 for development)
- [ ] Verified connection works

---

## External Services Setup

### Google OAuth
- [ ] Went to Google Cloud Console
- [ ] Created new project
- [ ] Set up OAuth consent screen
- [ ] Created OAuth 2.0 credentials
- [ ] Added authorized redirect URIs:
  - [ ] `http://localhost:3000`
  - [ ] `http://localhost:5000`
  - [ ] `https://your-vercel-app.vercel.app`
  - [ ] `https://your-koyeb-app.koyeb.app`
- [ ] Noted `GOOGLE_CLIENT_ID`
- [ ] Noted `GOOGLE_CLIENT_SECRET`

### Gmail (for email sending)
- [ ] Enabled 2-Factor Authentication on Gmail
- [ ] Went to myaccount.google.com/apppasswords
- [ ] Selected Mail & Windows Computer
- [ ] Generated app password
- [ ] Noted the 16-character password
- [ ] Used as `GMAIL_APP_PASSWORD`

---

## Vercel Deployment (Frontend)

### Repository Setup
- [ ] Code pushed to GitHub
- [ ] GitHub repository is public (or authorized Vercel)
- [ ] Main branch contains `frontend/` folder

### Vercel Project Creation
- [ ] Logged into Vercel
- [ ] Clicked "Add New Project"
- [ ] Selected GitHub repository
- [ ] Vercel auto-detected Next.js framework

### Project Configuration
- [ ] Set Root Directory to `frontend/`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`

### Environment Variables (Vercel)
- [ ] Added `NEXT_PUBLIC_API_URL` (initially http://localhost:5000/api)
- [ ] Added `NEXT_PUBLIC_BASE_URL` (your Vercel domain)
- [ ] Added `NEXT_PUBLIC_ADMIN_EMAIL`
- [ ] Verified scope: Production, Preview, Development

### Deployment
- [ ] Clicked "Deploy"
- [ ] Waited for build to complete (~2-3 minutes)
- [ ] Verified deployment succeeded
- [ ] Noted Vercel URL (e.g., `https://dietapp.vercel.app`)

---

## Koyeb Deployment (Backend)

### Service Creation
- [ ] Logged into Koyeb
- [ ] Clicked "Create App"
- [ ] Selected GitHub as source
- [ ] Authorized Koyeb with GitHub access
- [ ] Selected repository
- [ ] Selected `main` branch

### Service Configuration
- [ ] Set Root Directory to `backend/`
- [ ] Left Build Command empty (auto-detect)
- [ ] Set Run Command to `npm run start`
- [ ] Set HTTP Port to `8000`
- [ ] Selected appropriate region

### Environment Variables (Koyeb)
Add all these variables:
- [ ] `PORT` = `8000`
- [ ] `NODE_ENV` = `production`
- [ ] `MONGO_URI` = (your MongoDB connection string)
- [ ] `JWT_SECRET` = (strong random string)
- [ ] `GOOGLE_CLIENT_ID` = (from Google Console)
- [ ] `GOOGLE_CLIENT_SECRET` = (from Google Console)
- [ ] `GMAIL_USER` = (your Gmail email)
- [ ] `GMAIL_APP_PASSWORD` = (16-char app password)
- [ ] `FROM_EMAIL` = `noreply@dietfit.com`
- [ ] `NEXT_PUBLIC_BASE_URL` = (your Vercel domain)
- [ ] `APP_URL` = (your Vercel domain)

### Deployment
- [ ] Clicked "Create Service"
- [ ] Waited for build and deployment (~3-5 minutes)
- [ ] Verified deployment succeeded
- [ ] Noted Koyeb URL (e.g., `https://backend-xxxxx.koyeb.app`)
- [ ] Tested backend health: `/api/health`

---

## Post-Deployment Verification

### Test Backend
- [ ] Visited `https://your-koyeb-app.koyeb.app/api/health`
- [ ] Received `{"status":"OK","timestamp":"..."}` response
- [ ] Checked Koyeb logs for any errors
- [ ] Tested `/api/meals` endpoint
- [ ] Tested auth endpoints with test user

### Update Vercel with Backend URL
- [ ] Got backend URL from Koyeb
- [ ] Went to Vercel project settings
- [ ] Updated `NEXT_PUBLIC_API_URL` to Koyeb backend URL
- [ ] Set it for Production environment
- [ ] Triggered redeploy from Deployments tab

### Test Frontend
- [ ] Visited https://your-vercel-app.vercel.app
- [ ] Signed up with test email
- [ ] Received verification email
- [ ] Verified email successfully
- [ ] Signed in with test account
- [ ] Viewed meals
- [ ] Checked browser DevTools → Network tab for API calls
- [ ] Verified calls go to Koyeb backend

### End-to-End Testing
- [ ] Tested user signup flow
- [ ] Tested email verification
- [ ] Tested sign in/sign out
- [ ] Tested meal browsing
- [ ] Tested orders creation
- [ ] Tested user profile update
- [ ] Tested favorites
- [ ] Tested responsive design (mobile, tablet, desktop)

### Monitor Logs
- [ ] Checked Vercel deployment logs (no build errors)
- [ ] Checked Koyeb service logs (no runtime errors)
- [ ] Checked MongoDB Atlas connection logs
- [ ] Verified no failed API requests

---

## Optional Enhancements

### Performance
- [ ] Enable Vercel Analytics
- [ ] Set up Error Tracking (Sentry)
- [ ] Enable Koyeb Auto-Scaling
- [ ] Configure CDN for static assets
- [ ] Set up database backups

### Security
- [ ] Enabled HTTPS (automatic on Vercel/Koyeb)
- [ ] Rotated JWT_SECRET
- [ ] Updated CORS settings to specific domains
- [ ] Enabled database encryption
- [ ] Set up rate limiting

### Monitoring
- [ ] Set up Vercel alerts
- [ ] Set up Koyeb alerts
- [ ] Set up MongoDB alerts
- [ ] Created monitoring dashboard

---

## Troubleshooting

### If Frontend Won't Load
1. [ ] Check Vercel deployment status
2. [ ] Check browser console for errors
3. [ ] Verify NEXT_PUBLIC_API_URL is correct
4. [ ] Check if backend is running

### If Backend API Returns Errors
1. [ ] Check Koyeb logs
2. [ ] Verify MongoDB connection string
3. [ ] Check all required env variables are set
4. [ ] Test with: `curl https://backend.koyeb.app/api/health`

### If Sign Up/Sign In Fails
1. [ ] Check MongoDB is accessible
2. [ ] Verify JWT_SECRET is same on frontend and backend
3. [ ] Check email settings (Gmail user/password)
4. [ ] Check backend logs for specific error

### If Database Connection Fails
1. [ ] Verify MongoDB connection string format
2. [ ] Check IP is whitelisted in MongoDB Atlas
3. [ ] Verify username and password
4. [ ] Test connection from local machine first

---

## Maintenance Tasks

### Regular (Weekly)
- [ ] Monitor deployment logs
- [ ] Check error rates
- [ ] Verify all features working
- [ ] Monitor database size

### Monthly
- [ ] Review and rotate secrets if needed
- [ ] Check for dependency updates
- [ ] Review performance metrics
- [ ] Backup important data

### As Needed
- [ ] Deploy updates (just git push)
- [ ] Update environment variables
- [ ] Scale up Koyeb if needed
- [ ] Upgrade database tier

---

## Completion Summary

- [ ] ✅ Project restructured into frontend + backend
- [ ] ✅ Local development tested
- [ ] ✅ Code pushed to GitHub
- [ ] ✅ Frontend deployed to Vercel
- [ ] ✅ Backend deployed to Koyeb
- [ ] ✅ Database set up on MongoDB Atlas
- [ ] ✅ External services configured (Google, Gmail)
- [ ] ✅ End-to-end testing completed
- [ ] ✅ System live and operational

## 🎉 You're Live!

Your application is now deployed and live:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.koyeb.app
- **Database:** MongoDB Atlas

Celebrate! 🚀
