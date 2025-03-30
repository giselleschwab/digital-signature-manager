import { NextRequest, NextResponse } from "next/server";
import { DocumentRepositoryPrisma } from "@/backend/documents/DocumentRepositoryPrisma";

const documentRepository = new DocumentRepositoryPrisma();

// Listar documentos do usuário
export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = Number(searchParams.get("userId"));
  
      if (!userId) {
        return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
      }
  
      // Obter documentos com status já mapeado corretamente
      const documents = await documentRepository.listByUserId(userId);
  
      return NextResponse.json(documents);  // Não precisa mais mapear o status aqui
    } catch {
      return NextResponse.json({ error: "Erro ao buscar documentos" }, { status: 500 });
    }
  }
  
