import { redirect, permanentRedirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@payload-config'

type RedirectDoc = {
  type?: string | null
  to?: {
    type?: string | null
    url?: string | null
    reference?: {
      value?: { slug?: string | null } | number | null
    } | null
  } | null
}

function normalize(pathname: string) {
  if (!pathname.startsWith('/')) pathname = `/${pathname}`
  if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1)
  return pathname
}

function destination(doc: RedirectDoc) {
  const to = doc.to
  if (!to) return ''
  if (to.type === 'custom' && typeof to.url === 'string') return to.url
  const value = to.reference?.value
  if (value && typeof value === 'object' && typeof value.slug === 'string' && value.slug) return `/${value.slug}`
  return ''
}

export async function applyRedirect(pathname: string) {
  const path = normalize(pathname)
  let match: { url: string; status: string } | null = null
  const database = process.env.DATABASE_URL || ''
  if (!database.startsWith('postgres') || /PROYECTO|CONTRASEÑA|PASSWORD|cambia/i.test(database)) return

  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'redirects',
      where: {
        or: [{ from: { equals: path } }, { from: { equals: `${path}/` } }],
      },
      limit: 1,
      depth: 1,
      pagination: false,
    })
    const doc = docs[0] as RedirectDoc | undefined
    const url = doc ? destination(doc) : ''
    if (doc && url && normalize(url) !== path) match = { url, status: doc.type || '301' }
  } catch {
    return
  }

  if (!match) return
  if (match.status === '301' || match.status === '308') permanentRedirect(match.url)
  redirect(match.url)
}
