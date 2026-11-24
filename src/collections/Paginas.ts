import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { pageBlocks } from '../blocks'
import { slugField, wpIdField } from '../fields/slug'
import { revalidateDelete, revalidateDoc } from '../hooks/revalidate'

/**
 * Páginas montadas con bloques: Inicio (slug «inicio» → /), Institución, Transparencia,
 * Enlaces de interés, Contacto y legales.
 * Los listados /dictamenes, /actividades y /comunicacion tienen ruta propia en Next;
 * si existe una página con ese slug, se usa para la cabecera y el SEO del listado.
 */
export const Paginas: CollectionConfig = {
  slug: 'paginas',
  labels: { singular: 'Página', plural: 'Páginas' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt', '_status'],
    group: 'Contenido',
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    {
      name: 'layout',
      label: 'Contenido de la página',
      type: 'blocks',
      blocks: pageBlocks,
    },
    { name: 'cuerpo', label: 'Texto de la página', type: 'textarea' },
    slugField(),
    wpIdField,
  ],
  hooks: {
    afterChange: [revalidateDoc()],
    afterDelete: [revalidateDelete()],
  },
}
