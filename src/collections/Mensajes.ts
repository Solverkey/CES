import { APIError, type CollectionConfig } from 'payload'

import { authenticated } from '../access'
import { validarMensaje } from '../lib/mensaje'

/** Mensajes del formulario de contacto. Solo los lee el personal del panel. */
export const Mensajes: CollectionConfig = {
  slug: 'mensajes',
  labels: { singular: 'Mensaje', plural: 'Mensajes' },
  admin: {
    group: 'Ajustes',
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'correo', 'createdAt'],
  },
  access: {
    // El alta pública solo pasa por la acción del formulario, que marca el contexto.
    create: () => false,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (!req.context.contactoConsentido) {
          throw new APIError('El mensaje solo se acepta desde el formulario de contacto.', 403)
        }
        const parsed = validarMensaje({
          nombre: String(data?.nombre || ''),
          apellidos: String(data?.apellidos || ''),
          correo: String(data?.correo || ''),
          telefono: String(data?.telefono || ''),
          mensaje: String(data?.mensaje || ''),
          privacidad: true,
          completo: false,
        })
        if (!parsed.ok) throw new APIError(parsed.error, 400)
        return { ...data, ...parsed.data }
      },
    ],
  },
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'apellidos', label: 'Apellidos', type: 'text' },
    { name: 'correo', label: 'Correo', type: 'email', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'text' },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true },
  ],
}
