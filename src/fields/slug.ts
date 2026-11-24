import type { CollectionSlug, Field, FieldHook, TextFieldSingleValidation } from 'payload'

import { slugify } from './slugify'

/**
 * Colecciones que comparten la raíz del sitio (ceslarioja.org/<slug>/).
 * Un slug no puede repetirse entre ellas, porque /[slug] tiene que resolver a un único documento.
 */
export const ROOT_COLLECTIONS = ['dictamenes', 'actividades', 'noticias'] as const satisfies CollectionSlug[]

const fillFromTitle: FieldHook = ({ value, data, originalDoc }) => {
  if (typeof value === 'string' && value.length > 0) return slugify(value)
  const title = data?.title ?? originalDoc?.title
  if (typeof title === 'string') return slugify(title)
  return value
}

const uniqueAcrossRoot: TextFieldSingleValidation = async (value, { req, collectionSlug, id }) => {
  if (!value) return 'El slug es obligatorio'
  for (const collection of ROOT_COLLECTIONS) {
    const { docs } = await req.payload.find({
      collection,
      where: { slug: { equals: value } },
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true,
      req,
    })
    const clash = docs[0]
    if (clash && !(collection === collectionSlug && clash.id === id)) {
      return `Ya existe una entrada con el slug «${value}» en «${collection}». Las URLs cuelgan todas de la raíz, así que debe ser único.`
    }
  }
  return true
}

/** Se rellena solo mientras se escribe el título. Si se edita a mano, deja de pisarlo. */
export const slugField = (): Field => ({
  name: 'slug',
  label: 'Slug (URL)',
  type: 'text',
  index: true,
  required: true,
  validate: uniqueAcrossRoot,
  hooks: { beforeValidate: [fillFromTitle] },
  admin: {
    position: 'sidebar',
    description: 'Se rellena solo a partir del título. La URL será ceslarioja.org/<slug>/',
    components: {
      Field: '@/fields/SlugAutofill#SlugAutofill',
    },
  },
})
