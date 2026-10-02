import { useCart } from "../context/useCart";
import { BsCartPlus } from "react-icons/bs";
interface AddToCartButtonProps {
  productoId: string;
  etiqueta?: string;
}

function AddToCartButton({
  productoId,
  etiqueta = "Agregar al carrito",
}: AddToCartButtonProps) {
  const { agregar, productosAgregando, cargando } = useCart();
  const agregando = productosAgregando.includes(productoId);

  return (
    <button
      className="producto-card-boton producto-card-boton--principal"
      disabled={agregando || cargando}
      onClick={() => void agregar(productoId)}
      type="button"
      aria-label={`${etiqueta}, producto ${productoId}`}
    >
      {agregando ? (
        "Agregando…"
      ) : (
        <>
          <BsCartPlus aria-hidden="true" />
          <span>{etiqueta}</span>
        </>
      )}
    </button>
  );
}

export default AddToCartButton;
