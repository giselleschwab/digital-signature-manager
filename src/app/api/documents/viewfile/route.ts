import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileKey = searchParams.get('fileKey')

  if (!fileKey) {
    return NextResponse.json({ error: 'fileKey é obrigatório' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    return NextResponse.json({ error: 'SUPABASE_URL não configurada' }, { status: 500 })
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/documents/${fileKey}`

  return NextResponse.json({ url: publicUrl }, { status: 200 })
}
