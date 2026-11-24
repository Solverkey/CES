import { PageBanner } from '@/components/PageBanner'
import { Pager } from '@/components/Pager'
import { PostGrid } from '@/components/PostCard'
import { loadPosts } from '@/lib/cms'
import { pageNumber, paginate, type Category } from '@/lib/content'
import type { CardVariant } from '@/components/PostCard'

export async function Archive({
  title,
  category,
  image,
  position = 'center center',
  variant = 'media',
  pageSize = 6,
  searchParams,
}: {
  title: string
  category: Category
  image: string
  position?: string
  variant?: CardVariant
  pageSize?: number
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const params = await searchParams
  const items = (await loadPosts()).filter((post) => post.category === category)
  const result = paginate(items, pageNumber(params.page), pageSize)

  return (
    <>
      <PageBanner title={title} image={image} position={position} categoria={category} />
      <section className="archive">
        <div className="container">
          <PostGrid posts={result.items} variant={variant} />
          <Pager page={result.page} totalPages={result.totalPages} path={`/${category === 'noticias' ? 'comunicacion' : category}`} />
        </div>
      </section>
    </>
  )
}
