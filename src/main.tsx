import React from 'react';
import ReactDOM from 'react-dom/client';
import DartLigaApp from './Oldindex';
import './index.css'; // ← Tailwind Styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DartLigaApp />
  </React.StrictMode>
);

import './index.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
