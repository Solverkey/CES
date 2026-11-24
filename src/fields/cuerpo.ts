import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import type { FieldHook, RichTextField } from 'payload'

type LexicalNode = {
  type?: string
  pending?: { src?: string }
  children?: LexicalNode[]
}

/** Una imagen externa se convierte en una subida pendiente y el editor intenta descargarla. */
function dropPendingUploads(value: unknown) {
  if (!value || typeof value !== 'object' || !('root' in value)) return value
  const root = (value as { root?: { children?: LexicalNode[] } }).root
  if (!root?.children) return value

  const walk = (nodes: LexicalNode[]): LexicalNode[] =>
    nodes.flatMap((node) => {
      if (node?.type === 'upload' && node.pending?.src) return []
      if (Array.isArray(node?.children)) return [{ ...node, children: walk(node.children) }]
      return [node]
    })

  return { ...value, root: { ...root, children: walk(root.children) } }
}

/** El importador guarda HTML. El panel guarda el editor enriquecido. */
const htmlToLexical: FieldHook = async ({ value, req }) => {
  if (typeof value !== 'string') return value
  const html = value.replace(/<img\b[^>]*>/gi, '').trim()
  if (!html) return null
  const editorConfig = await editorConfigFactory.default({ config: req.payload.config })
  return convertHTMLToLexical({ editorConfig, html, JSDOM })
}

export const cuerpoField: RichTextField = {
  name: 'cuerpo',
  label: 'Texto de la ficha',
  type: 'richText',
  hooks: {
    beforeValidate: [htmlToLexical],
    afterRead: [({ value }) => dropPendingUploads(value)],
  },
}
