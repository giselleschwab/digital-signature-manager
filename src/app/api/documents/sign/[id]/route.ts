import { NextRequest, NextResponse } from 'next/server';
import { SignatureRepositoryPrisma } from '@/backend/signature/SignatureRepositoryPrisma'; 
import { getServerAuthSession } from '@/backend/authentication/auth';

const signatureRepository = new SignatureRepositoryPrisma();

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id: documentId } = context.params;

  try {
    // Recupera a sessão do usuário logado
    const session = await getServerAuthSession(); 

    // Se não estiver logado, retorna erro
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    // Converte o ID para número (caso o seu schema Prisma use Int)
    const userId = Number(session.user.id);

    // Recebe a assinatura do corpo da requisição
    const body = await request.json();
    const { signatureImg } = body;

    if (!signatureImg) {
      return NextResponse.json(
        { message: 'Assinatura não enviada' },
        { status: 400 }
      );
    }

    // Salva a assinatura e atualiza o status do documento
    await signatureRepository.signDocument({
      documentId,
      userId,
      signatureImg,
    });

    return NextResponse.json({
      message: 'Documento assinado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao assinar documento:', error);
    return NextResponse.json(
      { message: 'Erro ao assinar documento' },
      { status: 500 }
    );
  }
}
