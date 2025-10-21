# Vercel Deployment Guide

## Quick Deploy

### Method 1: Deploy from Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your GitHub repository: `gleviosaa/ideator`
4. Vercel should automatically detect this as a **Next.js** project
5. Add environment variables (see below)
6. Click **Deploy**

### Environment Variables

Add these in Vercel's project settings (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://yugctpsfsmgmrmeyvrgl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pn1GOxi_LiL1n_OvOgp0IA_ksGFWyEY
GEMINI_API_KEY=AIzaSyCw-yjaMNMZJFApDFwpkT0DE0sTCsU3PxE
```

Make sure to add them for:
- ✓ Production
- ✓ Preview (optional)
- ✓ Development (optional)

---

## Troubleshooting

### Error: "No Output Directory named 'public' found"

This error means Vercel isn't detecting your project as Next.js. Here's how to fix it:

#### Solution 1: Override Build Settings in Vercel Dashboard

1. Go to your project in Vercel
2. Click **Settings** → **General**
3. Scroll to **Build & Development Settings**
4. Set the following:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave blank (Next.js default: `.next`)
   - **Install Command**: `npm install`
5. Click **Save**
6. Go to **Deployments** and click **Redeploy**

#### Solution 2: Check vercel.json

The repository includes a `vercel.json` file that should help Vercel detect the framework:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs"
}
```

If this file is missing, create it in the root directory.

#### Solution 3: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

---

### Error: Build fails with environment variable errors

**Problem**: Supabase or Gemini API keys are missing

**Solution**:
1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add all three environment variables (see above)
3. Make sure they're added for "Production"
4. Redeploy

---

### Error: Database/Authentication not working

**Problem**: Database schema not set up in Supabase

**Solution**:
1. Go to https://supabase.com/dashboard/project/yugctpsfsmgmrmeyvrgl
2. Click **SQL Editor** → **New Query**
3. Copy and paste the entire `supabase-schema.sql` file
4. Click **Run**
5. Verify tables are created in **Table Editor**

---

### Error: Build warnings about Node.js version

**Warning**: "Node.js 18 and below are deprecated"

**Solution**: This is just a warning from Supabase. Your app will still work fine. Vercel uses Node.js 20 by default for new deployments.

To explicitly set Node.js version, add to `package.json`:
```json
"engines": {
  "node": ">=20.0.0"
}
```

---

## Verification

After deployment:

1. ✅ Visit your deployment URL
2. ✅ Try signing up for a new account
3. ✅ Test the search functionality
4. ✅ Check if ideas are being generated
5. ✅ Verify saved ideas work

---

## Domain Setup (Optional)

To add a custom domain:

1. Go to your Vercel project
2. Click **Settings** → **Domains**
3. Add your domain
4. Update DNS records as instructed by Vercel

---

## Support

If you still have issues:

1. Check Vercel deployment logs: **Deployments** → Click on failed deployment → **View Function Logs**
2. Check build logs for specific errors
3. Verify all environment variables are set correctly
4. Make sure database schema is set up in Supabase

---

## Success!

Once deployed successfully, your Ideator app will be live at:
- `https://your-project-name.vercel.app`

You can access it from anywhere and share it with others! 🎉
