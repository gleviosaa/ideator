# Ideator Setup Guide

## 1. Database Setup

Your Supabase project is already configured. Now you need to set up the database schema.

### Run the Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/yugctpsfsmgmrmeyvrgl
2. Navigate to the **SQL Editor** (on the left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste it into the SQL Editor
6. Click **Run** to execute the schema

This will create:
- `ideas` table - stores all generated app ideas
- `saved_ideas` table - stores user's favorited ideas
- Row Level Security (RLS) policies for data protection
- Indexes for better query performance

## 2. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Get API Key** or **Create API Key**
4. Copy the generated API key
5. Open `.env.local` in your project
6. Replace `your-gemini-api-key-here` with your actual API key

## 3. Environment Variables

Your `.env.local` file is already configured with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yugctpsfsmgmrmeyvrgl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pn1GOxi_LiL1n_OvOgp0IA_ksGFWyEY
GEMINI_API_KEY=your-gemini-api-key-here
```

Just add your Gemini API key!

## 4. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Test the Application

1. **Sign Up**: Create a new account at `/auth/signup`
2. **Login**: Sign in at `/auth/login`
3. **Search**: Try searching for app ideas using:
   - Free-text search: "a social media app for developers"
   - Category filters: Select technology, complexity, etc.
4. **Swipe**: Browse through the generated ideas
5. **Save**: Swipe right or click heart to save ideas
6. **View Details**: Click on any idea to see implementation steps and tech stack

## 6. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **Import Project**
3. Import from GitHub: `gleviosaa/ideator`
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://yugctpsfsmgmrmeyvrgl.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_pn1GOxi_LiL1n_OvOgp0IA_ksGFWyEY`
   - `GEMINI_API_KEY`: Your Gemini API key
5. Click **Deploy**

## Troubleshooting

### Build Errors
If you encounter build errors, make sure:
- All environment variables are set correctly
- You've run `npm install`
- Node.js version is 18 or higher

### Database Errors
If you get database errors:
- Make sure you've run the `supabase-schema.sql` script
- Check that RLS policies are enabled
- Verify your Supabase credentials in `.env.local`

### Authentication Issues
If authentication doesn't work:
- Check Supabase authentication settings
- Make sure email confirmation is disabled for testing (or check your email)
- Verify the `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct

## Support

For issues, check:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
