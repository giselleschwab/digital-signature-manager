import { getServerAuthSession } from "@/backend/authentication/auth";
import Header from "./components/Header";
import DocumentTable from "./components/DocumentTable";

const fetchDocuments = async (userId: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/documents/list?userId=${userId}`);
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

  const formattedDocuments = documents.map((document) => {
    const creationDate = new Date(document.createdAt);  
  
    // Verifique se a data é válida
    const formattedDate = isNaN(creationDate.getTime()) 
      ? 'Data inválida'  
      : creationDate.toLocaleDateString();  
  
    return {
      id: document.id,
      name: document.name,
      creationDate: formattedDate,  
      status: document.status
    };
  });
  

  return (
    <div className="bg-[#D9D9D9] min-h-screen">
      {user && <Header userName={user.name ?? "Guest"} />}
      {/* Passe os documentos formatados como props para o DocumentTable */}
      <DocumentTable documents={formattedDocuments} />
    </div>
  );
}
