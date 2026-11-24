import { Archive } from '@/components/Archive'

export const metadata = { title: 'Dictámenes' }

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
