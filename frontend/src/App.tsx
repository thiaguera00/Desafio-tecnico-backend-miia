import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/home/Home'
import { CreateSubmission } from './pages/submission/CreateSubmission'
import { SubmissionsList } from './pages/submission-list/SubmissionsList'
import { SubmissionDetail } from './pages/submission-detail/SubmissionDetail'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateSubmission />} />
          <Route path="/submissions" element={<SubmissionsList />} />
          <Route path="/submissions/:id" element={<SubmissionDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
