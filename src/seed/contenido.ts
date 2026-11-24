import type { Payload } from 'payload'

import postsJson from '../content/posts.json'

type StoredPost = {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  pdf: string | null
  image: string | null
  lugar: string
  hora: string
  html: string
}

const posts = postsJson as StoredPost[]

function dictamenNumbers(title: string, date: string) {
  const match = title.match(/(\d+)\s*\/\s*(\d{4})/)
  const anio = match ? Number(match[2]) : Number(date.slice(0, 4)) || 2000
  return { numero: match ? Number(match[1]) : 1, anio, fecha: date || `${anio}-01-01` }
}

function organo(title: string) {
  const value = title.toLowerCase()
  if (value.includes('permanente')) return 'permanente'
  if (value.includes('comisión') || value.includes('comision')) return 'comision-trabajo'
  if (value.includes('pleno')) return 'pleno'
  return 'otra'
}

export async function importarContenido(payload: Payload) {
  const context = { disableRevalidate: true }

  for (const post of posts) {
    const shared = {
      title: post.title,
      slug: post.slug,
      extracto: post.excerpt,
      cuerpo: post.html,
      publishedAt: post.date || undefined,
      _status: 'published' as const,
    }

    if (post.category === 'dictamenes') {
      const meta = dictamenNumbers(post.title, post.date)
      const existing = await payload.find({
        collection: 'dictamenes',
        where: { slug: { equals: post.slug } },
        limit: 1,
        depth: 0,
      })
      // El campo convierte el HTML a editor enriquecido al guardar.
      const data = { ...shared, ...meta, resumen: post.excerpt, archivoUrl: post.pdf || undefined } as never
      if (existing.docs[0]) {
        await payload.update({ collection: 'dictamenes', id: existing.docs[0].id, data, context })
      } else {
        await payload.create({ collection: 'dictamenes', data, context })
      }
      continue
    }

    const collection = post.category === 'actividades' ? 'actividades' : 'noticias'
    const existing = await payload.find({
      collection,
      where: { slug: { equals: post.slug } },
      limit: 1,
      depth: 0,
    })
    const data =
      collection === 'actividades'
        ? {
            ...shared,
            organo: organo(post.title),
            lugar: post.lugar || undefined,
            hora: post.hora || undefined,
            fechaActo: post.date || undefined,
            imagenUrl: post.image || undefined,
          }
        : { ...shared, imagenUrl: post.image || undefined }
    const payloadData = data as never
    if (existing.docs[0]) {
      await payload.update({ collection, id: existing.docs[0].id, data: payloadData, context })
    } else {
      await payload.create({ collection, data: payloadData, context })
    }
  }

  payload.logger.info(`Contenido importado: ${posts.length} publicaciones.`)
}
