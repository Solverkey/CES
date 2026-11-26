import { RichPage } from '@/components/RichPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Transparencia',
  description: 'Organizaciones representadas, miembros y funcionamiento del Consejo Económico y Social de La Rioja.',
  path: '/transparencia',
})

export default function TransparenciaPage() {
  return (
    <RichPage
      slug="transparencia"
      image="/brand/pages/transparencia.jpg"
      position="63% -10px"
      indexTitle="ORGANOS"
      index={[
        { href: '#organizaciones-representadas-expertos', label: 'Organizaciones representadas y expertos' },
        { href: '#miembros-colectivos', label: 'Miembros y colectivos' },
        { href: '#funcionamiento', label: 'Funcionamiento' },
      ]}
    />
  )
}
