import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/backend/authentication/auth';
import { DocumentRepositoryPrisma } from '@/backend/documents/DocumentRepositoryPrisma';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }
    const userId = parseInt(session.user.id);

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const originalFileName = file.name;

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileNameOnDisk = `${Date.now()}-${originalFileName}`;
    const filePath = path.join(uploadDir, fileNameOnDisk);

    fs.writeFileSync(filePath, buffer);

    const documentRepository = new DocumentRepositoryPrisma();
    const document = await documentRepository.create({
      name: originalFileName, // salva o nome original no banco
      fileKey: filePath,
      userId,
    });

    return NextResponse.json({ document }, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    return NextResponse.json({ error: 'Erro ao salvar o documento' }, { status: 500 });
  }
};
