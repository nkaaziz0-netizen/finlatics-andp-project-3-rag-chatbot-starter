// lib/pdfParser.js
const pdfParse = require('pdf-parse');

export async function parsePdfBuffer(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}