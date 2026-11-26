import { RichPage } from '@/components/RichPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Enlaces de interés',
  description: 'Enlaces a los consejos económicos y sociales de España y de las comunidades autónomas.',
  path: '/enlaces-de-interes',
})

export default function EnlacesPage() {
  return <RichPage slug="enlaces-de-interes" image="/brand/pages/enlaces.jpg" position="center 80%" />
}
