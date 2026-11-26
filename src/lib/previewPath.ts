/** Origen de la vista previa. Fuera de local, si no llega el protocolo, se usa HTTPS. */
export function previewOrigin(
  headers: { get(name: string): string | null },
  configured = process.env.NEXT_PUBLIC_SERVER_URL || '',
) {
  const host = headers.get('host') || ''
  const forwarded = (headers.get('x-forwarded-proto') || '').split(',')[0].trim().toLowerCase()
  const local = /^(localhost|127\.0\.0\.1)(:|$)/.test(host)
  const proto = forwarded === 'http' || forwarded === 'https' ? forwarded : local ? 'http' : 'https'
  if (host) return `${proto}://${host}`
  if (/^https?:\/\//.test(configured)) return configured.replace(/\/$/, '')
  return 'http://localhost:3000'
}

/** Ruta interna de la vista previa. Rechaza destinos que el navegador leería como otra web. */
export function safePreviewPath(raw: string) {
  let path = raw
  try {
    path = decodeURIComponent(raw)
  } catch {
    return '/'
  }
  path = path.replace(/\\/g, '/')
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('..')) return '/'
  if (path.startsWith('/admin') || path.startsWith('/api')) return '/'
  if (/[\u0000-\u001f\u007f]/.test(path)) return '/'
  return path
}
