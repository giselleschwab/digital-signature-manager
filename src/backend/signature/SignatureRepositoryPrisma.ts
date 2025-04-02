import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SignatureRepositoryPrisma {
  async signDocument({
    documentId,
    userId,
    signatureImg,
  }: {
    documentId: string;
    userId: number;
    signatureImg: string;
  }) {
    const signedAt = new Date();

    // Cria a assinatura
    await prisma.signature.create({
      data: {
        documentId,
        userId,
        signatureImg,
        signedAt,
      },
    });

    // Atualiza o status do documento
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "SIGNED",
        updatedAt: signedAt,
      },
    });

    return { success: true };
  }
}
