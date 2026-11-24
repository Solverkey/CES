import type { Access } from 'payload'

/** Cualquiera puede leer. */
export const anyone: Access = () => true

/** Solo usuarios con sesión en el panel. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Público: solo lo publicado. Panel: también borradores. */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
