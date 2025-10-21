# Quick Start - Ideator

## ✅ Already Configured
- ✓ Supabase Project ID: `yugctpsfsmgmrmeyvrgl`
- ✓ Supabase URL configured in `.env.local`
- ✓ Supabase Anon Key configured in `.env.local`
- ✓ Git repository connected to GitHub

## 🚀 Next Steps (3 minutes)

### Step 1: Set up Database (1 min)
1. Open: https://supabase.com/dashboard/project/yugctpsfsmgmrmeyvrgl/editor
2. Click **SQL Editor** → **New Query**
3. Copy all contents from `supabase-schema.sql`
4. Paste and click **Run**

### Step 2: Get Gemini API Key (1 min)
1. Visit: https://makersuite.google.com/app/apikey
2. Click **Create API Key**
3. Copy the key
4. Open `.env.local` and replace `your-gemini-api-key-here` with your actual key

### Step 3: Run the App (30 sec)
```bash
npm install
npm run dev
```

Open http://localhost:3000 🎉

## 🌐 Deploy to Vercel (5 minutes)

1. Go to https://vercel.com/new
2. Import: `gleviosaa/ideator`
3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://yugctpsfsmgmrmeyvrgl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pn1GOxi_LiL1n_OvOgp0IA_ksGFWyEY
   GEMINI_API_KEY=your-actual-gemini-key
   ```
4. Click **Deploy**

Done! Your app will be live in 2-3 minutes.

## 📖 Full Documentation
See [SETUP.md](./SETUP.md) for detailed instructions and troubleshooting.
