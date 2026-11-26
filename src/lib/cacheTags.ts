/** Etiqueta de la caché de fichas publicadas. Se invalida al guardar en el panel. */
export const POSTS_TAG = 'posts'

/**
 * La publicación programada corre fuera de una petición de Next y no puede invalidar la etiqueta.
 * Este contador cambia la clave de caché en el mismo proceso.
 */
let postsCacheEpoch = 0

export function currentPostsCacheEpoch() {
  return postsCacheEpoch
}

export function bumpPostsCacheEpoch() {
  postsCacheEpoch += 1
}
