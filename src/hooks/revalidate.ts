import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Tras guardar en el panel, refresca las páginas de Next afectadas.
 * `listingPath` es el listado de la colección (p. ej. /dictamenes).
 */
export const revalidateDoc =
  (listingPath?: string): CollectionAfterChangeHook =>
  ({ doc, previousDoc, req: { context } }) => {
    if (context.disableRevalidate) return doc
    const paths = new Set<string>(['/'])
    if (doc?.slug) paths.add(`/${doc.slug}`)
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) paths.add(`/${previousDoc.slug}`)
    if (listingPath) paths.add(listingPath)
    for (const p of paths) safeRevalidate(p)
    return doc
  }

export const revalidateDelete =
  (listingPath?: string): CollectionAfterDeleteHook =>
  ({ doc, req: { context } }) => {
    if (context.disableRevalidate) return doc
    safeRevalidate('/')
    if (doc?.slug) safeRevalidate(`/${doc.slug}`)
    if (listingPath) safeRevalidate(listingPath)
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

function safeRevalidate(path: string) {
  try {
    revalidatePath(path, 'layout')
  } catch {
    /* fuera de Next (scripts, CLI) no hay nada que revalidar */
  }
}
