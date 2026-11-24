import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: { useAsTitle: 'nombre', defaultColumns: ['nombre', 'email'], group: 'Ajustes' },
  auth: true,
  access: {
    // El nombre del autor se muestra en las fichas («Escrito por …»).
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [{ name: 'nombre', label: 'Nombre visible', type: 'text', required: true }],
}
