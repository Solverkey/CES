import { RichPage } from '@/components/RichPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Política de privacidad',
  description: 'Cómo trata los datos personales el Consejo Económico y Social de La Rioja.',
  path: '/politica-de-privacidad',
})

export default function PrivacidadPage() {
  return <RichPage slug="politica-de-privacidad" />
}
