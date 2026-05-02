-- =============================================
-- NIVESH AI — Supabase Database Schema
-- Run this in Supabase → SQL Editor → Run
-- =============================================

-- Users table (one row per app user)
create table if not exists users (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  income       text,
  monthly_sip  integer default 5000,
  risk         text default 'balanced',
  goals        text,   -- JSON array of goal IDs
  created_at   timestamptz default now()
);

-- Chat messages
create table if not exists messages (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references users(id),
  role       text not null,   -- 'user' or 'assistant'
  content    text not null,
  created_at timestamptz default now()
);

-- Investment actions (SIP starts, lumpsum etc)
create table if not exists actions (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references users(id),
  type       text,    -- 'sip_start', 'lumpsum', 'sip_pause'
  fund_name  text,
  amount     integer,
  created_at timestamptz default now()
);

-- Enable Row Level Security (anyone can insert, only owner can read)
alter table users    enable row level security;
alter table messages enable row level security;
alter table actions  enable row level security;

-- Policies: allow all operations (for prototype — tighten for production)
create policy "allow all on users"    on users    for all using (true) with check (true);
create policy "allow all on messages" on messages for all using (true) with check (true);
create policy "allow all on actions"  on actions  for all using (true) with check (true);

-- Done!
-- After running this, copy your Project URL and anon key into:
-- nivesh-ai/public/js/config.js
