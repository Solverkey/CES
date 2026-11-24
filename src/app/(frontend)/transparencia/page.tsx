import { RichPage } from '@/components/RichPage'

export const metadata = { title: 'Transparencia' }

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
