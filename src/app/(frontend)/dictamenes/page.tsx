import { Archive } from '@/components/Archive'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Dictámenes',
  description: 'Dictámenes emitidos por el Consejo Económico y Social de La Rioja.',
  path: '/dictamenes',
})

export default function DictamenesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  return (
    <Archive
      title="Dictámenes"
      category="dictamenes"
      image="/brand/pages/dictamenes.jpg"
      position="top right"
      variant="classic"
      pageSize={10}
      searchParams={searchParams}
    />
  )
}
