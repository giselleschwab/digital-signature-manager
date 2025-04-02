import { NextRequest, NextResponse } from "next/server";
import { DocumentRepositoryPrisma } from "@/backend/documents/DocumentRepositoryPrisma";

const documentRepository = new DocumentRepositoryPrisma();

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = Number(searchParams.get("userId"));
  
      if (!userId) {
        return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
      }
  
      const documents = await documentRepository.listByUserId(userId);
  
      return NextResponse.json(documents);  
    } catch {
      return NextResponse.json({ error: "Erro ao buscar documentos" }, { status: 500 });
    }
  }
  
