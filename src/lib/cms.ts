import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@payload-config'

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

function toPost(
  doc: Doc,
  category: Category,
  categoryLabel: string,
  nombres: Map<number, string>,
  fotos: Map<number, string>,
): Post | null {
  if (!doc.slug || !doc.title) return null
  const date = (doc.fecha || doc.fechaActo || doc.publishedAt || '').slice(0, 10)
  const subida = relationId(doc.imagen)
  return {
    slug: doc.slug,
    title: doc.title,
    date,
    category,
    categoryLabel,
    excerpt: doc.extracto || doc.resumen || '',
    image: (subida ? fotos.get(subida) : '') || fileUrl(doc.imagen) || doc.imagenUrl || null,
    pdf: fileUrl(doc.pdf) || doc.archivoUrl || null,
    lugar: doc.lugar || '',
    fechaTexto: '',
    hora: doc.hora || '',
    comision: comisionName(doc.comision, nombres),
    html: cuerpoHtml(doc.cuerpo),
  }
}

async function loadPostsFromDatabase(): Promise<Post[]> {
  const payload = await payloadOrNull()
  if (!payload) return localPosts

  const published = { _status: { equals: 'published' } }
  const [dictamenes, actividades, noticias, comisiones] = await Promise.all([
    payload.find({ collection: 'dictamenes', where: published, limit: 500, depth: 0, sort: '-fecha', pagination: false }),
    payload.find({ collection: 'actividades', where: published, limit: 200, depth: 0, sort: '-publishedAt', pagination: false }),
    payload.find({ collection: 'noticias', where: published, limit: 200, depth: 0, sort: '-publishedAt', pagination: false }),
    payload.find({ collection: 'comisiones', limit: 100, depth: 0, pagination: false }),
  ])

  const nombres = new Map<number, string>()
  for (const doc of comisiones.docs) {
    if (typeof doc.nombre === 'string') nombres.set(doc.id, doc.nombre)
  }

  const fotoIds = [...actividades.docs, ...noticias.docs].flatMap((doc) => {
    const id = relationId((doc as Doc).imagen)
    return id ? [id] : []
  })
  const fotos = new Map<number, string>()
  if (fotoIds.length) {
    const imagenes = await payload.find({
      collection: 'imagenes',
      where: { id: { in: fotoIds } },
      limit: fotoIds.length,
      depth: 0,
      pagination: false,
    })
    for (const doc of imagenes.docs) {
      if (typeof doc.url === 'string') fotos.set(doc.id, ownFile(doc.url))
    }
  }

  const items = [
    ...dictamenes.docs.map((doc) => toPost(doc, 'dictamenes', 'Dictámenes', nombres, fotos)),
    ...actividades.docs.map((doc) => toPost(doc, 'actividades', 'Actividades', nombres, fotos)),
    ...noticias.docs.map((doc) => toPost(doc, 'noticias', 'Comunicación', nombres, fotos)),
  ].filter((post): post is Post => Boolean(post))

  if (!items.length) return localPosts
  return items.sort((a, b) => b.date.localeCompare(a.date))
}

const loadPostsPerRequest = cache(loadPostsFromDatabase)

/** En producción (y en el build) todas las fichas comparten una sola lectura. */
let postsPromise: Promise<Post[]> | undefined

export function loadPosts(): Promise<Post[]> {
  if (process.env.NODE_ENV === 'production') {
    postsPromise ??= loadPostsFromDatabase().catch((error) => {
      postsPromise = undefined
      throw error
    })
    return postsPromise
  }
  return loadPostsPerRequest()
}

export async function loadPost(slug: string) {
  const items = await loadPosts()
  return items.find((post) => post.slug === slug)
}

export async function loadPage(slug: string): Promise<PageContent | undefined> {
  return localPages[slug]
}
