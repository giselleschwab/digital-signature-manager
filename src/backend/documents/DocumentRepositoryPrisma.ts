import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DocumentRepositoryPrisma {
  async listByUserId(userId: number) {
    const documents = await prisma.document.findMany({
      where: { userId },
    }) as { id: string; name: string; fileKey: string; userId: number; status: string }[];

    return documents.map((document) => ({
      ...document,
      status: document.status === "PENDING" ? "Pendente" : "Assinado",  // Ajuste aqui
    }));
  }

  async create(data: { name: string; fileKey: string; userId: number }) {
    return await prisma.document.create({
      data,
    });
  }

  async findById(id: string) {
    return await prisma.document.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return await prisma.document.delete({
      where: { id },
    });
  }
}
