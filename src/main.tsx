import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import useMediaType from './hooks/useMediaType.tsx'
import './index.css'
import _ from 'lodash'

import App from './App.tsx'
import MobileApp from './components/mobile/MobileApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
