import { NextRequest, NextResponse } from 'next/server';
import { DocumentRepositoryPrisma } from '@/backend/documents/DocumentRepositoryPrisma';

const documentRepository = new DocumentRepositoryPrisma();

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } } // <- essa forma funciona!
) {
  const { id } = context.params;

  try {
    const deletedDocument = await documentRepository.delete(id);
    return NextResponse.json({
      message: 'Documento excluído com sucesso',
      document: deletedDocument,
    });
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    return NextResponse.json(
      { message: 'Erro ao excluir documento' },
      { status: 500 }
    );
  }
}
