# Vercel Deployment Guide

## Pre-Deploy Checklist

### 1. Ensure `.env.local` is **NOT** committed
- Add/verify `.env.local` in your `.gitignore`:
```bash
# Add this to .gitignore if not present
.env.local
.env*.local
```

### 2. Commit and push to GitHub/GitLab/Bitbucket
```bash
git add .
git commit -m "add debug endpoint and env vars"
git push origin main
```

## Vercel Setup Steps

### Step 1: Import Project
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your repository (dietapp)
4. Vercel auto-detects Next.js framework
5. Root Directory: leave default (repository root)
6. Build Command: leave default (`next build`)
7. Output Directory: leave default (`.next`)
8. Environment Variables: (**IMPORTANT** — do this before deploying)

### Step 2: Add Environment Variables on Vercel
In the Vercel project settings, go to **Settings** → **Environment Variables** and add these:

| Variable Name | Value | Type |
|---|---|---|
| MONGO_URI | `mongodb+srv://chahd123@cluster0.vspwdt.mongodb.net/dietapp?retryWrites=true` | Production, Preview, Development |
| JWT_SECRET | `8eHSO/4MsOXDZVHwUcpD5+iAP77CGSI1aXg9akh8k8` | Production, Preview, Development |
| GOOGLE_CLIENT_ID | `183873992354-mau1f8f7955t64co30c3h8do71besbkf.apps.googleusercontent.com` | Production, Preview, Development |
| GOOGLE_CLIENT_SECRET | `GOCSPX-FBu6AB4__BSLkZWKnceCp3JVmY` | Production, Preview, Development |
| GMAIL_USER | `dietopia62@gmail.com` | Production, Preview, Development |
| GMAIL_APP_PASSWORD | `vyef zijv dmop oskn` | Production, Preview, Development |
| NEXT_PUBLIC_ADMIN_EMAIL | `benhamzachadhd6@gmail.com` | Production, Preview, Development |
| NEXT_PUBLIC_BASE_URL | `https://your-app.vercel.app` | Production, Preview, Development |
| APP_URL | `https://your-app.vercel.app` | Production, Preview, Development |
| FROM_EMAIL | `noreply@dietfit.com` | Production, Preview, Development |

**Note:** Replace `your-app` with your actual Vercel project name (e.g., `dietapp.vercel.app`).

### Step 3: MongoDB Atlas Allow Vercel
1. Go to https://cloud.mongodb.com (MongoDB Atlas)
2. Select your cluster
3. Click **Network Access**
4. Add IP: **0.0.0.0/0** (allow all) OR whitelist Vercel IP ranges
5. Save

### Step 4: Google OAuth Callback URI
1. Go to Google Cloud Console https://console.cloud.google.com
2. Find your OAuth app credentials
3. Add Authorized Redirect URI:
   ```
   https://your-app.vercel.app/api/auth/google/callback
   ```
4. Save

### Step 5: Deploy
1. Vercel dashboard: click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Once deployed, Vercel will show your production URL

## Post-Deploy Testing

### Test 1: Check Debug Endpoint
```bash
curl https://your-app.vercel.app/api/debug
```
Should return:
```json
{
  "server": {
    "MONGO_URI": true,
    "JWT_SECRET": true,
    "GOOGLE_CLIENT_ID": true,
    ...
  },
  "public": {
    "NEXT_PUBLIC_BASE_URL": "https://your-app.vercel.app",
    "NEXT_PUBLIC_ADMIN_EMAIL": "benhamzachadhd6@gmail.com"
  }
}
```

### Test 2: Check Meals API
```bash
curl https://your-app.vercel.app/api/meals
```
Should return `200` with meal data (not 404).

### Test 3: Check Homepage
1. Open https://your-app.vercel.app
2. Look for the **debug panel** (bottom-right corner in dev mode)
   - **Note:** Debug panel is dev-only; on production it will not show
   - Use `/api/debug` endpoint instead to verify env vars

### Test 4: Try Sign-In
1. Go to /Signin page
2. Try signing up or signing in
3. Check browser Network tab for API errors

## Troubleshooting

### Issue: API endpoints return 404
- **Cause:** Environment variables not set on Vercel
- **Fix:** Verify all vars are added to Vercel → Settings → Environment Variables
- **Verify:** Call `/api/debug` to check

### Issue: OAuth fails (Google sign-in)
- **Cause:** Redirect URI mismatch or missing env vars
- **Fix:** 
  - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set on Vercel
  - Add `https://your-app.vercel.app/api/auth/google/callback` to Google Cloud OAuth app
  - Verify `NEXT_PUBLIC_BASE_URL` is set to your Vercel URL (https, not http)

### Issue: Database connection fails
- **Cause:** MongoDB Atlas IP whitelist or MONGO_URI incorrect
- **Fix:**
  - Check MongoDB Atlas Network Access allows Vercel
  - Verify MONGO_URI is correct (check Atlas connection string)
  - Test locally with `npm start` to confirm MONGO_URI works

### Issue: Emails not sending
- **Cause:** GMAIL_USER / GMAIL_APP_PASSWORD missing or RESEND_API_KEY not set
- **Fix:**
  - If using Gmail: verify both vars are set on Vercel
  - If using Resend: add RESEND_API_KEY to Vercel env vars
  - Check MongoDB for user records to confirm DB connection works

## Next Steps
1. **Do NOT commit `.env.local`** — add to `.gitignore` if not there
2. Push code to GitHub
3. Go to Vercel and add all env variables listed above
4. Deploy
5. Run the 4 post-deploy tests above
6. Share any errors you see — I can help fix them

---
**Questions?** If deployment fails, share:
- The Vercel build log (copy from Vercel dashboard → Deployments → select failed deploy)
- Any API error messages from browser Network tab
- The `/api/debug` response
