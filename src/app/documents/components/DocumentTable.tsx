import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LuEye, LuSquarePen, LuTrash2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";

interface Document {
  id: number;
  name: string;
  creationDate: string;
  status: 'Pendente' | 'Assinado';
}

const DocumentTable: React.FC<{ documents: Document[] }> = ({ documents }) => {
  return (

    <div className="w-[80%] mx-auto mt-10">
      <div className="flex">
        <h1 className="text-xl font-bold text-[#383838]">Meus documentos</h1>
        <Button className="bg-[#30A949] text-white ml-auto hover:bg-[#5CCF7F] transition-all duration-300 cursor-pointer">
          Adicionar Documento
        </Button>
      </div>

      <Table className="bg-white rounded-2xl shadow mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Documento</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Status de Assinatura</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
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
                  <button className="text-[#383838] hover:text-[#7a7a7a]" title="Ver documento">
                    <LuEye className="h-5 w-5" />
                  </button>
                  <button className="text-[#383838] hover:text-[#7a7a7a]" title="Assinar documento">
                    <LuSquarePen className="h-5 w-5" />
                  </button>
                  <button className="text-[#383838] hover:text-[#7a7a7a]" title="Deletar documento">
                    <LuTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>



  );
};

export default DocumentTable;
