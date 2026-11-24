import { Archive } from '@/components/Archive'

export const metadata = { title: 'Comunicación' }

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
