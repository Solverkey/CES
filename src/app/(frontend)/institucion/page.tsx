import { RichPage } from '@/components/RichPage'

export const metadata = { title: 'Institución' }

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
