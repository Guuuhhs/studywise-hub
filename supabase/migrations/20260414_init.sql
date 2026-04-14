-- Enable Vector extension
create extension if not exists vector;

-- Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('admin', 'monitor', 'student')) default 'student',
  course_id uuid,
  must_change_password boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Courses Table
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Periods Table
create table public.periods (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses on delete cascade not null,
  name text not null,
  sequence_order integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subjects Table
create table public.subjects (
  id uuid default gen_random_uuid() primary key,
  period_id uuid references public.periods on delete cascade not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Classes Table
create table public.classes (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references public.subjects on delete cascade not null,
  name text not null,
  schedule jsonb, -- e.g. [{"day": "seg", "time": "19:00"}]
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Library Items Table
create table public.library_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  course_id uuid references public.courses on delete cascade,
  period_id uuid references public.periods on delete cascade,
  subject_id uuid references public.subjects on delete cascade,
  file_path text not null,
  file_name text not null,
  content_text text,
  metadata jsonb,
  embedding vector(1536), -- For OpenAI/Standard embeddings
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Academic Events Table
create table public.academic_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_type text check (event_type in ('exam', 'holiday', 'work', 'review', 'event', 'semester_start', 'semester_end')),
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  course_id uuid references public.courses on delete cascade,
  subject_id uuid references public.subjects on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Admin Logs
create table public.admin_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references auth.users on delete set null,
  action text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.periods enable row level security;
alter table public.subjects enable row level security;
alter table public.classes enable row level security;
alter table public.library_items enable row level security;
alter table public.academic_events enable row level security;
alter table public.admin_logs enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create policy "Admins can do everything on courses" on public.courses for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Everyone can view courses" on public.courses for select using (true);

-- (Policies for other tables follow similar pattern)

-- Storage Bucket setup (Note: This is usually done via API/Dashboard, but here's the SQL for reference)
-- insert into storage.buckets (id, name) values ('study-materials', 'study-materials');
