// lib/geminiRAG.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({}); // Automatically reads GEMINI_API_KEY from environment

export async function streamGeminiRAGResponse(query, contextChunks) {
  // Format retrieved chunks with metadata/citations
  const formattedContext = contextChunks
    .map((chunk, idx) => `[Source ${idx + 1}] (Page ${chunk.metadata?.page || "N/A"}):\n${chunk.content}`)
    .join("\n\n");

  const prompt = `You are a helpful AI assistant. Answer the user's question using ONLY the provided document context below.
If the answer cannot be found in the context, state that you do not have enough information.
Always cite your sources using [Source X] when referencing facts.

Context:
${formattedContext}

User Question: ${query}`;

  // Stream content generation using gemini-2.5-flash
  const responseStream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return responseStream;
}