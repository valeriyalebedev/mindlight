import type { ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonProps = {
  children?: ReactNode
  type: "button" | "submit"
  disabled?: boolean
  onClick?: () => void
}

function MainButton({ children, type, disabled, onClick }: ButtonProps) {

  return (
    <button className={styles.mainButton} type={type} onClick={onClick} disabled={disabled}>{children}</button>
  )
}

export default MainButton