import { UnauthorizedError, type PayloadRequest } from 'payload'

const caps = { create: true, delete: true, find: true, update: true }

/**
 * El plugin MCP 3.94 crea una colección propia de claves. No se usa:
 * la petición se autentica con la clave API del usuario del panel
 * (`Authorization: users API-Key …`). Las operaciones siguen el acceso de ese usuario.
 */
export async function mcpAccess(req: PayloadRequest) {
  const { user } = await req.payload.auth({ headers: req.headers })
  if (!user) throw new UnauthorizedError()
  return {
    user,
    dictamenes: caps,
    actividades: caps,
    noticias: caps,
    imagenes: caps,
    documentos: caps,
    comisiones: caps,
    redirects: caps,
  }
}
