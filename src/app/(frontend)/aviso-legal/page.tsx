import { RichPage } from '@/components/RichPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Aviso legal',
  description: 'Titular, propiedad intelectual y responsabilidad del sitio del Consejo Económico y Social de La Rioja.',
  path: '/aviso-legal',
})

export default function AvisoLegalPage() {
  return <RichPage slug="aviso-legal" />
}
