# 🚀 VERCEL + KOYEB DEPLOYMENT CHECKLIST

## ✅ Step 1: Code Ready for Deployment
- [x] Code structured (frontend + backend)
- [x] Code committed to GitHub
- [x] Code pushed to `youusef` branch
- [x] Repository: https://github.com/ChahdBhamza/projet-framework

---

## 📋 Step 2: Vercel Frontend Deployment

### Prerequisites
- [x] Vercel account created
- [ ] GitHub repo accessible from Vercel

### Deployment Steps
1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Select **GitHub** → Authorize
4. Find **"projet-framework"** repository
5. Click to import it

**Configure Project:**
- Framework: `Next.js` (auto-detected)
- **Root Directory:** Click **"Edit"** → Select **`frontend/`** folder
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)

**Add Environment Variables:**
```
NEXT_PUBLIC_API_URL = http://localhost:5000/api
NEXT_PUBLIC_BASE_URL = https://dietapp.vercel.app (change to your domain)
NEXT_PUBLIC_ADMIN_EMAIL = your-email@example.com
```

**Click "Deploy"** → ⏳ Wait 2-3 minutes

**After deployment:**
- [ ] You'll get a URL like `https://dietapp.vercel.app`
- [ ] Save this URL (you'll need it for Koyeb)
- [ ] Test that it loads (should show your app)
- [ ] Browser might show API errors (that's OK, backend not deployed yet)

---

## 📋 Step 3: Koyeb Backend Deployment

### Prerequisites
- [ ] Koyeb account created
- [ ] MongoDB connection string ready
- [ ] JWT secret chosen (any random string)
- [ ] Vercel frontend URL from step above

### Get Your Credentials
Before deploying, you need these environment variables:

**Required:**
```
PORT=8000
NODE_ENV=production
MONGO_URI=mongodb+srv://your-username:your-password@cluster.net/dietapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-random-key-change-this
NEXT_PUBLIC_BASE_URL=https://your-vercel-app.vercel.app (from step 2)
APP_URL=https://your-vercel-app.vercel.app (same as above)
```

**Optional (can add later):**
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GMAIL_USER=
GMAIL_APP_PASSWORD=
```

### Deployment Steps

1. Go to https://app.koyeb.com
2. Click **"Create App"**
3. Select **"GitHub"** as source
4. Authorize Koyeb with GitHub (if first time)
5. Select repository: **`projet-framework`**
6. Select branch: **`youusef`**

**Configure Service:**
- App name: `dietapp-backend` (or any name)
- **Root Directory:** `backend/`
- **Build Command:** Leave empty (auto-detect)
- **Run Command:** `npm run start`
- **HTTP Port:** `8000`
- **Region:** Select one closest to you

**Add Environment Variables:**
Click "Add Variable" for each:
```
PORT = 8000
NODE_ENV = production
MONGO_URI = mongodb+srv://...
JWT_SECRET = your-random-secret
NEXT_PUBLIC_BASE_URL = https://your-vercel-app.vercel.app
APP_URL = https://your-vercel-app.vercel.app
```

**For production (can skip initially):**
```
GOOGLE_CLIENT_ID = (optional)
GOOGLE_CLIENT_SECRET = (optional)
GMAIL_USER = (optional)
GMAIL_APP_PASSWORD = (optional)
```

**Click "Create Service"** → ⏳ Wait 3-5 minutes

**After deployment:**
- [ ] Koyeb shows "Service deployed successfully"
- [ ] You'll get a URL like `https://dietapp-backend-xxxxx.koyeb.app`
- [ ] Save this URL
- [ ] Test health: `https://your-koyeb-url/api/health` (should show `{"status":"OK"}`)

---

## 🔗 Step 4: Connect Frontend to Backend

1. Go to Vercel dashboard
2. Find your `projet-framework` project
3. Go to **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_API_URL`
5. Change it from `http://localhost:5000/api` to `https://your-koyeb-backend.koyeb.app/api`
6. Click **Save**

**Redeploy Frontend:**
7. Go to **Deployments** tab
8. Find the latest deployment
9. Click **"..."** → **"Redeploy"**
10. Wait 1-2 minutes for redeploy to complete

---

## ✅ Step 5: Test Everything

### Test Backend
```bash
curl https://your-koyeb-backend.koyeb.app/api/health
```
Should return:
```json
{"status":"OK","timestamp":"2024-12-12T..."}
```

### Test Frontend
1. Visit https://your-vercel-app.vercel.app
2. Should load without errors
3. Try to sign up
4. Open DevTools (F12) → Console → check for errors
5. Check Network tab → API calls should go to Koyeb

---

## 🎯 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **Frontend shows blank page** | Check Vercel build logs. Usually missing dependencies. |
| **502 Bad Gateway** | Backend not running. Check Koyeb logs. |
| **API calls fail** | Check `NEXT_PUBLIC_API_URL` in Vercel env vars. |
| **MongoDB connection error** | Check `MONGO_URI` is correct in Koyeb env vars. |
| **CORS errors** | Check backend is running and accessible at `/api/health` |

---

## 📞 Need Help?

1. **Vercel Logs:** Project → Deployments → Click deployment → View logs
2. **Koyeb Logs:** Service → Logs tab
3. **MongoDB:** Atlas dashboard → Logs tab

---

## 🎉 Success Criteria

- [ ] Vercel app loads
- [ ] Koyeb backend responds to `/api/health`
- [ ] No console errors in browser
- [ ] Can visit sign up page
- [ ] Sign up attempt calls backend (visible in Network tab)

**Once all checked → You're live! 🚀**

---

## 📝 Your URLs

**Frontend:** https://your-vercel-app.vercel.app
**Backend:** https://your-koyeb-backend.koyeb.app
**API:** https://your-koyeb-backend.koyeb.app/api

(Update with actual URLs after deployment)
