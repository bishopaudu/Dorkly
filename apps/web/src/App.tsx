import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import BuilderPage from '@/pages/BuilderPage'
import TemplatesPage from '@/pages/TemplatesPage'
import SavedPage from '@/pages/SavedPage'
import ScannerPage from '@/pages/ScannerPage'
import GithubPage from '@/pages/GithubPage'
import GhdbPage from '@/pages/GhdbPage'
import HelpPage from '@/pages/HelpPage'
import CrtshPage from '@/pages/CrtshPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<BuilderPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="scanner" element={<ScannerPage />} />
        <Route path="github" element={<GithubPage />} />
        <Route path="ghdb" element={<GhdbPage />} />
        <Route path="crtsh" element={<CrtshPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>
    </Routes>
  )
}
