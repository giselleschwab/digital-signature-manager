"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

const UploadDocument = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const selectedFile = event.target.files[0];

      if (selectedFile.type !== "application/pdf") {
        setError("Por favor, selecione um arquivo PDF");
        setFile(null);
        return;
      }

      setError(null);
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      setError("Por favor, selecione um arquivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload");
      }

      const result = await response.json();
      console.log("Documento carregado com sucesso:", result.document);
      router.refresh();
      setIsOpen(false);
      setFile(null);
    } catch (err) {
      setError("Erro ao carregar o documento");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Button
        className="bg-[#30A949] text-white hover:bg-[#5CCF7F] transition-all duration-300"
        onClick={() => setIsOpen(true)}
      >
        Adicionar Documento
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload de Documento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 cursor-pointer">
            {file ? (
              <div className="flex items-center justify-between border p-2 w-full bg-gray-100 rounded">
                <span className="text-sm">{file.name}</span>
                <button type="button" onClick={handleRemoveFile} className="text-red-500 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="border p-2 w-full"
              />
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={uploading}
                className="bg-[#30A949] text-white hover:bg-[#5CCF7F] transition-all duration-300 cursor-pointer"
              >
                {uploading ? "Carregando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadDocument;
