import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './notebook-theme.css'
import './retro-paper.css'
import './unified-paper.css'
import './task-tabs.css'
import './document-maker.css'
import './ui-fixes.css'
import './creator-workspace.css'
import './pixel-creator.css'
import './farm-creator.css'
import './muted-farm.css'
import './farm-app-shell.css'
import './pixel-room.css'
import './starter-quest.css'
import './starter-quest-v2.css'
import './quiet-creator.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
