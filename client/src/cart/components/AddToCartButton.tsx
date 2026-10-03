import { useCart } from "../context/useCart";
import { BsCartPlus } from "react-icons/bs";

interface AddToCartButtonProps {
  productoId: string;
  nombre: string;
  etiqueta?: string;
}

function AddToCartButton({
  productoId,
  nombre,
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
      // El nombre ayuda al lector de pantalla: en el catálogo hay un botón igual por producto
      aria-label={agregando ? `Agregando ${nombre}` : `${etiqueta}: ${nombre}`}
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
