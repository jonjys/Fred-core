import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { handleTunnelClip } from '@/lib/fred/modules/tunnelclip'
import { handleBankIDShield } from '@/lib/fred/modules/bankidshield'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const title = formData.get('title') as string || ''
  const text = formData.get('text') as string || ''
  const url = formData.get('url') as string || ''
  const file = formData.get('file') as File | null

  const sharedContent = `${title} ${text} ${url}`.trim()

  // TODO: Auth. I v1 hårdkodar vi user_id för test.
  const userId = 'TEST_USER_ID_REPLACE_ME'

  try {
    // Router: Testa moduler i ordning
    if (sharedContent.includes('youtube.com') || sharedContent.includes('youtu.be') || file?.type.startsWith('video/')) {
      const atom = await handleTunnelClip(userId, sharedContent, file || undefined)
      return NextResponse.json({ ok: true, module: 'TunnelClip', atom })
    }

    if (sharedContent.match(/swish|kr|ocr|bankid/i)) {
      const atom = await handleBankIDShield(userId, sharedContent)
      return NextResponse.json({ ok: true, module: 'BankIDShield', atom })
    }

    return NextResponse.json({ ok: false, error: 'Ingen Fred-modul kände igen detta. Kopiera texten istället.' }, { status: 400 })

  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}