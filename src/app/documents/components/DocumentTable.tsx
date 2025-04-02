"use client";

import React, { useState, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LuEye, LuSquarePen, LuTrash2 } from "react-icons/lu";
import UploadDocument from "./UploadDocument";
import DocumentPreview from './DocumentPreview';
import SignatureCanvas from 'react-signature-canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface Document {
  id: number;
  name: string;
  creationDate: string;
  status: string;
  fileKey: string;
}

const DocumentTable: React.FC<{ documents: Document[] }> = ({ documents }) => {
  const [docs, setDocs] = useState<Document[]>(documents);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewFileKey, setPreviewFileKey] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signingDoc, setSigningDoc] = useState<Document | null>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleViewClick = (document: Document) => {
    setPreviewFileKey(document.fileKey);
  };

  const handleDeleteClick = (document: Document) => {
    setSelectedDoc(document);
    setIsDialogOpen(true);
  };

  const handleSignClick = (document: Document) => {
    setSigningDoc(document);
    setIsSigning(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/delete/${selectedDoc.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDocs(prevDocs => prevDocs.filter(doc => doc.id !== selectedDoc.id));
        setIsDialogOpen(false);
        setSelectedDoc(null);
      } else {
        console.error('Erro ao excluir documento');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[80%] mx-auto mt-10">
      <div className="flex">
        <h1 className="text-xl font-bold text-[#383838]">Meus documentos</h1>
        <div className="ml-auto">
          <UploadDocument />
        </div>
      </div>

      <Table className="bg-white rounded-2xl shadow mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Documento</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Status de Assinatura</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.map((document) => (
            <TableRow key={document.id}>
              <TableCell>{document.name}</TableCell>
              <TableCell>{document.creationDate}</TableCell>
              <TableCell>
                <span
                  className={`inline-block px-3 py-1 text-white rounded-full ${document.status === 'Pendente' ? 'bg-[#8E2CDB]' : 'bg-[#30A949]'
                    }`}
                >
                  {document.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <button
                    className="text-[#383838] hover:text-[#7a7a7a] cursor-pointer"
                    title="Ver documento"
                    onClick={() => handleViewClick(document)}
                  >
                    <LuEye className="h-5 w-5" />
                  </button>
                  <button
                    className="text-[#383838] hover:text-[#7a7a7a] cursor-pointer"
                    title="Assinar documento"
                    onClick={() => handleSignClick(document)}
                  >
                    <LuSquarePen className="h-5 w-5" />
                  </button>

                  <button
                    className="text-[#383838] hover:text-[#7a7a7a] cursor-pointer"
                    title="Deletar documento"
                    onClick={() => handleDeleteClick(document)}
                  >
                    <LuTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog de confirmação para exclusão */}
      {isDialogOpen && selectedDoc && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription className="pt-4 font">
                Tem certeza que deseja excluir o documento <strong>{selectedDoc.name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}
                className="bg-red-800  hover:bg-red-600 transition-all duration-300 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="bg-[#30A949] text-white hover:bg-[#5CCF7F] transition-all duration-300 cursor-pointer"
              >
                {loading ? 'Excluindo...' : 'Confirmar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {previewFileKey && (
        <DocumentPreview
          fileKey={previewFileKey}
          onClose={() => setPreviewFileKey(null)}
        />
      )}

      {isSigning && signingDoc && (
        <Dialog open={isSigning} onOpenChange={setIsSigning}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assinar Documento</DialogTitle>
              <DialogDescription>
                Simule sua assinatura abaixo para o documento <strong>{signingDoc.name}</strong>
              </DialogDescription>
            </DialogHeader>

            {/* Aqui você pode usar um campo de texto ou canvas */}
            <div className="mt-4">
              <SignatureCanvas
                penColor="black"
                canvasProps={{
                  width: 400,
                  height: 200,
                  className: 'border border-gray-300 rounded-md w-full',
                }}
                ref={sigCanvasRef}
              />
              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  onClick={() => sigCanvasRef.current?.clear()}
                >
                  Limpar
                </Button>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                className="bg-red-800  hover:bg-red-600 transition-all duration-300 cursor-pointer"
                onClick={() => setIsSigning(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-[#30A949] text-white hover:bg-[#5CCF7F] transition-all duration-300 cursor-pointer"
                onClick={async () => {

                  if (!signingDoc || !sigCanvasRef.current) return;

                  const signatureDataUrl = sigCanvasRef.current.getCanvas().toDataURL("image/png")

                  if (sigCanvasRef.current.isEmpty()) {
                    alert("Por favor, desenhe sua assinatura.");
                    return;
                  }

                  try {
                    const res = await fetch(`/api/documents/sign/${signingDoc.id}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        signatureImg: signatureDataUrl,
                      }),
                    });
                    if (res.ok) {
                      const updatedDocs = docs.map((doc) =>
                        doc.id === signingDoc.id ? { ...doc, status: 'Assinado' } : doc
                      );
                      setDocs(updatedDocs);
                      setIsSigning(false);
                      setSigningDoc(null);
                    } else {
                      console.error('Erro ao assinar documento');
                    }
                  } catch (err) {
                    console.error('Erro:', err);
                  }
                }}
              >
                Assinar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default DocumentTable;
