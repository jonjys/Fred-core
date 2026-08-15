-- Fred Core v1 Schema
create table public.users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique
);

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  device_name text,
  last_seen timestamptz default now()
);

create table public.atoms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  source text not null, -- 'capcut', 'whatsapp', 'swish', 'zendesk'
  type text not null, -- 'video', 'ticket', 'payment', 'color'
  payload jsonb not null,
  created_at timestamptz default now(),
  expires_at timestamptz default now() + interval '7 days'
);

create table public.tunnels (
  id uuid primary key default gen_random_uuid(),
  atom_id uuid references public.atoms(id) on delete cascade,
  device_id uuid references public.devices(id) on delete cascade,
  status text default 'pending', -- pending, delivered, expired
  created_at timestamptz default now()
);

-- RLS
alter table public.users enable row level security;
alter table public.devices enable row level security;
alter table public.atoms enable row level security;
alter table public.tunnels enable row level security;

create policy "Users can only see their own data" on public.atoms for all using (auth.uid() = user_id);
create policy "Users can only see their own data" on public.tunnels for all using (auth.uid() = (select user_id from atoms where id = atom_id));
create policy "Users can only see their own data" on public.devices for all using (auth.uid() = user_id);

-- Realtime
alter publication supabase_realtime add table public.tunnels;
