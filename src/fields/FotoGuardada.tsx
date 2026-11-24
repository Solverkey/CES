'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

/** La foto que ya tiene la ficha, cuando aún no hay un archivo subido. */
export const FotoGuardada: TextFieldClientComponent = (props) => {
  const { value } = useField<string>({ path: props.path })
  const selected = useFormFields(([fields]) => fields.imagen?.value)
  const url = typeof value === 'string' && value.startsWith('http') ? value : ''
  if (!url || selected) return null

  return <img src={url} alt="" style={{ display: 'block', width: '100%', maxWidth: 520, margin: '4px 0 16px' }} />
}
