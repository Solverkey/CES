import Link from 'next/link'

export default function NotFound() {
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
