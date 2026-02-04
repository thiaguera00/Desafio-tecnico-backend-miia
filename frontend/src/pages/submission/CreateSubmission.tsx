import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/card/Card'
import { Input, Textarea } from '../../components/input/Input'
import { Button } from '../../components/button/Button'
import { api } from '../../services/api'
import './styles/CreateSubmission.css'

export function CreateSubmission() {
  const navigate = useNavigate()
  const [studentId, setStudentId] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!studentId.trim() || !text.trim()) {
      setError('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    try {
      const result = await api.createSubmission({
        student_id: studentId,
        text: text,
      })
      
      navigate(`/submissions/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar submissão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-submission">
      <div className="page-header">
        <h1 className="page-title">Nova Submissão</h1>
        <p className="page-description">
          Preencha os campos abaixo para criar uma nova submissão de texto
        </p>
      </div>

      <Card>
        <CardHeader>Dados da Submissão</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="submission-form">
            {error && (
              <div className="error-message">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="ID do Aluno"
              placeholder="ex: abc123"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />

            <Textarea
              label="Texto da Submissão"
              placeholder="Digite ou cole o texto da sua submissão aqui..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              required
            />

            <div className="form-actions">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                loading={loading}
              >
                <Send size={20} />
                Enviar Submissão
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
