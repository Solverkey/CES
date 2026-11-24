import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import type { FieldHook, RichTextField } from 'payload'

/** El importador guarda HTML. El panel guarda el editor enriquecido. */
const htmlToLexical: FieldHook = async ({ value, req }) => {
  if (typeof value !== 'string') return value
  const html = value.trim()
  if (!html) return null
  const editorConfig = await editorConfigFactory.default({ config: req.payload.config })
  return convertHTMLToLexical({ editorConfig, html, JSDOM })
}

export const cuerpoField: RichTextField = {
  name: 'cuerpo',
  label: 'Texto de la ficha',
  type: 'richText',
  hooks: { beforeValidate: [htmlToLexical] },
}
