import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { TruckerProvider } from './context/TruckerContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TruckerProvider>
      <App />
    </TruckerProvider>
  </StrictMode>,
);
