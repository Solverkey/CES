import Link from 'next/link'

function visiblePages(page: number, totalPages: number) {
  const wanted = new Set<number>([1, totalPages])
  for (let number = page - 1; number <= page + 1; number += 1) wanted.add(number)
  if (page <= 3) {
    wanted.add(2)
    wanted.add(3)
  }
  return [...wanted].filter((number) => number >= 1 && number <= totalPages).sort((a, b) => a - b)
}

export function Pager({
  page,
  totalPages,
  path,
  query = {},
}: {
  page: number
  totalPages: number
  path: string
  query?: Record<string, string>
}) {
  if (totalPages <= 1) return null

  const href = (next: number) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value)
    }
    if (next > 1) params.set('page', String(next))
    const search = params.toString()
    return search ? `${path}?${search}` : path
  }

  const numbers = visiblePages(page, totalPages)

  return (
    <nav className="pager" aria-label="Paginación">
      {numbers.map((number, index) => {
        const gap = index > 0 && number - numbers[index - 1] > 1
        return (
          <span key={number} className="pager-slot">
            {gap ? <span className="pager-dots">…</span> : null}
            {number === page ? (
              <span className="pager-current" aria-current="page">
                {number}
              </span>
            ) : (
              <Link href={href(number)}>{number}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
