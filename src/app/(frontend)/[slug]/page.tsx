import Link from 'next/link'
import { notFound } from 'next/navigation'

import { loadPosts } from '@/lib/cms'
import { findPost, posts, type Post } from '@/lib/content'

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

function heroDate(iso: string) {
  const [year, month, day] = iso.split('-')
  const name = MESES[Number(month) - 1]
  if (!year || !name || !day) return iso
  return `${Number(day)}, ${name} ${year}`
}

/** La foto va debajo del texto, justo antes de la fecha corta, como en la web. */
function bodyHtml(post: Post) {
  if (!post.image || /<img\b/i.test(post.html)) return post.html
  const photo = `<img src="${post.image.replace(/"/g, '')}" alt="">`
  const dated = post.html.match(/^(.*)(<p>\s*\d{2}\/\d{2}\/\d{4}\s*<\/p>)\s*$/s)
  if (dated) return `${dated[1]}${photo}${dated[2]}`
  return `${post.html}${photo}`
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = (await loadPosts()).find((item) => item.slug === slug) || findPost(slug)
  return { title: post?.title || 'Publicación' }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const loaded = await loadPosts()
  const post = loaded.find((item) => item.slug === slug) || findPost(slug)
  if (!post) notFound()

  const siblings = loaded.filter((item) => item.category === post.category)
  const index = siblings.findIndex((item) => item.slug === post.slug)
  const newer = index > 0 ? siblings[index - 1] : undefined
  const older = index >= 0 ? siblings[index + 1] : undefined
  const showPdf = Boolean(post.pdf && !post.html.includes(post.pdf))

  return (
    <article className="post">
      <header
        className="post-hero"
        style={post.image ? { backgroundImage: `url(${post.image})` } : undefined}
      >
        <div className="post-hero-inner">
          <h1>{post.title}</h1>
          {post.date ? (
            <p className="post-hero-date">
              <CalendarIcon />
              {heroDate(post.date)}
            </p>
          ) : null}
        </div>
      </header>
      <div className="post-sheet">
        <div className="prose" dangerouslySetInnerHTML={{ __html: bodyHtml(post) }} />
        {showPdf ? (
          <p>
            <a className="btn" href={post.pdf!} target="_blank" rel="noopener noreferrer">
              Ver documento
            </a>
          </p>
        ) : null}
        {older || newer ? (
          <nav className="post-nav" aria-label="Otras publicaciones">
            {older ? <Neighbour label="Anterior" post={older} /> : <span />}
            {newer ? <Neighbour label="Siguiente" post={newer} /> : null}
          </nav>
        ) : null}
      </div>
    </article>
  )
}

function Neighbour({ label, post }: { label: string; post: Post }) {
  return (
    <Link className="post-neighbour" href={`/${post.slug}`}>
      <span>{label}</span>
      {post.title}
    </Link>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2zm13 8H4v10h16V10zM4 8h16V6H4v2z"
      />
    </svg>
  )
}
