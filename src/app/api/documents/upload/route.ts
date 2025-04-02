import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/backend/authentication/auth'
import { DocumentRepositoryPrisma } from '@/backend/documents/DocumentRepositoryPrisma'
import { supabase } from '@/lib/supabase'
import { v4 as uuid } from 'uuid'

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }
    const userId = parseInt(session.user.id)

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${uuid()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('documents') 
      .upload(fileName, buffer, {
        contentType: file.type || 'application/octet-stream',
      })

    if (uploadError) {
      console.error('Erro no upload para Supabase Storage:', uploadError)
      return NextResponse.json({ error: 'Erro no upload do arquivo' }, { status: 500 })
    }

    const documentRepository = new DocumentRepositoryPrisma()
    const document = await documentRepository.create({
      name: file.name,
      fileKey: fileName, 
      userId,
    })

    return NextResponse.json({ document }, { status: 200 })
  } catch (error) {
    console.error('Erro ao salvar documento:', error)
    return NextResponse.json({ error: 'Erro ao salvar o documento' }, { status: 500 })
  }
}
