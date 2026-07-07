-- Rollback for 0001_init.sql — run this ONLY in the project you accidentally
-- ran the migration against, to undo it. Do NOT run this in the real project
-- (haqjdwxntzwsyiojpuaw) once you run 0001_init.sql there for real.
--
-- This only drops objects with the exact names 0001_init.sql created. If the
-- wrong project already had its own tables/functions with any of these exact
-- names before you ran the migration, this will delete those too — skim the
-- list below before running. Otherwise this is safe: it won't touch anything
-- else in that project.

drop function if exists rpc_signup(text, text, text);
drop function if exists rpc_login(text, text);
drop function if exists rpc_reset_password(text, text);
drop function if exists rpc_change_password(uuid, text, text);
drop function if exists rpc_list_customers();
drop function if exists increment_product_view(uuid);

drop table if exists cart_items cascade;
drop table if exists favorites cascade;
drop table if exists sales cascade;
drop table if exists orders cascade;
drop table if exists inquiries cascade;
drop table if exists product_views cascade;
drop table if exists discounts cascade;
drop table if exists holidays cascade;
drop table if exists announcement cascade;
drop table if exists maintenance cascade;
drop table if exists newsletter_subscribers cascade;
drop table if exists reviews cascade;
drop table if exists blog_posts cascade;
drop table if exists customers cascade;
drop table if exists products cascade;

-- Not dropping the pgcrypto extension — if that project already used it for
-- anything else, dropping it could break unrelated functionality there.
