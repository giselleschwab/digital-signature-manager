// documents/page.tsx
import { getServerAuthSession } from "@/backend/authentication/auth";
import Header from "./components/Header"; // Importe o Header
import UploadDocument from "./components/UploadDocument";
import DocumentTable from "./components/DocumentTable";

// Suponha que esta função seja responsável por pegar os documentos de alguma fonte (ex: banco de dados)
const fetchDocuments = async () => {
  // Aqui você faria a requisição para pegar os documentos reais.
  // Para fins de exemplo, estou usando dados simulados.
  return [
    {
      id: 1,
      name: 'Documento A',
      creationDate: '2025-03-28',
      status: 'Pendente',
    },
    {
      id: 2,
      name: 'Documento B',
      creationDate: '2025-03-27',
      status: 'Assinado',
    },
    // Adicione mais documentos conforme necessário
  ];
};

export default async function DocumentsList() {
  const session = await getServerAuthSession();
  const user = session?.user;

  // Obtenha os documentos
  const documents = await fetchDocuments();

  return (
    <div className="bg-[#D9D9D9] min-h-screen">
      {user && <Header userName={user.name ?? "Guest"} />}
      <UploadDocument />
      {/* Passe os documentos como props para o DocumentTable */}
      <DocumentTable documents={documents} />
    </div>
  );
}
