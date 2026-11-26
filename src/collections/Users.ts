import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: { useAsTitle: 'nombre', defaultColumns: ['nombre', 'email'], group: 'Ajustes' },
  auth: { useAPIKey: true },
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
  ],
}
