import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, List } from 'lucide-react'
import './styles/Layout.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <FileText size={28} />
            <span>Submissions App</span>
          </div>
          <div className="navbar-links">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'nav-link--active' : ''}`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link 
              to="/create" 
              className={`nav-link ${isActive('/create') ? 'nav-link--active' : ''}`}
            >
              <FileText size={20} />
              <span>Nova Submissão</span>
            </Link>
            <Link 
              to="/submissions" 
              className={`nav-link ${isActive('/submissions') ? 'nav-link--active' : ''}`}
            >
              <List size={20} />
              <span>Minhas Submissões</span>
            </Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  )
}
