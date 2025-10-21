# Database Setup Guide

## ⚠️ CRITICAL: Run This Before Using the App

The 500 error you're seeing is likely because **the database tables don't exist yet**.

## Step-by-Step Instructions

### 1. Open Supabase SQL Editor

Go to: https://supabase.com/dashboard/project/yugctpsfsmgmrmeyvrgl/sql

OR

1. Visit https://supabase.com/dashboard
2. Select your project: `yugctpsfsmgmrmeyvrgl`
3. Click **SQL Editor** in the left sidebar

### 2. Create a New Query

Click the **"New Query"** button (green button, top right)

### 3. Copy the SQL Schema

Open the file `supabase-schema.sql` in this repository and copy ALL of its contents.

**Important:** Make sure you copy the ENTIRE file, from the first line to the last line.

### 4. Paste and Run

1. Paste the copied SQL into the SQL Editor
2. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
3. Wait for the query to complete

### 5. Verify Tables Were Created

After running the SQL:

1. Click **"Table Editor"** in the left sidebar
2. You should see two new tables:
   - ✓ `ideas`
   - ✓ `saved_ideas`

If you see these tables, the setup is complete!

## What the SQL Creates

The schema creates:

### Tables
- **ideas**: Stores all generated app ideas
- **saved_ideas**: Stores user's favorited ideas

### Security
- Row Level Security (RLS) enabled
- Users can only access their own data

### Indexes
- Performance indexes for faster queries

### Functions & Triggers
- Auto-update timestamps

## Troubleshooting

### Error: "relation already exists"
This means the tables are already created. You're good to go!

### Error: "permission denied"
Make sure you're using the project owner account.

### Tables not appearing
1. Refresh the page
2. Check the SQL Editor for any error messages
3. Make sure you ran the ENTIRE SQL file

## After Setup

Once the database is set up:

1. Go back to your app: https://ideatorapp.vercel.app
2. Log in
3. Try generating ideas again
4. Should work now! 🎉

## Health Check

Visit this URL to verify everything is working:
https://ideatorapp.vercel.app/api/health

You should see:
```json
{
  "environment": {
    "supabaseUrl": true,
    "supabaseKey": true,
    "geminiKey": true
  },
  "supabase": {
    "connected": true,
    "tablesExist": true,
    "error": null
  }
}
```

If `tablesExist` is `false`, the database schema hasn't been run yet.
