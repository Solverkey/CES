import type { CollectionSlug, Field, FieldHook, TextFieldSingleValidation } from 'payload'

/**
 * Colecciones que comparten la raíz del sitio (ceslarioja.org/<slug>/).
 * Un slug no puede repetirse entre ellas, porque /[slug] tiene que resolver a un único documento.
 */
export const ROOT_COLLECTIONS = ['dictamenes', 'actividades', 'noticias'] as const satisfies CollectionSlug[]

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[/.]/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const fallback = data?.[fallbackField]
    if (typeof fallback === 'string') return slugify(fallback)
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

export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  label: 'Slug (URL)',
  type: 'text',
  index: true,
  required: true,
  validate: uniqueAcrossRoot,
  hooks: { beforeValidate: [formatSlug(fallbackField)] },
  admin: {
    position: 'sidebar',
    description: 'Se genera a partir del título. La URL será ceslarioja.org/<slug>/',
  },
})

/** ID original en WordPress: lo usa el script de migración para no duplicar. */
export const wpIdField: Field = {
  name: 'wpId',
  label: 'ID en WordPress',
  type: 'number',
  index: true,
  admin: { position: 'sidebar', readOnly: true },
}
