import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DocumentRepositoryPrisma {
  // Listar documentos do usuário
  async listByUserId(userId: number) {
    const documents = await prisma.document.findMany({
      where: { userId },
    });
  
    // Mapeia o status para 'Pendente' ou 'Assinado'
    return documents.map((document) => ({
      ...document,
      status: document.status === "PENDING" ? "Pendente" : "Assinado",  // Ajuste aqui
    }));
  }

  // Criar um novo documento
  async create(data: { name: string; fileKey: string; userId: number }) {
    return await prisma.document.create({
      data,
    });
  }

  // Buscar documento pelo ID
  async findById(id: string) {
    return await prisma.document.findUnique({
      where: { id },
    });
  }

  // Deletar um documento
  async delete(id: string) {
    return await prisma.document.delete({
      where: { id },
    });
  }
}
