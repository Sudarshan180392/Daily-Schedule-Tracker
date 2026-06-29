import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UPSCTracker from './upsc_tracker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UPSCTracker />
  </StrictMode>,
)
