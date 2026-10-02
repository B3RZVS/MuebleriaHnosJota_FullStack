
import { useNavigate } from "react-router-dom";
import type { Producto } from '../types/producto.ts'
import './ProductCard.css'
import AddToCartButton from '../cart/components/AddToCartButton'


type ProductCardProps = {
  producto: Producto;
};

// Da formato a la moneda del precio: 185000 -> "$ 185.000"
const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  // Hay que indicar los dos: si solo se pone el máximo, navegadores viejos tiran error
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function ProductCard({ producto }: ProductCardProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/productos/${producto.id}`);
  };
  return (
    <article className="producto-card">
      <img
        className="producto-card-imagen"
        src={producto.imagen}
        alt={producto.nombre}
        width="1024"
        height="1024"
        loading="lazy"
      />
      <div className="producto-card-info">
        <h2 className="producto-card-nombre">{producto.nombre}</h2>
        <p className="producto-card-precio">
          {formatoPrecio.format(producto.precio)}
        </p>
        <button
          type="button"
          className="producto-card-boton"
          onClick={handleClick}
        >
          Ver más
        </button>

        <p className="producto-card-precio">{formatoPrecio.format(producto.precio)}</p>
        <AddToCartButton productoId={producto.id} />

      </div>
    </article>
  );
}

export default ProductCard;
