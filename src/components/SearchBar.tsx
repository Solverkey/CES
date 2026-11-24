export function SearchBar({
  categoria = '0',
  q = '',
  desde = '',
  hasta = '',
}: {
  categoria?: string
  q?: string
  desde?: string
  hasta?: string
}) {
  return (
    <form className="search" action="/buscar" method="get">
      <input type="search" name="q" placeholder="Buscar..." aria-label="Buscar" defaultValue={q} />
      <input type="date" name="desde" aria-label="Desde" defaultValue={desde} />
      <input type="date" name="hasta" aria-label="Hasta" defaultValue={hasta} />
      <select name="categoria" defaultValue={categoria} aria-label="Categoría">
        <option value="0">Todas las categorías</option>
        <option value="actividades">Actividades</option>
        <option value="dictamenes">Dictámenes</option>
        <option value="noticias">Comunicación</option>
      </select>
      <button type="submit">Realizar busqueda</button>
    </form>
  )
}
