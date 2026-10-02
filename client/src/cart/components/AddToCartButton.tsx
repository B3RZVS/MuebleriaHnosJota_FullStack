import { useCart } from '../context/useCart'

interface AddToCartButtonProps {
  productoId: string
  etiqueta?: string
  className?: string
}

function AddToCartButton({
  productoId,
  etiqueta = 'Agregar al carrito',
  className = 'boton boton--principal',
}: AddToCartButtonProps) {
  const { agregar, actualizando, cargando } = useCart()

  return (
    <button
      className={className}
      disabled={actualizando || cargando}
      onClick={() => void agregar(productoId)}
      type="button"
    >
      {actualizando ? 'Agregando…' : etiqueta}
    </button>
  )
}

export default AddToCartButton
