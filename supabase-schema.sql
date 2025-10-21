-- Create tables for Ideator app
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
-- No need to create a separate users table as we'll use auth.users

-- Ideas table - stores all generated ideas
create table public.ideas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  technology text,
  complexity text,
  time_to_build text,
  monetization text,
  target_audience text,
  implementation_steps jsonb,
  tech_stack jsonb,
  suggestions jsonb,
  search_query text,
  search_mode text, -- 'free_text' or 'category_select'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Saved ideas table - user's favorited ideas
create table public.saved_ideas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  saved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, idea_id)
);

-- Create indexes for better query performance
create index ideas_user_id_idx on public.ideas(user_id);
create index ideas_created_at_idx on public.ideas(created_at desc);
create index saved_ideas_user_id_idx on public.saved_ideas(user_id);
create index saved_ideas_idea_id_idx on public.saved_ideas(idea_id);

-- Enable Row Level Security (RLS)
alter table public.ideas enable row level security;
alter table public.saved_ideas enable row level security;

-- RLS Policies for ideas table
create policy "Users can view their own ideas"
  on public.ideas for select
  using (auth.uid() = user_id);

create policy "Users can insert their own ideas"
  on public.ideas for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own ideas"
  on public.ideas for update
  using (auth.uid() = user_id);

create policy "Users can delete their own ideas"
  on public.ideas for delete
  using (auth.uid() = user_id);

-- RLS Policies for saved_ideas table
create policy "Users can view their own saved ideas"
  on public.saved_ideas for select
  using (auth.uid() = user_id);

create policy "Users can save ideas"
  on public.saved_ideas for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave ideas"
  on public.saved_ideas for delete
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger handle_ideas_updated_at
  before update on public.ideas
  for each row
  execute function public.handle_updated_at();
