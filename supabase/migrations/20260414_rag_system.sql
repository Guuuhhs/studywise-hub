-- Enable pgvector
create extension if not exists vector;

-- Table for document chunks
create table public.document_chunks (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.library_items(id) on delete cascade,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536), -- 1536 for OpenAI/GTE
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table for intelligent memory (user specific insights)
create table public.user_memory (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  fact text not null,
  category text, -- e.g. 'learning_style', 'difficulty_topic', 'preference'
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Function for similarity search on document chunks
create or replace function match_document_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter jsonb default '{}'::jsonb
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    document_chunks.metadata,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Function for similarity search on user memory
create or replace function match_user_memory (
  user_uuid uuid,
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  fact text,
  category text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    user_memory.id,
    user_memory.fact,
    user_memory.category,
    1 - (user_memory.embedding <=> query_embedding) as similarity
  from user_memory
  where user_memory.user_id = user_uuid
    and 1 - (user_memory.embedding <=> query_embedding) > match_threshold
  order by user_memory.embedding <=> query_embedding
  limit match_count;
end;
$$;
