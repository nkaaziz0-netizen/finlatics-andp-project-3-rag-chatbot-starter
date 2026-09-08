import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export async function splitTextIntoChunks(text, chunkSize = 1000, chunkOverlap = 200) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  
  return await splitter.createDocuments([text]);
}