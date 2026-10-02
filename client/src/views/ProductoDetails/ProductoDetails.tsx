import { Link, useParams } from "react-router-dom";
import { useProductoApi } from "../../hooks/useProductoApi";
import type { Producto } from "../../types/producto";
import "./ProductoDetails.css";
import { formatoPrecio } from "../../utils/formatoPrecio";

const etiquetasEspecificaciones: Record<string, string> = {
  medidas: "Medidas",
  materiales: "Materiales",
  acabado: "Acabado",
  peso: "Peso",
  capacidad: "Capacidad",
};

export const ProductoDetails = () => {
  const { id } = useParams();
  const { data: producto, isLoading, error } = useProductoApi(id ?? "");

  return (
    <main id="contenido" className="product-page">
      <Link className="product-back" to="/">
        <span aria-hidden="true">←</span> Volver al catálogo
      </Link>

      {isLoading && (
        <div className="product-loading" role="status" aria-live="polite">
          <div className="product-gallery product-gallery--skeleton" />
          <p>Buscando la pieza…</p>
        </div>
      )}

      {error && (
        <section className="product-error" role="alert">
          <p className="product-eyebrow">No pudimos cargar esta pieza</p>
          <h1>Algo salió mal</h1>
          <p>Revisá que el servidor esté disponible e intentá nuevamente.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </section>
      )}

      {!isLoading && !error && producto && (
        <ProductContent producto={producto as Producto} />
      )}
    </main>
  );
};

function ProductContent({ producto }: { producto: Producto }) {
  return (
    <article className="product-detail">
      <div className="product-gallery">
        <img src={producto.imagen} alt={producto.nombre} />
      </div>

      <div className="product-copy">
        <p className="product-eyebrow">Selección de la casa</p>
        <h1>{producto.nombre}</h1>
        <p className="product-description">{producto.descripcion}</p>
        <p className="product-price">{formatoPrecio.format(producto.precio)}</p>

        <div className="purchase-row">
          <div className="quantity-control" aria-label="Cantidad">
            <button
              className="quantity-control__button"
              type="button"
              aria-label="Quitar una unidad"
              disabled
            >
              −
            </button>
            <span className="quantity-control__value" aria-live="polite">
              1
            </span>
            <button
              className="quantity-control__button"
              type="button"
              aria-label="Agregar una unidad"
            >
              +
            </button>
          </div>
          <button className="add-button" type="button">
            Agregar al carrito
          </button>
        </div>

        <p className="purchase-note">
          Envío coordinado a todo el país. Cada pieza se revisa y embala en la
          Casa Taller.
        </p>
      </div>

      <section className="specs" aria-labelledby="specs-title">
        <h2 id="specs-title">Detalles de la pieza</h2>
        <dl className="spec-list">
          {Object.entries(producto.especificaciones).map(([nombre, valor]) => (
            <div className="spec-list__item" key={nombre}>
              <dt>{etiquetasEspecificaciones[nombre] ?? nombre}</dt>
              <dd>{valor}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
