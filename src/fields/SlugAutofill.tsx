'use client'

import { TextField, useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { useEffect, useRef } from 'react'

import { slugify } from './slugify'

export const SlugAutofill: TextFieldClientComponent = (props) => {
  const { value, setValue } = useField<string>({ path: props.path })
  const title = useFormFields(([fields]) => (typeof fields.title?.value === 'string' ? fields.title.value : ''))
  const ready = useRef(false)
  const generated = useRef<string | null>(null)

  useEffect(() => {
    const current = typeof value === 'string' ? value : ''
    if (!ready.current) {
      ready.current = true
      if (current) return
    }
    if (current && current !== generated.current) return
    const next = slugify(title)
    generated.current = next
    if (current !== next) setValue(next)
  }, [setValue, title, value])

  return <TextField {...props} />
}
