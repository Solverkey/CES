import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { unstable_cache } from 'next/cache'
import { draftMode, cookies } from 'next/headers'
import { getPayload, type Payload, type TypedUser } from 'payload'

import config from '@payload-config'

import { POSTS_TAG } from '@/lib/cacheTags'
import {
  pages as localPages,
  posts as localPosts,
  type Category,
  type PageContent,
  type Post,
} from '@/lib/content'

type Doc = {
  slug?: string | null
  title?: string | null
  fecha?: string | null
  fechaActo?: string | null
  publishedAt?: string | null
  resumen?: string | null
  extracto?: string | null
  cuerpo?: unknown
  archivoUrl?: string | null
  pdf?: unknown
  imagenUrl?: string | null
  imagen?: unknown
  lugar?: string | null
  hora?: string | null
  fechaTexto?: string | null
  comision?: unknown
  meta?: {
    title?: string | null
    description?: string | null
    image?: unknown
  } | null
}

function databaseReady() {
  const url = process.env.DATABASE_URL || ''
  if (!url.startsWith('postgres')) return false
  if (/PROYECTO|CONTRASEÑA|PASSWORD|cambia/i.test(url)) return false
  return true
}

async function payloadOrNull() {
  if (!databaseReady()) return null
  try {
    return await getPayload({ config })
  } catch {
    return null
  }
}

function textOf(value: unknown) {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'nombre' in value && typeof value.nombre === 'string') return value.nombre
  return ''
}

/** Las fotos subidas se guardan con el puerto del .env. En local se sirve la ruta, en el puerto que esté abierto. */
function ownFile(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith('/api/')) return `${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
  return url
}

function fileUrl(value: unknown) {
  if (typeof value === 'string') return ownFile(value)
  if (value && typeof value === 'object' && 'url' in value && typeof value.url === 'string') return ownFile(value.url)
  return ''
}

function cuerpoHtml(value: unknown) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'root' in value) {
    return convertLexicalToHTML({ data: value as never, disableContainer: true })
  }
  return ''
}

function comisionName(value: unknown, nombres: Map<number, string>) {
  if (typeof value === 'number') return nombres.get(value) || ''
  return textOf(value)
}

function relationId(value: unknown) {
  return typeof value === 'number' ? value : null
}

type Foto = { url: string; alt: string }

function fotoOf(value: unknown, fotos: Map<number, Foto>) {
  const id = relationId(value)
  if (id && fotos.has(id)) return fotos.get(id) || null
  const url = fileUrl(value)
  return url ? { url, alt: '' } : null
}

function toPost(
  doc: Doc,
  category: Category,
  categoryLabel: string,
  nombres: Map<number, string>,
  fotos: Map<number, Foto>,
): Post | null {
  if (!doc.slug || !doc.title) return null
  const date = (doc.fecha || doc.fechaActo || doc.publishedAt || '').slice(0, 10)
  const foto = fotoOf(doc.imagen, fotos)
  const seoFoto = fotoOf(doc.meta?.image, fotos)
  return {
    slug: doc.slug,
    title: doc.title,
    date,
    category,
    categoryLabel,
    excerpt: doc.extracto || doc.resumen || '',
    image: foto?.url || doc.imagenUrl || null,
    imageAlt: foto?.alt || '',
    pdf: fileUrl(doc.pdf) || doc.archivoUrl || null,
    lugar: doc.lugar || '',
    fechaTexto: '',
    hora: doc.hora || '',
    comision: comisionName(doc.comision, nombres),
    html: cuerpoHtml(doc.cuerpo),
    seoTitle: doc.meta?.title || '',
    seoDescription: doc.meta?.description || '',
    seoImage: seoFoto?.url || null,
  }
}

async function loadPostsFromDatabase(options?: { draft?: boolean; user?: TypedUser | null }): Promise<Post[]> {
  const payload = await payloadOrNull()
  if (!payload) throw new Error('CMS no disponible')
  return readPosts(payload, options)
}

async function readPosts(payload: Payload, options?: { draft?: boolean; user?: TypedUser | null }): Promise<Post[]> {
  const draft = Boolean(options?.draft && options.user)
  const published = { _status: { equals: 'published' } }
  const access = draft ? { draft: true, overrideAccess: false, user: options?.user || undefined } : { where: published }
  const [dictamenes, actividades, noticias, comisiones] = await Promise.all([
    payload.find({ collection: 'dictamenes', limit: 500, depth: 0, sort: '-fecha', pagination: false, ...access }),
    payload.find({ collection: 'actividades', limit: 200, depth: 0, sort: '-publishedAt', pagination: false, ...access }),
    payload.find({ collection: 'noticias', limit: 200, depth: 0, sort: '-publishedAt', pagination: false, ...access }),
    payload.find({ collection: 'comisiones', limit: 100, depth: 0, pagination: false }),
  ])

  const nombres = new Map<number, string>()
  for (const doc of comisiones.docs) {
    if (typeof doc.nombre === 'string') nombres.set(doc.id, doc.nombre)
  }

  const fotoIds = [...dictamenes.docs, ...actividades.docs, ...noticias.docs].flatMap((doc) => {
    const item = doc as Doc
    return [relationId(item.imagen), relationId(item.meta?.image)].filter((id): id is number => Boolean(id))
  })
  const fotos = new Map<number, Foto>()
  if (fotoIds.length) {
    const imagenes = await payload.find({
      collection: 'imagenes',
      where: { id: { in: fotoIds } },
      limit: fotoIds.length,
      depth: 0,
      pagination: false,
    })
    for (const doc of imagenes.docs) {
      if (typeof doc.url === 'string') {
        const alt = 'alt' in doc && typeof doc.alt === 'string' ? doc.alt : ''
        fotos.set(doc.id, { url: ownFile(doc.url), alt })
      }
    }
  }

  const items = [
    ...dictamenes.docs.map((doc) => toPost(doc, 'dictamenes', 'Dictámenes', nombres, fotos)),
    ...actividades.docs.map((doc) => toPost(doc, 'actividades', 'Actividades', nombres, fotos)),
    ...noticias.docs.map((doc) => toPost(doc, 'noticias', 'Comunicación', nombres, fotos)),
  ].filter((post): post is Post => Boolean(post))

  return items.sort((a, b) => b.date.localeCompare(a.date))
}

const loadPublishedCached = unstable_cache(() => loadPostsFromDatabase(), ['ces-posts'], { tags: [POSTS_TAG] })

/**
 * Fichas publicadas. La etiqueta `posts` se invalida al publicar.
 * Un fallo de lectura no se guarda: la siguiente visita vuelve a preguntar a la base.
 */
export async function loadPublishedPosts() {
  if (!databaseReady()) return localPosts
  try {
    const posts = await loadPublishedCached()
    return posts.length ? posts : localPosts
  } catch {
    return localPosts
  }
}

/** Slugs publicados en la base. `null` si no se ha podido consultar. */
export async function cmsPublishedSlugs(): Promise<Set<string> | null> {
  if (!databaseReady()) return null
  try {
    const posts = await loadPublishedCached()
    return new Set(posts.map((post) => post.slug))
  } catch {
    return null
  }
}

async function editorFromCookies() {
  const payload = await payloadOrNull()
  if (!payload) return null
  const token = (await cookies()).get('payload-token')?.value
  if (!token) return null
  try {
    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    return user
  } catch {
    return null
  }
}

/** En una vista previa con sesión, incluye borradores. En la web pública, solo lo publicado. */
export async function loadPosts() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return loadPublishedPosts()
  const user = await editorFromCookies()
  if (!user) return loadPublishedPosts()
  try {
    const drafts = await loadPostsFromDatabase({ draft: true, user })
    return drafts.length ? drafts : loadPublishedPosts()
  } catch {
    return loadPublishedPosts()
  }
}

export async function loadPost(slug: string) {
  const items = await loadPosts()
  return items.find((post) => post.slug === slug)
}

export async function loadPage(slug: string): Promise<PageContent | undefined> {
  return localPages[slug]
}
