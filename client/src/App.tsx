import { useState } from 'react'
import AddToCartButton from './cart/components/AddToCartButton'
import CartModal from './cart/components/CartModal'
import Navbar from './cart/components/Navbar'
import { CartProvider } from './cart/context/CartContext'
import './App.css'

function CarritoDePrueba() {
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  return (
    <>
      <Navbar onAbrirCarrito={() => setCarritoAbierto(true)} />
      <main className="carrito-prueba">
        <AddToCartButton
          etiqueta="Agregar producto de prueba"
          productoId="aparador-uspallata"
        />
      </main>

      <CartModal
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
      />
    </>
  )
}

function App() {
  return (
    <CartProvider>
      <CarritoDePrueba />
    </CartProvider>
  )
}

export default App
