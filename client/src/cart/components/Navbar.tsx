import { useCart } from '../context/useCart'
import '../cart.css'

interface NavbarProps {
  onAbrirCarrito: () => void
}

function Navbar({ onAbrirCarrito }: NavbarProps) {
  const { carrito } = useCart()
  const etiquetaCantidad =
    carrito.totalItems === 1 ? '1 producto' : `${carrito.totalItems} productos`

  return (
    <header className="barra">
      <span className="barra__marca">
        Hermanos Jota
      </span>
      <button
        aria-label={`Abrir carrito, ${etiquetaCantidad}`}
        className="boton-carrito"
        onClick={onAbrirCarrito}
        type="button"
      >
        <span aria-hidden="true">Carrito</span>
        <span aria-label={etiquetaCantidad} className="boton-carrito__cantidad">
          {carrito.totalItems}
        </span>
      </button>
    </header>
  )
}

export default Navbar
