import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import fs from 'fs'

async function saveLocally(file: File): Promise<string> {
  const ext = path.extname(file.name) || '.jpg'
  const filename = `${Date.now()}${ext}`
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()))
  return `/uploads/${filename}`
}

async function saveToSupabase(file: File): Promise<string> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const ext = path.extname(file.name) || '.jpg'
  const filename = `${Date.now()}${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from('products')
    .upload(filename, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage
    .from('products')
    .getPublicUrl(filename)

  return data.publicUrl
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const useSupabase = process.env.USE_SUPABASE_STORAGE === 'true'
    const filePath = useSupabase
      ? await saveToSupabase(file as File)
      : await saveLocally(file as File)

    return NextResponse.json({ path: filePath }, { status: 201 })
  } catch (error) {
    console.error('POST /api/upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
