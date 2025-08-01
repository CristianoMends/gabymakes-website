import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='479437903652-erfiqsbilf8dnmc5q6udkn4rce717afi.apps.googleusercontent.com'>
      <App></App>
    </GoogleOAuthProvider>
  </StrictMode>,
)
