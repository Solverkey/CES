import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { getPayload } from 'payload'

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

function fileUrl(value: unknown) {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'url' in value && typeof value.url === 'string') return value.url
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

function toPost(doc: Doc, category: Category, categoryLabel: string): Post | null {
  if (!doc.slug || !doc.title) return null
  const date = (doc.fecha || doc.publishedAt || '').slice(0, 10)
  return {
    slug: doc.slug,
    title: doc.title,
    date,
    category,
    categoryLabel,
    excerpt: doc.extracto || doc.resumen || '',
    image: fileUrl(doc.imagen) || doc.imagenUrl || null,
    pdf: fileUrl(doc.pdf) || doc.archivoUrl || null,
    lugar: doc.lugar || '',
    fechaTexto: '',
    hora: doc.hora || '',
    comision: textOf(doc.comision),
    html: cuerpoHtml(doc.cuerpo),
  }
}

export async function loadPosts(): Promise<Post[]> {
  const payload = await payloadOrNull()
  if (!payload) return localPosts

  const [dictamenes, actividades, noticias] = await Promise.all([
    payload.find({ collection: 'dictamenes', limit: 500, depth: 1, sort: '-fecha', pagination: false }),
    payload.find({ collection: 'actividades', limit: 200, depth: 0, sort: '-publishedAt', pagination: false }),
    payload.find({ collection: 'noticias', limit: 200, depth: 1, sort: '-publishedAt', pagination: false }),
  ])

  const items = [
    ...dictamenes.docs.map((doc) => toPost(doc, 'dictamenes', 'Dictámenes')),
    ...actividades.docs.map((doc) => toPost(doc, 'actividades', 'Actividades')),
    ...noticias.docs.map((doc) => toPost(doc, 'noticias', 'Comunicación')),
  ].filter((post): post is Post => Boolean(post))

  if (!items.length) return localPosts
  return items.sort((a, b) => b.date.localeCompare(a.date))
}

export async function loadPost(slug: string) {
  const items = await loadPosts()
  return items.find((post) => post.slug === slug)
}

export async function loadPage(slug: string): Promise<PageContent | undefined> {
  return localPages[slug]
}
