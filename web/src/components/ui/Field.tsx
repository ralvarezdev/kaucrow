import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useId } from 'react'
import { cx } from '@/lib/cx'
import styles from './Field.module.css'

type FieldBase = { label: ReactNode }

export type TextFieldProps = FieldBase & ComponentPropsWithoutRef<'input'> & { multiline?: false }
export type TextAreaFieldProps = FieldBase &
  ComponentPropsWithoutRef<'textarea'> & { multiline: true }

export function Field(props: TextFieldProps | TextAreaFieldProps) {
  const id = useId()

  if (props.multiline) {
    const { label, multiline: _m, className, ...rest } = props
    return (
      <div className={styles.field}>
        <label htmlFor={id}>{label}</label>
        <textarea id={id} rows={3} className={cx(styles.control, className)} {...rest} />
      </div>
    )
  }

  const { label, multiline: _m, className, ...rest } = props
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input id={id} className={cx(styles.control, className)} {...rest} />
    </div>
  )
}
