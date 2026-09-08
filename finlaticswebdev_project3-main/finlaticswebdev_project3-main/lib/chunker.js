// lib/chunker.js
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function createDocumentChunks(documents) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,   // ~200-250 words per chunk
    chunkOverlap: 200,  // Keeps context intact across boundaries
  });

  const chunks = await splitter.splitDocuments(documents);
  return chunks;
}