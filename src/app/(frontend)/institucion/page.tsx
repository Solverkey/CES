import { RichPage } from '@/components/RichPage'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Institución',
  description: 'Naturaleza, composición y funciones del Consejo Económico y Social de La Rioja.',
  path: '/institucion',
})

export default function InstitucionPage() {
  return (
    <RichPage
      slug="institucion"
      image="/brand/pages/institucion.jpg"
      position="center center"
      indexTitle="LAS INSTITUCIONES"
      index={[
        { href: '#saludo', label: 'SALUDO DEL PRESIDENTE' },
        { href: '#naturaleza', label: 'NATURALEZA' },
        { href: '#composicion', label: 'COMPOSICIÓN' },
        { href: '#funciones', label: 'FUNCIONES' },
      ]}
    />
  )
}
