import { Archive } from '@/components/Archive'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Actividades',
  description: 'Plenos, comisiones y demás actos del Consejo Económico y Social de La Rioja.',
  path: '/actividades',
})

export default function ActividadesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  return (
    <Archive
      title="Actividades"
      category="actividades"
      image="/brand/pages/actividades.jpg"
      position="center center"
      searchParams={searchParams}
    />
  )
}
