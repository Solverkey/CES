import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@payload-config'
import { safePreviewPath } from '@/lib/previewPath'

/** Activa la vista previa de borradores para quien ya tiene sesión en el panel. */
export async function GET(request: Request) {
  const path = safePreviewPath(new URL(request.url).searchParams.get('path') || '/')
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new Response('No autorizado', { status: 401 })
  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
