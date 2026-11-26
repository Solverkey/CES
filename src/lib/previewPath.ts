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
