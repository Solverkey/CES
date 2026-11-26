import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache.js'

import { POSTS_TAG } from '../lib/cacheTags'

/**
 * Tras guardar en el panel, refresca las páginas de Next afectadas.
 * `listingPath` es el listado de la colección (p. ej. /dictamenes).
 */
function affectsPublic(doc?: { _status?: string | null }, previousDoc?: { _status?: string | null }) {
  const now = doc?._status
  const before = previousDoc?._status
  if (!now && !before) return true
  return now === 'published' || before === 'published'
}

export const revalidateDoc =
  (listingPath?: string): CollectionAfterChangeHook =>
  ({ doc, previousDoc, req: { context } }) => {
    if (context.disableRevalidate) return doc
    if (!affectsPublic(doc, previousDoc)) return doc
    const paths = new Set<string>(['/'])
    if (doc?.slug) paths.add(`/${doc.slug}`)
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) paths.add(`/${previousDoc.slug}`)
    if (listingPath) paths.add(listingPath)
    for (const p of paths) safeRevalidate(p)
    safeRevalidateTag()
    return doc
  }

export const revalidateDelete =
  (listingPath?: string): CollectionAfterDeleteHook =>
  ({ doc, req: { context } }) => {
    if (context.disableRevalidate) return doc
    if (doc?._status && doc._status !== 'published') return doc
    safeRevalidate('/')
    if (doc?.slug) safeRevalidate(`/${doc.slug}`)
    if (listingPath) safeRevalidate(listingPath)
    safeRevalidateTag()
    return doc
  }

/** Header, footer y contacto aparecen en todas las páginas. */
export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc, req: { context } }) => {
    if (context.disableRevalidate) return doc
    try {
      revalidateTag(tag, 'max')
      revalidatePath('/', 'layout')
    } catch {
      /* fuera de Next (scripts, CLI) no hay nada que revalidar */
    }
    return doc
  }

function safeRevalidateTag() {
  try {
    revalidateTag(POSTS_TAG, 'max')
  } catch {
    /* fuera de Next (scripts, CLI) no hay nada que revalidar */
  }
}

function safeRevalidate(path: string) {
  try {
    revalidatePath(path, 'layout')
  } catch {
    /* fuera de Next (scripts, CLI) no hay nada que revalidar */
  }
}
