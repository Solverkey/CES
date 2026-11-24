import { Archive } from '@/components/Archive'

export const metadata = { title: 'Actividades' }

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
