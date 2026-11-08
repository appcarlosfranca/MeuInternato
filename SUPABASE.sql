-- App Cirurgia: sincronização privada por conta.
create table if not exists public.cirurgia_sync_documents (
  user_id uuid not null references auth.users(id) on delete cascade,
  document text not null check (document in ('schedule', 'study')),
  revision bigint not null default 1 check (revision > 0),
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 2097152),
  updated_at timestamptz not null default now(),
  primary key (user_id, document)
);
alter table public.cirurgia_sync_documents enable row level security;
revoke all on public.cirurgia_sync_documents from anon;
grant select, insert, update on public.cirurgia_sync_documents to authenticated;
drop policy if exists cirurgia_sync_select on public.cirurgia_sync_documents;
create policy cirurgia_sync_select on public.cirurgia_sync_documents for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists cirurgia_sync_insert on public.cirurgia_sync_documents;
create policy cirurgia_sync_insert on public.cirurgia_sync_documents for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists cirurgia_sync_update on public.cirurgia_sync_documents;
create policy cirurgia_sync_update on public.cirurgia_sync_documents for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create or replace function public.cirurgia_sync_write(p_document text, p_expected_revision bigint, p_payload jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare caller uuid := auth.uid(); saved public.cirurgia_sync_documents%rowtype;
begin
  if caller is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_document not in ('schedule','study') or p_expected_revision < 0 or p_expected_revision is null then raise exception 'Invalid document or revision' using errcode = '22023'; end if;
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' or octet_length(p_payload::text) > 2097152 then raise exception 'Invalid payload' using errcode = '22023'; end if;
  if p_expected_revision = 0 then
    insert into public.cirurgia_sync_documents(user_id, document, revision, payload) values(caller,p_document,1,p_payload)
    on conflict(user_id,document) do nothing returning * into saved;
  else
    update public.cirurgia_sync_documents set payload=p_payload, revision=revision+1, updated_at=now()
    where user_id=caller and document=p_document and revision=p_expected_revision returning * into saved;
  end if;
  if found then return jsonb_build_object('ok',true,'row',to_jsonb(saved)); end if;
  select * into saved from public.cirurgia_sync_documents where user_id=caller and document=p_document;
  return jsonb_build_object('ok',false,'conflict',true,'row',case when found then to_jsonb(saved) else null end);
end; $$;
revoke all on function public.cirurgia_sync_write(text,bigint,jsonb) from public, anon;
grant execute on function public.cirurgia_sync_write(text,bigint,jsonb) to authenticated;
