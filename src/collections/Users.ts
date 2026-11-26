import type { CollectionConfig, FieldAccess } from 'payload'

import { authenticated } from '../access'

/** La clave de API solo la ve y la cambia su dueño. */
const selfOnly: FieldAccess = ({ req, id }) => Boolean(req.user && id != null && String(req.user.id) === String(id))

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: { useAsTitle: 'nombre', defaultColumns: ['nombre', 'email'], group: 'Ajustes' },
  auth: {
    // La clave no viaja en las lecturas. El panel la muestra con el endpoint de revelar, solo a su dueño.
    useAPIKey: { reveal: true },
  },
  access: {
    // El nombre del autor se puede mostrar en las fichas. El correo no es público.
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      access: { read: ({ req: { user } }) => Boolean(user) },
    },
    { name: 'nombre', label: 'Nombre visible', type: 'text', required: true },
    { name: 'enableAPIKey', type: 'checkbox', access: { read: selfOnly, update: selfOnly } },
    { name: 'apiKey', type: 'text', access: { read: () => false, update: selfOnly } },
    { name: 'apiKeyIndex', type: 'text', access: { read: () => false, update: selfOnly } },
    { name: 'hasAPIKey', type: 'checkbox', access: { read: selfOnly } },
  ],
}
