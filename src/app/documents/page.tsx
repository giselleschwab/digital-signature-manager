import { getServerAuthSession } from "@/backend/authentication/auth";
import Header from "./components/Header";
import DocumentTable from "./components/DocumentTable";

const fetchDocuments = async (userId: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/documents/list?userId=${userId}`,
      { cache: 'no-store' } 
    );
    if (!response.ok) {
      throw new Error("Erro ao carregar documentos");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};


export default async function DocumentsList() {
  const session = await getServerAuthSession();
  const user = session?.user;

  if (!user) {
    return <div>Você precisa estar logado para ver os documentos.</div>;
  }

  const documents = await fetchDocuments(Number(user.id));

  interface Document {
    id: number;
    name: string;
    createdAt: string;
    status: string;
    fileKey: string;
  }
  
  const formattedDocuments = documents.map((document: Document) => {
    const creationDate = new Date(document.createdAt);  
  
    const formattedDate = isNaN(creationDate.getTime()) 
      ? 'Data inválida'  
      : creationDate.toLocaleDateString();  
  
    return {
      id: document.id,
      name: document.name,
      creationDate: formattedDate,  
      status: document.status,
      fileKey: document.fileKey, 
    };
  });
  

  return (
    <div className="bg-[#D9D9D9] min-h-screen">
      {user && <Header userName={user.name ?? "Guest"} />}
      {/* Passe os documentos formatados como props para o DocumentTable */}
      <DocumentTable key={documents.length} documents={formattedDocuments} />
    </div>
  );
}
