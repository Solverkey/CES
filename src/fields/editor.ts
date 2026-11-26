import {
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/** Funciones de serie, subida solo de fotos y tabla. */
export const editor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((feature) => feature.key !== 'upload'),
    UploadFeature({ enabledCollections: ['imagenes'] }),
    FixedToolbarFeature(),
    EXPERIMENTAL_TableFeature(),
  ],
})
