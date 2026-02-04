import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './styles/Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  children: ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'medium', 
  loading = false,
  disabled,
  className = '',
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner">
          <span className="spinner"></span>
          Carregando...
        </span>
      ) : children}
    </button>
  )
}
