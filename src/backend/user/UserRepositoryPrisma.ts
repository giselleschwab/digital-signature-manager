import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepositoryPrisma {
  // Criar um novo usuário
  async create(data: { name: string; email: string; password: string }) {
    return await prisma.user.create({
      data,
    });
  }

  // Buscar usuário pelo e-mail
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Buscar usuário pelo ID
  async findById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Atualizar um usuário
  async update(id: number, data: Partial<{ name: string; email: string; password: string }>) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // Deletar um usuário
  async delete(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
