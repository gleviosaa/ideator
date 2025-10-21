# Deployment Checklist for Vercel

## ⚠️ Important: Environment Variables

Your deployment is failing because environment variables are not configured. Follow these steps:

### 1. Go to Vercel Project Settings

Visit: https://vercel.com/[your-username]/ideator/settings/environment-variables

### 2. Add These Environment Variables

Add ALL THREE variables with these exact values:

#### NEXT_PUBLIC_SUPABASE_URL
```
https://yugctpsfsmgmrmeyvrgl.supabase.co
```
**Environments:** ✓ Production, ✓ Preview, ✓ Development

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
```
sb_publishable_pn1GOxi_LiL1n_OvOgp0IA_ksGFWyEY
```
**Environments:** ✓ Production, ✓ Preview, ✓ Development

#### GEMINI_API_KEY
```
AIzaSyCw-yjaMNMZJFApDFwpkT0DE0sTCsU3PxE
```
**Environments:** ✓ Production, ✓ Preview, ✓ Development

### 3. Redeploy

After adding all environment variables:
1. Go to **Deployments** tab
2. Click the **three dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## Database Setup

Make sure you've run the database schema in Supabase:

1. Go to: https://supabase.com/dashboard/project/yugctpsfsmgmrmeyvrgl
2. Click **SQL Editor**
3. Run the entire `supabase-schema.sql` file

---

## Troubleshooting 500 Error

If you're getting a 500 error on `/api/generate-ideas`:

### Check 1: Environment Variables
```bash
# In Vercel dashboard, verify all 3 env vars are set:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- GEMINI_API_KEY
```

### Check 2: Deployment Logs
1. Go to your deployment in Vercel
2. Click **View Function Logs**
3. Look for errors like:
   - "GEMINI_API_KEY is not configured"
   - "Database error"
   - "Unauthorized"

### Check 3: Database Tables
Verify tables exist in Supabase:
- `ideas` table
- `saved_ideas` table

### Check 4: Authentication
Make sure you're logged in before trying to generate ideas.

---

## Quick Fix Steps

1. ✅ Add all 3 environment variables in Vercel
2. ✅ Make sure database schema is set up in Supabase
3. ✅ Redeploy from Vercel dashboard
4. ✅ Clear browser cache and try again
5. ✅ Check deployment logs if still failing

---

## Verification

After redeploying with environment variables:

1. Visit your app: https://ideatorapp.vercel.app
2. Sign up / Log in
3. Try generating ideas with:
   - Free text search
   - Category filters
4. Both should work without 500 errors

---

## Support

If you still have issues after following these steps:

1. Check Vercel deployment logs
2. Check browser console for specific errors
3. Verify environment variables are saved correctly
4. Make sure database schema was run successfully

The most common issue is **missing environment variables** in Vercel!
