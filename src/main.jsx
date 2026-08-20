import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppPreloader, GlobalErrorBoundary } from './components/system/SystemUI'
import PlatformRouter from './router/PlatformRouter'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <AppPreloader>
        <PlatformRouter />
      </AppPreloader>
    </GlobalErrorBoundary>
  </React.StrictMode>
)
