import './styles/StatusBadge.css'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'warning'
      case 'PROCESSING':
        return 'info'
      case 'COMPLETED':
        return 'success'
      case 'FAILED':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <span className={`status-badge status-badge--${getStatusColor(status)}`}>
      {status}
    </span>
  )
}
