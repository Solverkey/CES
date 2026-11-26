import type { MetadataRoute } from 'next'

import { loadPublishedPosts } from '@/lib/cms'
import { siteUrl } from '@/lib/site'

const PATHS = [
  '/',
  '/institucion',
  '/actividades',
  '/dictamenes',
  '/comunicacion',
  '/transparencia',
  '/enlaces-de-interes',
  '/contacto',
  '/buscar',
  '/politica-de-privacidad',
  '/aviso-legal',
  '/politica-de-cookies',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const posts = await loadPublishedPosts()
  const staticEntries: MetadataRoute.Sitemap = PATHS.map((path) => ({
    url: path === '/' ? `${base}/` : `${base}${path}`,
  }))
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : undefined,
  }))
  return [...staticEntries, ...postEntries]
}
