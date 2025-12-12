# Monorepo Deployment Guide - Vercel + Koyeb

## Project Structure
```
projet-framework/
├── frontend/          → Vercel (Next.js)
├── backend/           → Koyeb (Express.js)
└── README.md
```

## Prerequisites
- GitHub account
- Vercel account (free)
- Koyeb account (free)
- MongoDB Atlas (free tier available)
- Google OAuth credentials
- Gmail app password (for email)

---

## PART 1: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Vercel

1. Navigate to the frontend folder in terminal:
```bash
cd frontend
npm install
```

2. Create `.env.local` file (NOT committed to git):
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.koyeb.app/api
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_ADMIN_EMAIL=your-admin@example.com
```

3. Test locally:
```bash
npm run dev
# Visit http://localhost:3000
```

### Step 2: Push to GitHub

Make sure your repo structure is:
```
projet-framework/
├── frontend/
├── backend/
└── .gitignore (should ignore .env.local files)
```

If not using Git yet:
```bash
git init
git add .
git commit -m "Initial commit: monorepo with frontend and backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/projet-framework.git
git push -u origin main
```

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Select your **projet-framework** repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Click "Edit" → Select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Add Environment Variables** (click "Environment Variables"):
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-domain.koyeb.app/api` (we'll update this after Koyeb deployment)
   - `NEXT_PUBLIC_BASE_URL` = `https://your-vercel-app.vercel.app`
   - `NEXT_PUBLIC_ADMIN_EMAIL` = your email

6. Click **"Deploy"**

✅ Your frontend is now live! You'll get a URL like: `https://dietapp.vercel.app`

---

## PART 2: Backend Deployment (Koyeb)

### Step 1: Prepare Backend

1. Navigate to backend folder:
```bash
cd backend
npm install
```

2. Create `.env` file (NOT committed):
```env
PORT=8000
NODE_ENV=production
MONGO_URI=mongodb+srv://your-user:your-password@cluster.mongodb.net/dietapp?retryWrites=true&w=majority
JWT_SECRET=use-a-strong-random-secret-change-this
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password
FROM_EMAIL=noreply@dietfit.com
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
APP_URL=https://your-vercel-domain.vercel.app
```

3. Test locally:
```bash
npm run dev
# Server should run on http://localhost:5000
# Test health: curl http://localhost:5000/api/health
```

### Step 2: Push Backend Code

Make sure backend folder is committed to GitHub.

### Step 3: Deploy to Koyeb

1. Go to https://app.koyeb.com
2. Click **"Create App"**
3. Select **"GitHub"** as source
4. Authorize Koyeb with GitHub
5. Select your **projet-framework** repository
6. Configure the app:
   - **Repository**: your-username/projet-framework
   - **Branch**: main
   - **Dockerfile path**: Leave empty (Koyeb auto-detects Node.js)
   - **Build command**: Leave empty
   - **Run command**: `npm run start` or `node server.js`
   - **HTTP port**: `8000` or `5000`

7. **Add Environment Variables**:
   - `PORT` = `8000`
   - `NODE_ENV` = `production`
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = strong random string
   - `GOOGLE_CLIENT_ID` = your value
   - `GOOGLE_CLIENT_SECRET` = your value
   - `GMAIL_USER` = your email
   - `GMAIL_APP_PASSWORD` = your app password
   - `FROM_EMAIL` = noreply@dietfit.com
   - `NEXT_PUBLIC_BASE_URL` = your Vercel domain
   - `APP_URL` = your Vercel domain

8. Select a region (closest to your users)
9. Click **"Create Service"**

⏳ Koyeb will build and deploy your backend (takes ~2-3 minutes)

✅ You'll get a URL like: `https://your-app-xxxx.koyeb.app`

### Step 4: Update Frontend with Backend URL

1. Go to Vercel dashboard → your project
2. Go to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_URL` to your Koyeb backend URL (e.g., `https://your-app-xxxx.koyeb.app/api`)
4. Click **"Save"**
5. Trigger a redeploy: Go to **Deployments** → Click **"..." → Redeploy**

---

## PART 3: Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Login
3. Create a new cluster (free tier)
4. Choose a region
5. Wait for cluster to be created

### Step 2: Create Database User

1. Go to **Database Access**
2. Click **"Add New User"**
3. Username: your-username
4. Password: strong password
5. Click **"Add User"**

### Step 3: Get Connection String

1. Go to **Clusters** → Click **"Connect"**
2. Click **"Drivers"**
3. Copy the connection string
4. Replace `<username>` and `<password>` with your credentials
5. Replace `myFirstDatabase` with `dietapp`

Example:
```
mongodb+srv://chahd123:password123@cluster0.mongodb.net/dietapp?retryWrites=true&w=majority
```

### Step 4: Allow Koyeb IP

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - For production, enter Koyeb's IP addresses when available

### Step 5: Add to Koyeb

1. Copy your MongoDB connection string
2. Go to Koyeb app → **Environment Variables**
3. Update `MONGO_URI` with your connection string
4. Redeploy

---

## PART 4: Google OAuth Setup

### Step 1: Create OAuth Credentials

1. Go to https://console.cloud.google.com
2. Create a new project
3. Go to **OAuth consent screen**
   - Select "External" user type
   - Fill in app name, email, etc.
   - Add required scopes

4. Go to **Credentials**
   - Click **"Create Credentials"** → **OAuth 2.0 Client IDs**
   - Select "Web application"
   - Add authorized redirect URIs:
     ```
     http://localhost:3000
     http://localhost:5000
     https://your-vercel-domain.vercel.app
     https://your-koyeb-domain.koyeb.app
     ```
   - Click **"Create"**

### Step 2: Copy Credentials

Copy:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Add them to both Vercel and Koyeb environment variables.

---

## PART 5: Email Setup (Gmail)

### Step 1: Create App Password

1. Enable 2-Factor Authentication on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Google will generate a 16-character password
5. Copy it

### Step 2: Add to Koyeb

In Koyeb environment variables:
- `GMAIL_USER` = your-email@gmail.com
- `GMAIL_APP_PASSWORD` = the 16-character password generated above

---

## Testing the Deployment

### Test Backend API
```bash
curl https://your-koyeb-domain.koyeb.app/api/health
# Should return: {"status":"OK","timestamp":"..."}
```

### Test Frontend
1. Visit your Vercel domain
2. Try to sign up, sign in, view meals
3. Check browser console for any API errors

---

## Troubleshooting

### 502 Bad Gateway on Vercel
- Check that `NEXT_PUBLIC_API_URL` is correct
- Verify Koyeb backend is running
- Check Koyeb logs for errors

### Connection timeout to MongoDB
- Check MongoDB connection string in Koyeb env vars
- Verify IP whitelist in MongoDB Atlas
- Check firewall settings

### CORS errors in frontend
- Verify backend CORS settings allow Vercel domain
- Update CORS in `backend/server.js` if needed

### Koyeb deployment fails
- Check `npm run start` works locally
- Verify Node.js version is correct
- Check build logs in Koyeb dashboard

---

## Updating Your Application

### Updating Frontend
```bash
cd frontend
# Make changes
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

### Updating Backend
```bash
cd backend
# Make changes
git add .
git commit -m "Update backend"
git push origin main
# Koyeb auto-deploys
```

---

## Cost Breakdown (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel (Frontend) | $0 | Free tier sufficient for most apps |
| Koyeb (Backend) | $5-10 | Free tier, or small paid plan |
| MongoDB Atlas | $0 | Free tier (5GB storage) |
| Google OAuth | $0 | Free |
| Gmail | $0 | Free |
| **Total** | **$5-10/month** | Very affordable! |

---

## Next Steps

1. ✅ Set up all environment variables
2. ✅ Deploy both frontend and backend
3. ✅ Test all features end-to-end
4. ✅ Monitor logs regularly
5. ✅ Set up error tracking (Sentry)
6. ✅ Enable auto-scaling on Koyeb (if needed)
