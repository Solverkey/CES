import { Pager } from '@/components/Pager'
import { PostCard } from '@/components/PostCard'
import { SearchBar } from '@/components/SearchBar'
import { loadPosts } from '@/lib/cms'
import { one, pageNumber, paginate, searchPosts } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Buscar',
  description: 'Buscador de actividades, dictámenes y notas del Consejo Económico y Social de La Rioja.',
  path: '/buscar',
})

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const query = {
    q: one(params.q),
    categoria: one(params.categoria),
    desde: one(params.desde),
    hasta: one(params.hasta),
  }
  const result = paginate(searchPosts(query, await loadPosts()), pageNumber(params.page))

  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>Buscar</h1>
        </div>
      </div>
      <div className="container band">
        <SearchBar categoria={query.categoria || '0'} q={query.q} desde={query.desde} hasta={query.hasta} />
      </div>
      <section className="archive">
        <div className="container">
          <p className="result-count">
            {result.total} {result.total === 1 ? 'resultado' : 'resultados'}
          </p>
          {result.items.length ? (
            <div className="grid grid-media">
              {result.items.map((post) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  variant={post.category === 'dictamenes' ? 'classic' : 'media'}
                />
              ))}
            </div>
          ) : (
            <p className="empty">No hay publicaciones con esos criterios.</p>
          )}
          <Pager page={result.page} totalPages={result.totalPages} path="/buscar" query={query} />
        </div>
      </section>
    </>
  )
}
