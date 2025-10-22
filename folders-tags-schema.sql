-- Folders table for organizing ideas
create table if not exists public.folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text default '#6B7280',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tags table
create table if not exists public.tags (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, name)
);

-- Idea folders junction table
create table if not exists public.idea_folders (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  folder_id uuid references public.folders(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(idea_id, folder_id)
);

-- Idea tags junction table
create table if not exists public.idea_tags (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(idea_id, tag_id)
);

-- RLS Policies for folders
alter table public.folders enable row level security;

create policy "Users can view their own folders"
  on public.folders for select
  using (auth.uid() = user_id);

create policy "Users can create their own folders"
  on public.folders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own folders"
  on public.folders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own folders"
  on public.folders for delete
  using (auth.uid() = user_id);

-- RLS Policies for tags
alter table public.tags enable row level security;

create policy "Users can view their own tags"
  on public.tags for select
  using (auth.uid() = user_id);

create policy "Users can create their own tags"
  on public.tags for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own tags"
  on public.tags for delete
  using (auth.uid() = user_id);

-- RLS Policies for idea_folders
alter table public.idea_folders enable row level security;

create policy "Users can view their own idea folders"
  on public.idea_folders for select
  using (
    exists (
      select 1 from public.ideas
      where ideas.id = idea_folders.idea_id
      and ideas.user_id = auth.uid()
    )
  );

create policy "Users can create their own idea folders"
  on public.idea_folders for insert
  with check (
    exists (
      select 1 from public.ideas
      where ideas.id = idea_folders.idea_id
      and ideas.user_id = auth.uid()
    )
  );

create policy "Users can delete their own idea folders"
  on public.idea_folders for delete
  using (
    exists (
      select 1 from public.ideas
      where ideas.id = idea_folders.idea_id
      and ideas.user_id = auth.uid()
    )
  );

-- RLS Policies for idea_tags
alter table public.idea_tags enable row level security;

create policy "Users can view their own idea tags"
  on public.idea_tags for select
  using (
    exists (
      select 1 from public.ideas
      where ideas.id = idea_tags.idea_id
      and ideas.user_id = auth.uid()
    )
  );

create policy "Users can create their own idea tags"
  on public.idea_tags for insert
  with check (
    exists (
      select 1 from public.ideas
      where ideas.id = idea_tags.idea_id
      and ideas.user_id = auth.uid()
    )
  );

create policy "Users can delete their own idea tags"
  on public.idea_tags for delete
  using (
    exists (
      select 1 from public.ideas
      where ideas.id = idea_tags.idea_id
      and ideas.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
create index if not exists idx_folders_user_id on public.folders(user_id);
create index if not exists idx_tags_user_id on public.tags(user_id);
create index if not exists idx_idea_folders_idea_id on public.idea_folders(idea_id);
create index if not exists idx_idea_folders_folder_id on public.idea_folders(folder_id);
create index if not exists idx_idea_tags_idea_id on public.idea_tags(idea_id);
create index if not exists idx_idea_tags_tag_id on public.idea_tags(tag_id);
