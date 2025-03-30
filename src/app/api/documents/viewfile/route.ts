import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get('fileKey');

  if (!fileKey) {
    return NextResponse.json({ error: 'fileKey é obrigatório' }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), 'uploads'); 
  const filePath = path.join(uploadsDir, fileKey);

  if (!filePath.startsWith(uploadsDir)) {
    return NextResponse.json({ error: 'Caminho de arquivo inválido' }, { status: 400 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline', 
    },
  });
}
