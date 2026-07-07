-- Fix: crypt()/gen_salt() live in Supabase's `extensions` schema, not `public`.
-- The auth RPCs locked search_path to `public` only, so signup/login/password
-- reset all failed with "function gen_salt(unknown) does not exist". Run this
-- once in the SQL Editor to patch the already-created functions in place.

create or replace function rpc_signup(p_name text, p_email text, p_password text)
returns table (id uuid, name text, email text, created_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id uuid;
begin
  if exists (select 1 from customers c where lower(c.email) = lower(p_email)) then
    raise exception 'An account with this email already exists.' using errcode = 'P0001';
  end if;

  insert into customers (name, email, password_hash)
  values (p_name, p_email, crypt(p_password, gen_salt('bf')))
  returning customers.id into v_id;

  return query select c.id, c.name, c.email, c.created_at from customers c where c.id = v_id;
end;
$$;

create or replace function rpc_login(p_email text, p_password text)
returns table (id uuid, name text, email text, created_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
    select c.id, c.name, c.email, c.created_at
    from customers c
    where lower(c.email) = lower(p_email)
      and c.password_hash = crypt(p_password, c.password_hash);
end;
$$;

create or replace function rpc_reset_password(p_email text, p_new_password text)
returns table (id uuid, name text, email text, created_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not exists (select 1 from customers c where lower(c.email) = lower(p_email)) then
    raise exception 'No account found with that email.' using errcode = 'P0001';
  end if;

  update customers c set password_hash = crypt(p_new_password, gen_salt('bf'))
  where lower(c.email) = lower(p_email);

  return query select c.id, c.name, c.email, c.created_at from customers c where lower(c.email) = lower(p_email);
end;
$$;

create or replace function rpc_change_password(p_customer_id uuid, p_current_password text, p_new_password text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_match boolean;
begin
  select (password_hash = crypt(p_current_password, password_hash)) into v_match
  from customers where id = p_customer_id;

  if v_match is null then
    raise exception 'Account not found.' using errcode = 'P0001';
  end if;

  if not v_match then
    raise exception 'Current password is incorrect.' using errcode = 'P0001';
  end if;

  update customers set password_hash = crypt(p_new_password, gen_salt('bf')) where id = p_customer_id;
  return true;
end;
$$;
