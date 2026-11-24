import Link from 'next/link'
import { notFound } from 'next/navigation'

import { loadPost } from '@/lib/cms'
import { findPost, formatDate, posts } from '@/lib/content'

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = (await loadPost(slug)) || findPost(slug)
  return { title: post?.title || 'Publicación' }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = (await loadPost(slug)) || findPost(slug)
  if (!post) notFound()

  const section = post.category === 'noticias' ? '/comunicacion' : `/${post.category}`

  return (
    <article className="post">
      <div className="page-head">
        <div className="container">
          <p className="eyebrow">
            <Link href={section}>{post.categoryLabel}</Link>
          </p>
          <h1>{post.title}</h1>
          {post.date ? <p className="card-date">{formatDate(post.date)}</p> : null}
        </div>
      </div>
      <div className="container post-layout">
        {post.image ? <img className="post-image" src={post.image} alt="" /> : null}
        {post.lugar || post.fechaTexto || post.hora || post.comision ? (
          <ul className="post-meta">
            {post.lugar ? <li>Lugar: {post.lugar}</li> : null}
            {post.fechaTexto ? <li>Fecha: {post.fechaTexto}</li> : null}
            {post.hora ? <li>Hora: {post.hora}</li> : null}
            {post.comision ? <li>{post.comision}</li> : null}
          </ul>
        ) : null}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        {post.pdf ? (
          <p>
            <a className="btn" href={post.pdf} target="_blank" rel="noopener noreferrer">
              Ver documento
            </a>
          </p>
        ) : null}
      </div>
    </article>
  )
}
