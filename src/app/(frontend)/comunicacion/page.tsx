import { Archive } from '@/components/Archive'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Comunicación',
  description: 'Notas y comunicaciones del Consejo Económico y Social de La Rioja.',
  path: '/comunicacion',
})

export default function ComunicacionPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  return (
    <Archive
      title="Comunicación"
      category="noticias"
      image="/brand/pages/comunicacion.jpg"
      position="center right"
      searchParams={searchParams}
    />
  )
}
