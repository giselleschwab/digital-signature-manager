import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/backend/authentication/auth';
import { DocumentRepositoryPrisma } from '@/backend/documents/DocumentRepositoryPrisma';

// Configuração do diretório de uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const config = {
  api: {
    bodyParser: false, // Next.js não usa bodyParser em App Router
  },
};

export const POST = async (req: NextRequest) => {
  try {
    // Verificar a autenticação
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // 🔥 Novo método para obter o buffer corretamente
    const buffer = Buffer.from(await req.arrayBuffer());
    const fileName = `${Date.now()}-file.pdf`;
    const filePath = path.join(uploadDir, fileName);

    // Salva o arquivo no servidor
    fs.writeFileSync(filePath, buffer);

    // Salvar no banco de dados com Prisma
    const documentRepository = new DocumentRepositoryPrisma();
    const document = await documentRepository.create({
      name: fileName,
      fileKey: filePath,
      userId,
    });

    return NextResponse.json({ document }, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    return NextResponse.json({ error: 'Erro ao salvar o documento' }, { status: 500 });
  }
};
