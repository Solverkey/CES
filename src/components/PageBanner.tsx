import { SearchBar } from '@/components/SearchBar'

export function PageBanner({
  title,
  image,
  position = 'center center',
  categoria = '0',
  search = true,
}: {
  title: string
  image: string
  position?: string
  categoria?: string
  search?: boolean
}) {
  return (
    <>
      <section className="page-banner">
        <div className="page-banner-title">
          <h1>{title}</h1>
          <span className="banner-mark" aria-hidden="true">
            <span className="banner-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="banner-line" />
          </span>
        </div>
        <div className="page-banner-photo" style={{ backgroundImage: `url(${image})`, backgroundPosition: position }} />
      </section>
      {search ? (
        <div className="container band overlap">
          <SearchBar categoria={categoria} />
        </div>
      ) : null}
    </>
  )
}
