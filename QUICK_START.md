# Quick Start - Ideator

## ✅ Already Configured
- ✓ Supabase Project ID: `yugctpsfsmgmrmeyvrgl`
- ✓ Supabase URL configured in `.env.local`
- ✓ Supabase Anon Key configured in `.env.local`
- ✓ Gemini API Key configured in `.env.local`
- ✓ Git repository connected to GitHub
- ✓ Build tested and working

## 🚀 Next Steps (2 minutes)

### Step 1: Set up Database (1 min)
1. Open: https://supabase.com/dashboard/project/yugctpsfsmgmrmeyvrgl/editor
2. Click **SQL Editor** → **New Query**
3. Copy all contents from `supabase-schema.sql`
4. Paste and click **Run**

### Step 2: Run the App (30 sec)
```bash
npm install
npm run dev
```

Open http://localhost:3000 🎉

## 🌐 Deploy to Vercel (5 minutes)

1. Go to https://vercel.com/new
2. Import: `gleviosaa/ideator`
3. **IMPORTANT**: Set Framework Preset to **Next.js**
4. Add environment variables (copy from `.env.production.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://yugctpsfsmgmrmeyvrgl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pn1GOxi_LiL1n_OvOgp0IA_ksGFWyEY
   GEMINI_API_KEY=AIzaSyCw-yjaMNMZJFApDFwpkT0DE0sTCsU3PxE
   ```
5. Click **Deploy**

Done! Your app will be live in 2-3 minutes.

### Having deployment issues?
See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed troubleshooting.

## 📖 Full Documentation
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Vercel deployment guide
