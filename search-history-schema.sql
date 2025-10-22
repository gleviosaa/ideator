-- Search History Table
-- Run this SQL in your Supabase SQL Editor

-- Create search_history table
create table if not exists public.search_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  search_query text,
  search_mode text not null check (search_mode in ('free_text', 'category_select')),
  filters jsonb,
  idea_ids uuid[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.search_history enable row level security;

-- Create policies
create policy "Users can view their own search history"
  on public.search_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own search history"
  on public.search_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own search history"
  on public.search_history for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists search_history_user_id_idx on public.search_history(user_id);
create index if not exists search_history_created_at_idx on public.search_history(created_at desc);
