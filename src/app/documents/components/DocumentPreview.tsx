import React from 'react';
import { IoIosClose } from "react-icons/io";

interface DocumentPreviewProps {
  fileKey: string;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ fileKey, onClose }) => {
  const fileName = fileKey.split(/(\\|\/)/).pop();

  const fileUrl = `/api/documents/viewfile?fileKey=${encodeURIComponent(fileName || '')}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md w-3/4 h-3/4 relative">
        <button 
          className="absolute top-2 right-2 text-xl cursor-pointer"
          onClick={onClose}
        >
          <IoIosClose className="text-3xl" />
        </button>
        <iframe 
          src={fileUrl}
          className="w-full h-full"
          title="Visualização do Documento"
        />
      </div>
    </div>
  );
};

export default DocumentPreview;
