import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import './styles/Input.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input className={`input ${error ? 'input--error' : ''}`} {...props} />
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <textarea className={`input input-textarea ${error ? 'input--error' : ''}`} {...props} />
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
