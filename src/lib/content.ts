import pagesJson from '@/content/pages.json'
import postsJson from '@/content/posts.json'

export type Category = 'actividades' | 'dictamenes' | 'noticias' | 'otros'

export type Post = {
  slug: string
  title: string
  date: string
  category: Category
  categoryLabel: string
  excerpt: string
  image: string | null
  pdf: string | null
  lugar: string
  fechaTexto: string
  hora: string
  comision: string
  html: string
  seoTitle?: string
  seoDescription?: string
  seoImage?: string | null
  imageAlt?: string
}

export type PageContent = {
  title: string
  html: string
  links?: { label: string; href: string }[]
}

export const posts = postsJson as Post[]
export const pages = pagesJson as Record<string, PageContent>
export const PAGE_SIZE = 9

const CATEGORIES = new Set<string>(['actividades', 'dictamenes', 'noticias', 'otros'])

export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return iso
  return `${day}/${month}/${year}`
}

export function postsByCategory(category: Category) {
  return posts.filter((post) => post.category === category)
}

export function findPost(slug: string) {
  return posts.find((post) => post.slug === slug)
}

export type SearchQuery = {
  q?: string
  categoria?: string
  desde?: string
  hasta?: string
}

export function searchPosts(query: SearchQuery, source: Post[] = posts) {
  const text = (query.q || '').trim().toLowerCase()
  const categoria = query.categoria && CATEGORIES.has(query.categoria) ? query.categoria : ''
  return source.filter((post) => {
    if (categoria && post.category !== categoria) return false
    if (query.desde && post.date < query.desde) return false
    if (query.hasta && post.date > query.hasta) return false
    if (!text) return true
    const plain = `${post.title} ${post.excerpt} ${post.comision} ${post.html.replace(/<[^>]+>/g, ' ')}`
    return plain.toLowerCase().includes(text)
  })
}

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / size))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * size
  return { items: items.slice(start, start + size), page: current, totalPages, total: items.length }
}

export function pageNumber(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value
  const number = Number(raw)
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 1
}

export function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) || ''
}
