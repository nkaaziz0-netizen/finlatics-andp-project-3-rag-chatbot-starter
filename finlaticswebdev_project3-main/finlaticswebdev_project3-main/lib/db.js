// lib/db.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function storeChunksInSupabase(chunks, embeddings, documentId) {
  const rows = chunks.map((chunk, index) => ({
    document_id: documentId,
    content: chunk.pageContent,
    metadata: chunk.metadata,
    embedding: embeddings[index],
  }));

  const { data, error } = await supabase
    .from("document_chunks")
    .insert(rows);

  if (error) throw new Error(`Supabase Insert Error: ${error.message}`);
  return data;
}