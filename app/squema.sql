CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY,
  student_id TEXT NOT NULL,
  s3_key TEXT NOT NULL,
  status TEXT NOT NULL,
  score INTEGER NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_student_id
  ON submissions(student_id);

CREATE INDEX IF NOT EXISTS idx_submissions_student_id_created_at
  ON submissions(student_id, created_at DESC);
