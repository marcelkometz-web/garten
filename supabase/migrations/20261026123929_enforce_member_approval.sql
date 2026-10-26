-- Enforce operator approval and current sessions for garden data access.
-- Existing function ACLs are preserved. No records, users, roles or settings change.
-- Applied after rollback-based access checks; preserves existing function ACLs.
begin;

-- RLS already uses this helper on all garden tables and private photo buckets.
-- Keep rg_user_enabled(uid) unchanged: it is also used to validate target users
-- and voluntary public profiles without requiring a browser session.
create or replace function rg_private.rg_account_enabled()
returns boolean
language sql stable security definer set search_path=''
as $$
 select recipe_auth.session_valid()
 and rg_private.rg_user_enabled(auth.uid())
 and (
   exists(select 1 from public.rg_members where user_id=auth.uid())
   or exists(select 1 from rg_private.rg_administration where user_id=auth.uid())
 )
$$;

-- This SECURITY DEFINER routine is independently callable by authenticated.
-- Its own guard is necessary even when the public wrapper checks the account.
create or replace function rg_private.rg_create_family(family_name text)
returns uuid
language plpgsql security definer set search_path=''
as $$
declare uid uuid:=auth.uid(); fid uuid; mail text;
begin
 if not recipe_auth.session_valid()
    or not rg_private.rg_user_enabled(uid)
    or not exists(select 1 from rg_private.rg_administration where user_id=uid)
 then
  raise exception 'Neue Konten müssen zuerst vom Betreiber für den bestehenden Familiengarten freigeschaltet werden.' using errcode='42501';
 end if;
 if char_length(trim(family_name)) not between 1 and 100 or family_name is null then raise exception 'Ungültiger Familienname.';end if;
 select email into mail from auth.users where id=uid and email_confirmed_at is not null;
 if mail is null then raise exception 'Bitte bestätige zuerst deine E-Mail-Adresse.';end if;
 if exists(select 1 from public.rg_members where user_id=uid) then raise exception 'Du gehörst bereits zu einer Familie.';end if;
 insert into public.rg_families(name,owner_id) values(trim(family_name),uid) returning id into fid;
 insert into public.rg_members(user_id,family_id,email,role) values(uid,fid,mail,'owner');
 return fid;
end;
$$;

-- Invited users must be able to accept an operator-authorized invitation
-- BEFORE obtaining membership. The private routine supplies that narrow gate.
create or replace function public.rg_invitation(action text default 'status')
returns jsonb
language sql set search_path=''
as $$select rg_private.rg_invitation(action)$$;

create or replace function rg_private.rg_invitation(action text default 'status')
returns jsonb
language plpgsql security definer set search_path=''
as $$
declare uid uuid:=auth.uid(); item rg_private.rg_invitations; confirmed boolean; has_password boolean; existing uuid;
begin
 if not recipe_auth.session_valid() or not rg_private.rg_user_enabled(uid) then
  if action='status' then return jsonb_build_object('pending',false,'blocked',true);end if;
  raise exception 'Deine Anmeldung ist abgelaufen oder gesperrt. Bitte erneut anmelden.' using errcode='42501';
 end if;
 select i.* into item from rg_private.rg_invitations i join auth.users u on u.id=i.user_id and lower(u.email)=i.email
  where i.user_id=uid order by i.created_at desc,i.id limit 1 for update of i;
 if not found or item.state='accepted' then return jsonb_build_object('pending',false);end if;
 if item.state<>'sent' or item.expires_at<=now() then return jsonb_build_object('pending',false,'unavailable',true);end if;
 if action='status' then return jsonb_build_object('pending',true);end if;
 if action is distinct from 'accept' then raise exception 'Ungültige Einladungsaktion.';end if;
 select email_confirmed_at is not null,coalesce(encrypted_password,'')<>'' into confirmed,has_password from auth.users where id=uid;
 if not coalesce(confirmed,false) or not coalesce(has_password,false) then raise exception 'Bitte zuerst die E-Mail bestätigen und ein eigenes Passwort festlegen.' using errcode='42501';end if;
 perform 1 from public.rg_families where id=item.family_id for update;
 select family_id into existing from public.rg_members where user_id=uid;
 if existing is not null and existing<>item.family_id then raise exception 'Dein Konto gehört bereits zu einem anderen Garten.' using errcode='42501';end if;
 if existing is null then
  insert into public.rg_members(family_id,user_id,email,role) values(item.family_id,uid,item.email,'member');
 end if;
 update rg_private.rg_invitations set state='accepted',accepted_at=now() where id=item.id;
 return jsonb_build_object('accepted',true);
end;
$$;

commit;
