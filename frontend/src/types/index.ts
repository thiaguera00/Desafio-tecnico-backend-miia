export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

export interface SubmissionCreatedResponse {
  id: string
  status: string
}

export interface SubmissionOut {
  id: string
  student_id: string
  s3_key: string
  status: string
  score: number | null
  created_at: string
  updated_at: string
}

export interface SubmissionListItem {
  id: string
  status: string
  score: number | null
  created_at: string
}

export interface SubmissionCreate {
  student_id: string
  text: string
}
