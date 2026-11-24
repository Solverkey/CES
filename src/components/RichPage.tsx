import { PageBanner } from '@/components/PageBanner'
import { loadPage } from '@/lib/cms'

const ANCHORS: Record<string, string> = {
  'saludo del presidente': 'saludo',
  naturaleza: 'naturaleza',
  composición: 'composicion',
  funciones: 'funciones',
  'organizaciones representadas y expertos': 'organizaciones-representadas-expertos',
  'miembros y colectivos': 'miembros-colectivos',
  funcionamiento: 'funcionamiento',
}

function dropImportedIndex(html: string) {
  return html.replace(/<h4>[\s\S]*?<\/h4>(\s*<ul>[\s\S]*?<\/ul>)+/gi, '')
}

function headingText(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function anchorize(html: string) {
  return html.replace(/<h2>([\s\S]*?)<\/h2>/gi, (_, inner: string) => {
    const text = headingText(inner)
    const key = text.toLowerCase()
    if (['institución', 'transparencia', 'enlaces de interés', 'aviso legal', 'política de privacidad', 'política de cookies'].includes(key)) {
      return ''
    }
    const id =
      ANCHORS[key] ||
      key
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    return `<h2 id="${id}">${inner.trim()}</h2>`
  })
}

export async function RichPage({
  slug,
  image,
  position,
  indexTitle,
  index = [],
}: {
  slug: string
  image?: string
  position?: string
  indexTitle?: string
  index?: { href: string; label: string }[]
}) {
  const page = await loadPage(slug)
  const html = dropImportedIndex(
    anchorize(
      (page?.html || '').replace(/^<h2>.*?<\/h2>/, ''),
    ),
  )

  return (
    <>
      {image ? <PageBanner title={page?.title || ''} image={image} position={position} /> : (
        <div className="page-head">
          <div className="container">
            <h1>{page?.title}</h1>
          </div>
        </div>
      )}
      <div className={index.length ? 'container page-split' : 'container'}>
        <article
          className={`prose inner-prose${slug === 'enlaces-de-interes' ? ' is-enlaces' : ''}${index.length ? ' is-interior' : ''}`}
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        {index.length ? (
          <aside className="page-index">
            <h2>{indexTitle}</h2>
            <span className="index-dots" aria-hidden="true">
              •••
            </span>
            <span className="index-line" />
            <nav>
              {index.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
        ) : null}
      </div>
    </>
  )
}
