import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** Fotos de las noticias. No aparece en el menú: se suben desde la ficha. */
export const Imagenes: CollectionConfig = {
  slug: 'imagenes',
  labels: { singular: 'Foto', plural: 'Fotos' },
  admin: { hidden: true },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    staticDir: path.resolve(dirname, '../../media/imagenes'),
  },
  fields: [],
}
