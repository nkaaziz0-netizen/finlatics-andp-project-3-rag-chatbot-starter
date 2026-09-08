// lib/vectorSearch.js
import { generateEmbeddings } from "./embedder";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function searchSimilarChunks(query, documentId, matchCount = 5) {
  // 1. Convert user search query into a 1536-dim vector
  const [queryEmbedding] = await generateEmbeddings([query]);

  // 2. Call Supabase RPC function for cosine similarity
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
    filter_doc_id: documentId || null,
  });

  if (error) throw new Error(`Vector Search Error: ${error.message}`);
  return data;
}