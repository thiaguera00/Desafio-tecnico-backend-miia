import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, RefreshCw, Eye, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '../../components/card/Card'
import { Input } from '../../components/input/Input'
import { Button } from '../../components/button/Button'
import { StatusBadge } from '../../components/status/StatusBadge'
import { api } from '../../services/api'
import type { SubmissionListItem } from '../../types'
import './styles/SubmissionsList.css'

export function SubmissionsList() {
  const navigate = useNavigate()
  const [studentId, setStudentId] = useState('abc123')
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadSubmissions = async () => {
    if (!studentId.trim()) {
      setError('Por favor, informe um ID de aluno')
      return
    }

    setError('')
    setLoading(true)
    try {
      const data = await api.listSubmissions(studentId)
      setSubmissions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar submissões')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentId) {
      loadSubmissions()
    }
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="submissions-list">
      <div className="page-header">
        <h1 className="page-title">Minhas Submissões</h1>
        <p className="page-description">
          Visualize e acompanhe o status de todas as suas submissões
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="search-bar">
            <Input
              label="ID do Aluno"
              placeholder="Digite o ID do aluno"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadSubmissions()}
            />
            <div className="search-actions">
              <Button onClick={loadSubmissions} loading={loading}>
                <Search size={20} />
                Buscar
              </Button>
              <Button 
                variant="secondary" 
                onClick={loadSubmissions} 
                loading={loading}
              >
                <RefreshCw size={20} />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!loading && submissions.length === 0 && !error && (
        <Card>
          <CardContent>
            <div className="empty-state">
              <p>Nenhuma submissão encontrada para este aluno.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {submissions.length > 0 && (
        <div className="submissions-grid">
          {submissions.map((submission) => (
            <Card 
              key={submission.id} 
              hover 
              onClick={() => navigate(`/submissions/${submission.id}`)}
            >
              <CardContent>
                <div className="submission-item">
                  <div className="submission-header">
                    <span className="submission-id">
                      #{submission.id.substring(0, 8)}
                    </span>
                    <StatusBadge status={submission.status} />
                  </div>
                  <div className="submission-details">
                    <div className="submission-detail">
                      <span className="detail-label">Score:</span>
                      <span className="detail-value">
                        {submission.score !== null ? submission.score : '-'}
                      </span>
                    </div>
                    <div className="submission-detail">
                      <span className="detail-label">Data:</span>
                      <span className="detail-value">
                        {formatDate(submission.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="submission-actions">
                    <Eye size={16} />
                    <span>Ver detalhes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
