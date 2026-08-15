create table public.atoms (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  source text not null,
  type text not null,
  payload jsonb not null,
  created_at timestamptz default now()
);
alter table public.atoms enable row level security;
create policy "allow all for now" on public.atoms for all using (true);
alter publication supabase_realtime add table public.atoms;