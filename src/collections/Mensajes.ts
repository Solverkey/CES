import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

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
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'apellidos', label: 'Apellidos', type: 'text' },
    { name: 'correo', label: 'Correo', type: 'email', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'text' },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true },
  ],
}
