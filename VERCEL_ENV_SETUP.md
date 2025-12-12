# Vercel Environment Variables Setup Guide

## Overview
Vercel allows you to set environment variables for three separate environments:
- **Production** — deployed when you push to main branch
- **Preview** — deployed for pull requests and preview deployments
- **Development** — used for local `vercel env pull` and local development

---

## Step-by-Step: Adding Each Environment Variable

### Access Vercel Environment Variables UI
1. Go to https://vercel.com/dashboard
2. Click your **dietapp** project
3. Go to **Settings** (top navigation bar)
4. Click **Environment Variables** (left sidebar)

---

## Variable 1: MONGO_URI

**Value:** `mongodb+srv://chahd123@cluster0.vspwdt.mongodb.net/dietapp?retryWrites=true`

### How to Add:
1. Click **"Add New"** button
2. **Name:** `MONGO_URI`
3. **Value:** paste the MongoDB connection string above
4. **Environments:** Check all three boxes:
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

**Screenshot reference:**
```
┌─────────────────────────────────────┐
│ Name: MONGO_URI                     │
│ Value: mongodb+srv://chahd123...    │
│                                     │
│ ☑ Production  ☑ Preview  ☑ Dev      │
│              [Save]                 │
└─────────────────────────────────────┘
```

---

## Variable 2: JWT_SECRET

**Value:** `8eHSO/4MsOXDZVHwUcpD5+iAP77CGSI1aXg9akh8k8`

### How to Add:
1. Click **"Add New"** button
2. **Name:** `JWT_SECRET`
3. **Value:** `8eHSO/4MsOXDZVHwUcpD5+iAP77CGSI1aXg9akh8k8`
4. **Environments:** 
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

---

## Variable 3: GOOGLE_CLIENT_ID

**Value:** `183873992354-mau1f8f7955t64co30c3h8do71besbkf.apps.googleusercontent.com`

### How to Add:
1. Click **"Add New"** button
2. **Name:** `GOOGLE_CLIENT_ID`
3. **Value:** `183873992354-mau1f8f7955t64co30c3h8do71besbkf.apps.googleusercontent.com`
4. **Environments:**
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

---

## Variable 4: GOOGLE_CLIENT_SECRET

**Value:** `GOCSPX-FBu6AB4__BSLkZWKnceCp3JVmY`

### How to Add:
1. Click **"Add New"** button
2. **Name:** `GOOGLE_CLIENT_SECRET`
3. **Value:** `GOCSPX-FBu6AB4__BSLkZWKnceCp3JVmY`
4. **Environments:**
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

---

## Variable 5: GMAIL_USER

**Value:** `dietopia62@gmail.com`

### How to Add:
1. Click **"Add New"** button
2. **Name:** `GMAIL_USER`
3. **Value:** `dietopia62@gmail.com`
4. **Environments:**
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

---

## Variable 6: GMAIL_APP_PASSWORD

**Value:** `vyef zijv dmop oskn` (or without spaces: `vyefzijvdmoposkn`)

### How to Add:
1. Click **"Add New"** button
2. **Name:** `GMAIL_APP_PASSWORD`
3. **Value:** `vyef zijv dmop oskn`
4. **Environments:**
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

**⚠️ Important:** If spaces don't work, try removing them: `vyefzijvdmoposkn`

---

## Variable 7: NEXT_PUBLIC_ADMIN_EMAIL

**Value:** `benhamzachadhd6@gmail.com`

### How to Add:
1. Click **"Add New"** button
2. **Name:** `NEXT_PUBLIC_ADMIN_EMAIL`
3. **Value:** `benhamzachadhd6@gmail.com`
4. **Environments:**
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

**Note:** This is a `NEXT_PUBLIC_` variable, so it's visible to the frontend (not secret).

---

## Variable 8: NEXT_PUBLIC_BASE_URL

**Value:** `https://dietapp.vercel.app` (replace `dietapp` with your actual Vercel project name)

### How to Add:
1. Click **"Add New"** button
2. **Name:** `NEXT_PUBLIC_BASE_URL`
3. **Value:** `https://dietapp.vercel.app`
4. **Environments:**
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

**Note:** 
- Replace `dietapp` with your actual project name
- Use `https://` (not http)
- This is used in OAuth redirects and email links

---

## Variable 9: APP_URL

**Value:** `https://dietapp.vercel.app` (same as NEXT_PUBLIC_BASE_URL)

### How to Add:
1. Click **"Add New"** button
2. **Name:** `APP_URL`
3. **Value:** `https://dietapp.vercel.app`
4. **Environments:**
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

---

## Variable 10: FROM_EMAIL (Optional)

**Value:** `noreply@dietfit.com`

### How to Add:
1. Click **"Add New"** button
2. **Name:** `FROM_EMAIL`
3. **Value:** `noreply@dietfit.com`
4. **Environments:**
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

---

## Variable 11: SPOONACULAR_API_KEY (Optional)

**Value:** (your Spoonacular API key, if you have one)

### How to Add:
1. Click **"Add New"** button
2. **Name:** `SPOONACULAR_API_KEY`
3. **Value:** (paste your key if you have one)
4. **Environments:**
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

---

## Variable 12: RESEND_API_KEY (Optional)

**Value:** (your Resend API key, if you have one)

### How to Add:
1. Click **"Add New"** button
2. **Name:** `RESEND_API_KEY`
3. **Value:** (paste your key if you have one)
4. **Environments:**
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **"Save"**

---

## Summary: Environment Checkbox Meanings

| Environment | When Used | Example |
|---|---|---|
| **Production** | Main branch deployments (`git push origin main`) | https://dietapp.vercel.app |
| **Preview** | Pull requests and preview deployments | https://pr-123--dietapp.vercel.app |
| **Development** | Local machine when using `vercel env pull` | localhost:3000 |

### Quick Rule:
- **For ALL 12 variables above:** check all three boxes (Production, Preview, Development)
- This ensures they are available in all deployment scenarios

---

## After Adding All Variables

1. **Verify all 12 variables are listed** in the Environment Variables section
2. **Redeploy your project:**
   - Go to **Deployments**
   - Find the latest deployment
   - Click **"Redeploy"** (or push a new commit to main)
3. **Wait for the build to complete** (2-3 minutes)
4. **Test the `/api/debug` endpoint:**
   ```bash
   curl https://dietapp.vercel.app/api/debug
   ```
   Should return all env vars as `present: true`

---

## Troubleshooting

### Variables not taking effect after adding them?
- **Solution:** Redeploy the project (click "Redeploy" on latest deployment)
- Vercel only applies env vars to NEW deployments

### NEXT_PUBLIC_ variables not available in browser?
- **Solution:** They must be added to Vercel Environment Variables AND prefixed with `NEXT_PUBLIC_`
- Make sure `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_ADMIN_EMAIL` are present

### OAuth fails with "invalid redirect URI"?
- **Solution:** Check that `NEXT_PUBLIC_BASE_URL` matches your actual Vercel URL (e.g., https://dietapp.vercel.app)
- Also update Google Cloud Console with the callback URI: https://dietapp.vercel.app/api/auth/google/callback

### MongoDB connection fails?
- **Solution:** 
  - Verify MONGO_URI is correct (copy from MongoDB Atlas connection string)
  - Ensure MongoDB Atlas allows Vercel IP (Network Access → Add 0.0.0.0/0)
  - Test locally first: `npm start` and check if `/api/meals` returns data

---

## Next Steps
1. Add all 12 variables above to Vercel
2. Check all three boxes (Production, Preview, Development) for each variable
3. Click "Save" for each variable
4. Redeploy the project
5. Test `/api/debug` endpoint to verify all vars loaded
6. Test `/api/meals` endpoint to verify API works
7. Open homepage and test sign-in flow
