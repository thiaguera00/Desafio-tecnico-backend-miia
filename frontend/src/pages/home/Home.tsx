import { Link } from 'react-router-dom'
import { FileText, List, Plus, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/card/Card'
import { Button } from '../../components/button/Button'
import './styles/Home.css'

export function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">
          <FileText size={48} />
          Sistema de Submissões
        </h1>
        <p className="hero-subtitle">
          Envie suas submissões de texto e acompanhe o processamento em tempo real
        </p>
        <div className="hero-actions">
          <Link to="/create">
            <Button size="large">
              <Plus size={20} />
              Nova Submissão
            </Button>
          </Link>
          <Link to="/submissions">
            <Button variant="secondary" size="large">
              <List size={20} />
              Ver Submissões
            </Button>
          </Link>
        </div>
      </div>

      <div className="features">
        <Card hover>
          <CardHeader>
            <Plus size={24} />
            Criar Submissão
          </CardHeader>
          <CardContent>
            <p>Envie textos para análise e processamento. Cada submissão é armazenada com segurança e processada automaticamente.</p>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <Zap size={24} />
            Processamento Assíncrono
          </CardHeader>
          <CardContent>
            <p>Suas submissões são processadas em background através de uma fila SQS, garantindo performance e escalabilidade.</p>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <List size={24} />
            Acompanhamento
          </CardHeader>
          <CardContent>
            <p>Acompanhe o status e os resultados de todas as suas submissões em tempo real através de uma interface intuitiva.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
