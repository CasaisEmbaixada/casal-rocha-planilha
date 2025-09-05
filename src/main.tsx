import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Importa o registerSW do plugin PWA
import { registerSW } from 'virtual:pwa-register'

// Registra o service worker
registerSW({
  onNeedRefresh() {
    console.log("Nova versão disponível!");
  },
  onOfflineReady() {
    console.log("App pronto para uso offline!");
  },
})

createRoot(document.getElementById("root")!).render(<App />);
