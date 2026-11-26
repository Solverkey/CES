import { headers } from 'next/headers'
import Link from 'next/link'

import { applyRedirect } from '@/lib/redirects'

export default async function NotFound() {
  const pathname = (await headers()).get('x-pathname') || ''
  if (pathname) await applyRedirect(pathname)

  return (
    <div className="page-head">
      <div className="container">
        <h1>Página no encontrada</h1>
        <p>
          <Link className="btn" href="/">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
