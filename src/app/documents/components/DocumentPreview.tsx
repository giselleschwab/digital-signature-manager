import React from 'react';
import { IoIosClose } from "react-icons/io";

interface DocumentPreviewProps {
  fileKey: string;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ fileKey, onClose }) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return (
      <div className="fixed inset-0 bg-[#757575] bg-opacity-100 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-md w-3/4 h-3/4 relative">
          <p>Erro: Variável de ambiente SUPABASE_URL não configurada.</p>
        </div>
      </div>
    );
  }

  const fileUrl = `${supabaseUrl}/storage/v1/object/public/documents/${fileKey}`;

  return (
    <div className="fixed inset-0 bg-[#757575] bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md w-3/4 h-3/4 relative">
        <button 
          className="absolute top-2 right-2 text-xl cursor-pointer"
          onClick={onClose}
        >
          <IoIosClose className="text-3xl" />
        </button>
        <iframe 
          src={fileUrl}
          className="w-full h-full rounded-md border"
          title="Visualização do Documento"
        />
      </div>
    </div>
  );
};

export default DocumentPreview;
