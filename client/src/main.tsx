import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import CartShell from './cart/components/CartShell'
import { CartProvider } from './cart/context/CartContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <CartShell>
        <App />
      </CartShell>
    </CartProvider>
  </StrictMode>,
)
