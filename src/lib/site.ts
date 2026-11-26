/** URL pública del sitio. Sirve para canonical, sitemap y datos estructurados. */
export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SERVER_URL || ''
  if (/^https?:\/\//.test(raw)) return raw.replace(/\/$/, '')
  return 'https://www.ceslarioja.org'
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path
  const base = siteUrl()
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
