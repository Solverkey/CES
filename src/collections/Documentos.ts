import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * PDFs de las fichas. No aparece en el menú: se suben desde el dictamen.
 */
export const Documentos: CollectionConfig = {
  slug: 'documentos',
  labels: { singular: 'PDF', plural: 'PDFs' },
  admin: { hidden: true },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  upload: {
    mimeTypes: ['application/pdf'],
    staticDir: path.resolve(dirname, '../../media/documentos'),
  },
  fields: [],
}
