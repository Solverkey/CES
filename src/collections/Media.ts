import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

/** Imágenes. El texto alternativo es obligatorio (en WordPress faltaba en muchas). */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  admin: { group: 'Archivos' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      required: true,
      admin: { description: 'Describe la imagen para lectores de pantalla y buscadores.' },
    },
    { name: 'pie', label: 'Pie de foto', type: 'text' },
    { name: 'wpUrl', label: 'URL original en WordPress', type: 'text', index: true, admin: { readOnly: true } },
  ],
  upload: {
    staticDir: 'uploads/media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 768 },
      { name: 'large', width: 1600 },
    ],
  },
}
