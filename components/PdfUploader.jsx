import { useState } from 'react';

export default function PdfUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage('Parsing, chunking, and generating vector embeddings...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];

        const response = await fetch('/api/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData: base64Data,
            fileName: file.name,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(`Success: ${data.message}`);
          if (onUploadSuccess) onUploadSuccess(file.name);
        } else {
          setMessage(`Error: ${data.error}`);
        }
        setLoading(false);
      };
    } catch (err) {
      setMessage(`Upload failed: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px border #ccc', padding: '20px', borderRadius: '8px', maxWidth: '500px' }}>
      <h3>Upload PDF for RAG Ingestion</h3>
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileChange} 
          disabled={loading} 
        />
        <button 
          type="submit" 
          disabled={!file || loading}
          style={{ marginTop: '10px', padding: '8px 16px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Processing...' : 'Upload & Embed'}
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', fontSize: '14px' }}>{message}</p>}
    </div>
  );
}