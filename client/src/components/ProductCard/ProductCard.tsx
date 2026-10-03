import { Link } from "react-router-dom";
import AddToCartButton from "../../cart/components/AddToCartButton.tsx";
import type { Producto } from "../../types/producto.ts";
import { formatoPrecio } from "../../utils/formatoPrecio.ts";
import "./ProductCard.css";

type ProductCardProps = {
  producto: Producto;
};

function ProductCard({ producto }: ProductCardProps) {
  const detalleUrl = `/productos/${producto.id}`;

  return (
    <article className="producto-card">
      <Link
        className="producto-card-imagen-enlace"
        to={detalleUrl}
        aria-label={`Ver ${producto.nombre}`}
      >
        {producto.destacado && (
          <span className="producto-card-etiqueta">Destacado</span>
        )}
        <img
          className="producto-card-imagen"
          src={producto.imagen}
          alt=""
          width="1024"
          height="1024"
          loading="lazy"
        />
      </Link>

      <div className="producto-card-info">
        <div className="producto-card-encabezado">
          <p className="producto-card-categoria">Pieza artesanal</p>
          <h2 className="producto-card-nombre">
            <Link to={detalleUrl}>{producto.nombre}</Link>
          </h2>
        </div>

        <p className="producto-card-precio">
          {formatoPrecio.format(producto.precio)}
        </p>

        <div className="producto-card-acciones">
          <AddToCartButton productoId={producto.id} nombre={producto.nombre} />
          <Link
            className="producto-card-boton producto-card-boton--secundario"
            to={detalleUrl}
          >
            Ver más <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
