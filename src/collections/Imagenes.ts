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
  fields: [],
}
