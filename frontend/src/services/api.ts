import type { SubmissionCreate, SubmissionCreatedResponse, SubmissionListItem, SubmissionOut } from '../types'

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined
  return envUrl as string
}

const API_BASE_URL = getApiBaseUrl()

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
  
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options?.headers ?? {}),
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || `HTTP ${res.status}`)
  }

  return res.json()
}

export const api = {
  async healthCheck() {
    return apiRequest<{ status: string }>('/health')
  },

  async createSubmission(data: SubmissionCreate) {
    return apiRequest<SubmissionCreatedResponse>('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getSubmission(id: string) {
    return apiRequest<SubmissionOut>(`/submissions/${id}`)
  },

  async listSubmissions(studentId: string, limit = 50) {
    return apiRequest<SubmissionListItem[]>(`/submissions?student_id=${encodeURIComponent(studentId)}&limit=${limit}`)
  },
}
