import { useCart } from '../context/useCart'

interface AddToCartButtonProps {
  productoId: string
  etiqueta?: string
}

function AddToCartButton({
  productoId,
  etiqueta = 'Agregar al carrito',
}: AddToCartButtonProps) {
  const { agregar, actualizando, cargando } = useCart()

  return (
    <button
      className="boton boton--principal"
      disabled={actualizando || cargando}
      onClick={() => void agregar(productoId)}
      type="button"
    >
      {actualizando ? 'Agregando…' : etiqueta}
    </button>
  )
}

export default AddToCartButton
