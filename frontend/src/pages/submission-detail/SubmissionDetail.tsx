import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Calendar, User, FileText, Hash, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/card/Card'
import { Button } from '../../components/button/Button'
import { StatusBadge } from '../../components/status/StatusBadge'
import { api } from '../../services/api'
import type { SubmissionOut } from '../../types'
import './styles/SubmissionDetail.css'

export function SubmissionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [submission, setSubmission] = useState<SubmissionOut | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadSubmission = async () => {
    if (!id) return

    setError('')
    setLoading(true)
    try {
      const data = await api.getSubmission(id)
      setSubmission(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar submissão')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubmission()
  }, [id])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  if (error) {
    return (
      <div className="submission-detail">
        <div className="error-container">
          <Card>
            <CardContent>
              <div className="error-message">
                <AlertCircle size={48} />
                <h2>Erro ao carregar submissão</h2>
                <p>{error}</p>
                <div className="error-actions">
                  <Button onClick={() => navigate('/submissions')}>
                    <ArrowLeft size={20} />
                    Voltar para lista
                  </Button>
                  <Button variant="secondary" onClick={loadSubmission}>
                    <RefreshCw size={20} />
                    Tentar novamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading || !submission) {
    return (
      <div className="submission-detail">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Carregando submissão...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="submission-detail">
      <div className="detail-header">
        <Button 
          variant="secondary" 
          onClick={() => navigate('/submissions')}
        >
          <ArrowLeft size={20} />
          Voltar
        </Button>
        <Button 
          variant="secondary" 
          onClick={loadSubmission}
          loading={loading}
        >
          <RefreshCw size={20} />
          Atualizar
        </Button>
      </div>

      <div className="detail-title">
        <h1>Detalhes da Submissão</h1>
        <StatusBadge status={submission.status} />
      </div>

      <div className="detail-grid">
        <Card>
          <CardHeader>
            <FileText size={20} />
            Informações Gerais
          </CardHeader>
          <CardContent>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <Hash size={16} />
                  ID da Submissão
                </div>
                <div className="info-value mono">{submission.id}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <User size={16} />
                  ID do Aluno
                </div>
                <div className="info-value">{submission.student_id}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <Calendar size={16} />
                  Data de Criação
                </div>
                <div className="info-value">{formatDate(submission.created_at)}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <Calendar size={16} />
                  Última Atualização
                </div>
                <div className="info-value">{formatDate(submission.updated_at)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Resultado da Análise</CardHeader>
          <CardContent>
            <div className="result-container">
              <div className="score-display">
                <span className="score-label">Score</span>
                <span className="score-value">
                  {submission.score !== null ? submission.score : '-'}
                </span>
              </div>
              {submission.score === null && submission.status === 'PENDING' && (
                <p className="score-info">
                  A submissão está aguardando processamento. O score será exibido assim que a análise for concluída.
                </p>
              )}
              {submission.score === null && submission.status === 'PROCESSING' && (
                <p className="score-info processing">
                  A submissão está sendo processada. Por favor, aguarde...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="full-width">
          <CardHeader>Armazenamento</CardHeader>
          <CardContent>
            <div className="info-item">
              <div className="info-label">S3 Key</div>
              <div className="info-value mono">{submission.s3_key}</div>
            </div>
            <p className="storage-info">
              O conteúdo desta submissão está armazenado de forma segura no Amazon S3.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
