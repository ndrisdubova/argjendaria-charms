-- Argjendaria Charms — initial schema migration
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query > Run).

create extension if not exists pgcrypto;

-- ============================================================
-- Tables
-- ============================================================

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric not null,
  offer_price numeric,
  material text not null default '',
  description text not null default '',
  featured boolean not null default false,
  image text,
  gallery jsonb not null default '[]',
  sizes jsonb not null default '[]',
  stock int not null default 10,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  name text not null,
  email text not null,
  message text not null,
  product_id uuid references products(id) on delete set null,
  product_name text,
  size text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  grams numeric not null default 0,
  price_per_gram numeric not null default 0,
  price numeric not null default 0,
  order_id uuid,
  day date not null,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  items jsonb not null default '[]',
  status text not null default 'confirmed',
  archived boolean not null default false,
  total numeric not null default 0,
  day date not null,
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  customer_id uuid not null references customers(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, product_id)
);

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  size text,
  quantity int not null,
  updated_at timestamptz not null default now()
);

create table if not exists product_views (
  product_id uuid primary key references products(id) on delete cascade,
  count int not null default 0
);

create table if not exists discounts (
  product_id uuid primary key references products(id) on delete cascade,
  percent int not null
);

create table if not exists holidays (
  key text primary key,
  enabled boolean not null default false,
  product_ids uuid[] not null default '{}'
);

create table if not exists announcement (
  id int primary key default 1 check (id = 1),
  enabled boolean not null default false,
  text text not null default ''
);

create table if not exists maintenance (
  id int primary key default 1 check (id = 1),
  enabled boolean not null default false
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  subscribed_at timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_lower_idx on newsletter_subscribers (lower(email));

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  content text not null,
  image text,
  author text not null default $$Charm's Atelier$$,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
-- `customers` is fully locked down: no anon/authenticated policies at all.
-- All access goes through the SECURITY DEFINER RPC functions below, which
-- run as the function owner and bypass RLS. Every other table gets a single
-- permissive policy scoped to normal app usage — this matches the app's
-- existing "admin panel gated by a frontend password only" security model,
-- not a regression from the localStorage version. See the migration plan
-- for the trade-offs this implies for shared customer data.

alter table products enable row level security;
alter table customers enable row level security;
alter table inquiries enable row level security;
alter table sales enable row level security;
alter table orders enable row level security;
alter table favorites enable row level security;
alter table cart_items enable row level security;
alter table product_views enable row level security;
alter table discounts enable row level security;
alter table holidays enable row level security;
alter table announcement enable row level security;
alter table maintenance enable row level security;
alter table newsletter_subscribers enable row level security;
alter table reviews enable row level security;
alter table blog_posts enable row level security;

create policy "app access" on products for all using (true) with check (true);
create policy "app access" on inquiries for all using (true) with check (true);
create policy "app access" on sales for all using (true) with check (true);
create policy "app access" on orders for all using (true) with check (true);
create policy "app access" on favorites for all using (true) with check (true);
create policy "app access" on cart_items for all using (true) with check (true);
create policy "app access" on product_views for all using (true) with check (true);
create policy "app access" on discounts for all using (true) with check (true);
create policy "app access" on holidays for all using (true) with check (true);
create policy "app access" on announcement for all using (true) with check (true);
create policy "app access" on maintenance for all using (true) with check (true);
create policy "app access" on newsletter_subscribers for all using (true) with check (true);
create policy "app access" on reviews for all using (true) with check (true);
create policy "app access" on blog_posts for all using (true) with check (true);

grant select, insert, update, delete on
  products, inquiries, sales, orders, favorites, cart_items, product_views,
  discounts, holidays, announcement, maintenance, newsletter_subscribers,
  reviews, blog_posts
to anon, authenticated;

-- customers: no grants at all for anon/authenticated — access only via RPCs below.
revoke all on customers from anon, authenticated;

-- ============================================================
-- Customer auth RPCs (SECURITY DEFINER — bypass RLS on `customers`)
-- ============================================================

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

create or replace function rpc_list_customers()
returns table (id uuid, name text, email text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select c.id, c.name, c.email, c.created_at from customers c order by c.created_at desc;
$$;

grant execute on function rpc_signup(text, text, text) to anon, authenticated;
grant execute on function rpc_login(text, text) to anon, authenticated;
grant execute on function rpc_reset_password(text, text) to anon, authenticated;
grant execute on function rpc_change_password(uuid, text, text) to anon, authenticated;
grant execute on function rpc_list_customers() to anon, authenticated;

-- ============================================================
-- Atomic product-view counter
-- ============================================================

create or replace function increment_product_view(p_product_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into product_views (product_id, count)
  values (p_product_id, 1)
  on conflict (product_id) do update set count = product_views.count + 1;
$$;

grant execute on function increment_product_view(uuid) to anon, authenticated;

-- ============================================================
-- Singleton settings rows
-- ============================================================

insert into announcement (id, enabled, text) values (1, false, '') on conflict (id) do nothing;
insert into maintenance (id, enabled) values (1, false) on conflict (id) do nothing;

insert into holidays (key, enabled, product_ids) values
  ('valentines', false, '{}'),
  ('christmas', false, '{}'),
  ('newyears', false, '{}'),
  ('mothersday', false, '{}')
on conflict (key) do nothing;

-- ============================================================
-- Seed data (mirrors src/data/products.js, reviews.js, blogPosts.js)
-- ============================================================

do $seed_products$
begin
  if not exists (select 1 from products) then
    insert into products (name, category, price, material, description, featured, sizes, stock) values
      ($$Éclat Solitaire Ring$$, 'ring', 2450, $$18k Gold · Diamond$$, $$A radiant round-cut diamond set in a delicate 18k gold band.$$, true, '["5","5.5","6","6.5","7","7.5","8"]', 4),
      ($$Vermeil Halo Ring$$, 'ring', 1180, $$18k Gold Vermeil$$, $$A halo of pavé stones encircling a luminous center gem.$$, false, '["4.5","5","5.5","6","6.5","7"]', 6),
      ($$Aurora Pendant Necklace$$, 'necklace', 1690, $$14k Gold · Sapphire$$, $$A hand-set sapphire drop suspended from a fine gold chain.$$, true, '[]', 5),
      ($$Cascade Layer Necklace$$, 'necklace', 890, $$14k Gold$$, $$Three graduated chains layered for effortless elegance.$$, false, '[]', 8),
      ($$Lumière Drop Earrings$$, 'earrings', 1340, $$18k Gold · Pearl$$, $$Freshwater pearls swinging from polished gold hoops.$$, true, '[]', 7),
      ($$Étoile Stud Earrings$$, 'earrings', 620, $$18k Gold · Diamond$$, $$Petite starlit studs for everyday radiance.$$, false, '[]', 10),
      ($$Serpentine Bangle$$, 'bracelet', 1050, $$18k Gold$$, $$A sculpted bangle inspired by the curve of a ribbon.$$, false, '[]', 6),
      ($$Adorae Tennis Bracelet$$, 'bracelet', 3200, $$Platinum · Diamond$$, $$A continuous line of brilliant-cut diamonds in platinum.$$, true, '[]', 2),
      ($$Noble Signet Ring$$, 'ring', 780, $$14k Gold$$, $$A modern take on the heirloom signet, hand-engraved.$$, false, '["6","7","8","9","10"]', 9),
      ($$Reverie Chain Bracelet$$, 'bracelet', 540, $$14k Gold$$, $$A supple curb chain bracelet with a hidden clasp.$$, false, '[]', 8),
      ($$Celestine Chandelier Earrings$$, 'earrings', 1780, $$18k Gold · Topaz$$, $$Cascading topaz stones for a statement evening look.$$, false, '[]', 3),
      ($$Infinie Chain Necklace$$, 'necklace', 1120, $$18k Gold$$, $$An endless-knot pendant symbolizing eternal devotion.$$, false, '[]', 5);
  end if;
end;
$seed_products$;

do $seed_reviews$
begin
  if not exists (select 1 from reviews) then
    insert into reviews (name, rating, text, created_at) values
      ($$Elira K.$$, 5, $$The team helped me design a custom engagement ring from scratch. The craftsmanship exceeded every expectation — worth every visit to the atelier.$$, '2026-03-04T09:00:00.000Z'),
      ($$Marko D.$$, 5, $$Bought a necklace for our anniversary and the attention to detail was incredible. Beautifully packaged too.$$, '2026-02-11T09:00:00.000Z'),
      ($$Sara B.$$, 4, $$Lovely pieces and very personal service. My earrings needed a small adjustment and they took care of it immediately, free of charge.$$, '2026-01-22T09:00:00.000Z');
  end if;
end;
$seed_reviews$;

do $seed_blog$
begin
  if not exists (select 1 from blog_posts) then
    insert into blog_posts (title, excerpt, content, image, author, created_at) values
      (
        $$How to Choose the Right Diamond Cut$$,
        $$From round brilliant to emerald cut, here is how each shape catches the light differently.$$,
        $$Choosing a diamond cut is about more than shape — it determines how a stone plays with light. Round brilliants offer maximum sparkle thanks to their symmetrical facets, while emerald cuts favor clarity and a more understated, architectural elegance.

When you visit our atelier, we'll walk you through each cut in person under different lighting so you can see exactly how it will look day to day, not just under a jeweler's loupe.$$,
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?fm=jpg&q=80&w=1600&auto=format&fit=crop',
        $$Charm's Atelier$$,
        '2026-05-12T09:00:00.000Z'
      ),
      (
        $$Caring for Your Gold Jewelry at Home$$,
        $$Simple habits that keep your pieces looking as radiant as the day you got them.$$,
        $$Gold is durable, but it still deserves a little care. Store pieces separately to avoid scratching, remove jewelry before swimming or applying lotion, and give it an occasional gentle clean with warm water and a soft brush.

For anything set with delicate stones like pearls or opals, avoid ultrasonic cleaners — bring it by the atelier instead and we'll take care of it for you, free of charge.$$,
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?fm=jpg&q=80&w=1600&auto=format&fit=crop',
        $$Charm's Atelier$$,
        '2026-04-02T09:00:00.000Z'
      ),
      (
        $$Behind the Scenes: From Wax to Polish$$,
        $$A look inside our atelier at the hand-finishing process behind every piece.$$,
        $$Every Charm's piece begins as a hand-carved wax model before it's cast, set, and polished entirely by hand. It's a slower process than mass production, but it's the only way we know to guarantee the kind of detail that lasts for generations.

We're planning an open atelier day this year for clients who'd like to see the workshop in person — stay tuned to this page for the date.$$,
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?fm=jpg&q=80&w=1600&auto=format&fit=crop',
        $$Charm's Atelier$$,
        '2026-02-18T09:00:00.000Z'
      );
  end if;
end;
$seed_blog$;
