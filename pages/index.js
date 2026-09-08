import PdfUploader from '../components/PdfUploader';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Document RAG Pipeline</h1>
      <PdfUploader onUploadSuccess={(fileName) => console.log('Uploaded:', fileName)} />
    </main>
  );
}