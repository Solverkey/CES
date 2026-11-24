import Link from 'next/link'

import { formatDate, type Post } from '@/lib/content'

export type CardVariant = 'plain' | 'media' | 'classic'

function blurb(post: Post, variant: CardVariant) {
  if (variant === 'media') {
    const plain = post.html
      .replace(/<img[^>]*>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return plain || post.excerpt
  }
  if (variant === 'classic') {
    const text = post.excerpt || ''
    if (/descarga|\.pdf/i.test(text) && !/comisi[oó]n/i.test(text)) return ''
    return text
  }
  if (post.lugar || post.fechaTexto || post.hora) return post.excerpt
  return post.excerpt
}

function moreLabel(post: Post, variant: CardVariant) {
  if (variant === 'classic' && post.category === 'dictamenes') return 'Ver Dictámen en texto completo »'
  if (variant === 'media') return 'Leer más »'
  return 'Ver más'
}

export function PostCard({ post, variant = 'plain' }: { post: Post; variant?: CardVariant }) {
  const text = blurb(post, variant)
  const href = `/${post.slug}`

  return (
    <article className={`card is-${variant}`}>
      {variant === 'media' ? (
        <Link className="card-media" href={href}>
          {post.image ? <img src={post.image} alt="" /> : null}
          <span className="card-badge">{post.categoryLabel}</span>
        </Link>
      ) : null}
      <div className="card-body">
        {variant === 'plain' ? <p className="card-cat">{post.categoryLabel}</p> : null}
        <h3>
          <Link href={href}>{post.title}</Link>
        </h3>
        {variant === 'plain' ? (
          <p className="card-rule" aria-hidden="true">
            —
          </p>
        ) : null}
        {variant === 'classic' && post.date ? <p className="card-date">{formatDate(post.date)}</p> : null}
        {text ? <p className="card-excerpt">{text}</p> : null}
        <Link className={variant === 'plain' ? 'btn' : 'card-more'} href={href}>
          {moreLabel(post, variant)}
        </Link>
      </div>
      {variant === 'media' && post.date ? <p className="card-foot">{formatDate(post.date)}</p> : null}
    </article>
  )
}

export function PostGrid({ posts, variant = 'plain' }: { posts: Post[]; variant?: CardVariant }) {
  if (!posts.length) {
    return <p className="empty">No hay publicaciones con esos criterios.</p>
  }
  return (
    <div className={`grid grid-${variant}`}>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} variant={variant} />
      ))}
    </div>
  )
}
