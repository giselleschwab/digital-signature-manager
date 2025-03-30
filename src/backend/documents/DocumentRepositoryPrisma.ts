import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DocumentRepositoryPrisma {
  // Listar documentos do usuário
  async listByUserId(userId: number) {
    return await prisma.document.findMany({
      where: { userId },
    });
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
