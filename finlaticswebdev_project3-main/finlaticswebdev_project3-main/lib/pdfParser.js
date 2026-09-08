// lib/pdfParser.js
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export async function parsePdfBuffer(buffer) {
  // Pass the raw PDF buffer as a Blob into the loader
  const loader = new PDFLoader(new Blob([buffer]));
  const pages = await loader.load();
  
  // Combines page contents while retaining metadata (like page numbers)
  return pages; 
}