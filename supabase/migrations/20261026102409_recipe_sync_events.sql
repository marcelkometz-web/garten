-- Only a shared change signal for the recipes app; no garden content is changed.
begin;
create schema recipe_auth;
revoke all on schema recipe_auth from public,anon;
grant usage on schema recipe_auth to authenticated;
create function recipe_auth.session_valid() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from auth.sessions s where s.user_id=(select auth.uid()) and s.id=(auth.jwt()->>'session_id')::uuid and (s.not_after is null or s.not_after>now()))
$$;
revoke all on function recipe_auth.session_valid() from public,anon;
grant execute on function recipe_auth.session_valid() to authenticated;
create function public.recipe_session_valid() returns boolean language sql stable security invoker set search_path='' as $$ select recipe_auth.session_valid() $$;
revoke all on function public.recipe_session_valid() from public,anon;
grant execute on function public.recipe_session_valid() to authenticated;
create policy shared_forum_session_guard on public.rg_forum_topics as restrictive for all to authenticated
 using ((select recipe_auth.session_valid())) with check ((select recipe_auth.session_valid()));
create policy shared_reply_session_guard on public.rg_forum_replies as restrictive for all to authenticated
 using ((select recipe_auth.session_valid())) with check ((select recipe_auth.session_valid()));
create table public.recipe_sync_events(
 family_id uuid primary key references public.rg_families(id) on delete cascade,
 changed_at timestamptz not null default now()
);
alter table public.recipe_sync_events enable row level security;
revoke all on public.recipe_sync_events from public,anon,authenticated;
grant select,insert,update on public.recipe_sync_events to authenticated;
grant all on public.recipe_sync_events to service_role;
create policy recipe_sync_read on public.recipe_sync_events for select to authenticated
 using(exists(select 1 from public.rg_members m where m.user_id=(select auth.uid()) and m.family_id=recipe_sync_events.family_id));
create policy recipe_sync_insert on public.recipe_sync_events for insert to authenticated
 with check(exists(select 1 from public.rg_members m where m.user_id=(select auth.uid()) and m.family_id=recipe_sync_events.family_id));
create policy recipe_sync_update on public.recipe_sync_events for update to authenticated
 using(exists(select 1 from public.rg_members m where m.user_id=(select auth.uid()) and m.family_id=recipe_sync_events.family_id))
 with check(exists(select 1 from public.rg_members m where m.user_id=(select auth.uid()) and m.family_id=recipe_sync_events.family_id));
alter publication supabase_realtime add table public.recipe_sync_events;
commit;
