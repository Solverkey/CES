import { RichPage } from '@/components/RichPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Política de cookies',
  description: 'Cookies y almacenamiento que usa el sitio del Consejo Económico y Social de La Rioja.',
  path: '/politica-de-cookies',
})

export default function CookiesPage() {
  return <RichPage slug="politica-de-cookies" />
}
