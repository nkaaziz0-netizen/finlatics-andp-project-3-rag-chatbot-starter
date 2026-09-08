// pages/api/process.js
import { parsePdfBuffer } from "../../lib/pdfParser";
import { createDocumentChunks } from "../../lib/chunker";
import { generateEmbeddings } from "../../lib/embedder";
import { storeChunksInSupabase } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { documentId, pdfBuffer } = req.body; 

    // 1. Parse text from buffer
    const documents = await parsePdfBuffer(Buffer.from(pdfBuffer, "base64"));
    
    // 2. Split into chunks
    const chunks = await createDocumentChunks(documents);
    
    // 3. Generate embeddings
    const textsToEmbed = chunks.map(c => c.pageContent);
    const embeddings = await generateEmbeddings(textsToEmbed);
    
    // 4. Store in Supabase pgvector
    await storeChunksInSupabase(chunks, embeddings, documentId);

    return res.status(200).json({ success: true, chunkCount: chunks.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}