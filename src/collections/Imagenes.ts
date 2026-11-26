import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** Fotos de actividades y comunicación. Se suben aquí o desde la ficha. */
export const Imagenes: CollectionConfig = {
  slug: 'imagenes',
  labels: { singular: 'Foto', plural: 'Fotos' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'updatedAt'],
    description: 'Las fotos que se pueden elegir en actividades y comunicación.',
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    staticDir: path.resolve(dirname, '../../media/imagenes'),
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [
          ({ value, data, req }) => {
            if (typeof value === 'string' && value.trim()) return value.trim()
            const filename =
              (data && typeof data.filename === 'string' && data.filename) || req.file?.name || ''
            const fromName = filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
            return fromName || 'Fotografía'
          },
        ],
      },
    },
  ],
}
