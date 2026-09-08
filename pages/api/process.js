import { createClient } from '@supabase/supabase-js';
import { parsePdfBuffer } from '../../lib/pdfParser';
import { splitTextIntoChunks } from '../../lib/chunker';
import { generateEmbedding } from '../../lib/embedder';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileData, fileName } = req.body; // base64 string and filename
    if (!fileData || !fileName) {
      return res.status(400).json({ error: 'Missing fileData or fileName' });
    }

    const buffer = Buffer.from(fileData, 'base64');
    const fullText = await parsePdfBuffer(buffer);
    const docChunks = await splitTextIntoChunks(fullText);

    const rowsToInsert = [];
    for (let i = 0; i < docChunks.length; i++) {
      const chunkText = docChunks[i].pageContent;
      const embedding = await generateEmbedding(chunkText);

      rowsToInsert.push({
        document_name: fileName,
        chunk_index: i,
        content: chunkText,
        metadata: { source: fileName, chunk: i },
        embedding: embedding,
      });
    }

    const { error } = await supabase.from('document_chunks').insert(rowsToInsert);
    if (error) throw error;

    return res.status(200).json({ 
      success: true, 
      message: `Processed ${docChunks.length} chunks for ${fileName}` 
    });
  } catch (err) {
    console.error('Ingestion error:', err);
    return res.status(500).json({ error: err.message });
  }
}