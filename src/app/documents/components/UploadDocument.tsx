"use client"

import { useState } from 'react';

const UploadDocument = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const selectedFile = event.target.files[0];
      
      // Verificar se o arquivo é um PDF
      if (selectedFile.type !== 'application/pdf') {
        setError('Por favor, selecione um arquivo PDF');
        setFile(null); // Limpa o arquivo caso não seja PDF
        return;
      }
      
      setError(null); // Limpar erro caso o arquivo seja válido
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      setError('Por favor, selecione um arquivo');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload');
      }

      const result = await response.json();
      console.log('Documento carregado com sucesso:', result.document);
    } catch (err) {
      setError('Erro ao carregar o documento');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">Escolha um documento (PDF):</label>
        <input
          type="file"
          id="file"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Carregando...' : 'Enviar'}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default UploadDocument;
