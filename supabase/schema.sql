create extension if not exists pgcrypto;

create table if not exists parking_sites (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  location text,
  hourly_rate integer default 2000,
  fixed_rate integer default 5000,
  lost_receipt_fine integer default 10000,
  created_at timestamp with time zone default now()
);

alter table parking_sites
add column if not exists fixed_rate integer default 5000;

create table if not exists vehicle_sessions (
  id uuid primary key default gen_random_uuid(),
  parking_site_id uuid references parking_sites(id),
  plate_number text,
  receipt_number text unique,
  customer_phone text,
  car_type text,
  key_status text,
  blocking_status text,
  rate_type text,
  entry_time timestamp with time zone,
  exit_time timestamp with time zone,
  duration_minutes integer,
  amount_due integer default 0,
  amount_paid integer default 0,
  payment_method text,
  status text,
  source text,
  notes text,
  created_by text,
  checked_out_by text,
  lost_receipt_applied boolean default false,
  lost_receipt_fine_amount integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  vehicle_session_id uuid references vehicle_sessions(id),
  action text,
  description text,
  created_by text,
  created_at timestamp with time zone default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists vehicle_sessions_set_updated_at on vehicle_sessions;

create trigger vehicle_sessions_set_updated_at
before update on vehicle_sessions
for each row
execute procedure set_updated_at();

create index if not exists vehicle_sessions_status_idx on vehicle_sessions(status);
create index if not exists vehicle_sessions_entry_time_idx on vehicle_sessions(entry_time desc);
create index if not exists vehicle_sessions_exit_time_idx on vehicle_sessions(exit_time desc);
create index if not exists activity_logs_vehicle_session_idx on activity_logs(vehicle_session_id);
create index if not exists activity_logs_created_at_idx on activity_logs(created_at desc);

alter table parking_sites disable row level security;
alter table vehicle_sessions disable row level security;
alter table activity_logs disable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on parking_sites to anon, authenticated;
grant select, insert, update, delete on vehicle_sessions to anon, authenticated;
grant select, insert, update, delete on activity_logs to anon, authenticated;

insert into parking_sites (name, location, hourly_rate, fixed_rate, lost_receipt_fine)
values ('Rompact Demo Parking', 'Kampala', 2000, 5000, 10000)
on conflict (name) do update
set
  location = excluded.location,
  hourly_rate = excluded.hourly_rate,
  fixed_rate = excluded.fixed_rate,
  lost_receipt_fine = excluded.lost_receipt_fine;
