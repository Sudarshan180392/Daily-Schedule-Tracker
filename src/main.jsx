import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import AuthWrapper from './AuthWrapper'
import LandingPage from './LandingPage'
import Auth from './Auth'
import UPSCTracker from './upsc_tracker.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthWrapper>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/tracker" element={<UPSCTracker />} />
      </Routes>
    </AuthWrapper>
  </BrowserRouter>,
)
