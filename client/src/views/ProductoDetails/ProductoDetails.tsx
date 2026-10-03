import { useEffect, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../cart/context/useCart";
import { useProductoApi } from "../../hooks/useProductoApi";
import type { Producto } from "../../types/producto";
import { formatoPrecio } from "../../utils/formatoPrecio";
import "./ProductoDetails.css";

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

  // React Router no vuelve arriba al cambiar de página; depende de id por si se pasa de una pieza a otra
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="product-page">
      <Link className="product-back" to="/productos">
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

      {!isLoading && !error && producto === null && (
        <section className="product-error" role="alert">
          <p className="product-eyebrow">Pieza no encontrada</p>
          <h1>No encontramos esta pieza</h1>
          <p>Puede que el enlace esté mal escrito o que ya no esté en el catálogo.</p>
        </section>
      )}

      {!isLoading && !error && producto && <ProductContent producto={producto} />}
    </div>
  );
};

function ProductContent({ producto }: { producto: Producto }) {
  const [cantidad, setCantidad] = useState(1);
  const [confirmacion, setConfirmacion] = useState("");
  const [falloAlAgregar, setFalloAlAgregar] = useState(false);
  const { agregar, productosAgregando, cargando: cargandoCarrito } = useCart();
  const agregando = productosAgregando.includes(producto.id);

  const cambiarCantidad = (nuevaCantidad: number) => {
    setCantidad(Math.min(99, Math.max(1, nuevaCantidad)));
    setConfirmacion("");
    setFalloAlAgregar(false);
  };

  const agregarAlCarrito = async () => {
    setConfirmacion("");
    setFalloAlAgregar(false);
    const agregado = await agregar(producto.id, cantidad);
    setFalloAlAgregar(!agregado);

    if (agregado) {
      setConfirmacion(
        cantidad === 1
          ? "Producto agregado al carrito."
          : `${cantidad} unidades agregadas al carrito.`,
      );
    }
  };

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
              disabled={cantidad === 1 || agregando}
              onClick={() => cambiarCantidad(cantidad - 1)}
            >
              −
            </button>
            <span className="quantity-control__value" aria-live="polite">
              {cantidad}
            </span>
            <button
              className="quantity-control__button"
              type="button"
              aria-label="Agregar una unidad"
              disabled={cantidad === 99 || agregando}
              onClick={() => cambiarCantidad(cantidad + 1)}
            >
              +
            </button>
          </div>

          <button
            className="add-button"
            type="button"
            disabled={agregando || cargandoCarrito}
            onClick={() => void agregarAlCarrito()}
          >
            {!agregando && <BsCartPlus aria-hidden="true" />}
            {agregando ? "Agregando…" : "Agregar al carrito"}
          </button>
        </div>

        <div className="purchase-feedback" aria-live="polite">
          {confirmacion && (
            <p className="purchase-feedback--success">{confirmacion}</p>
          )}
          {/* Mensaje fijo: el error del carrito puede ser técnico o venir en inglés */}
          {falloAlAgregar && (
            <p className="purchase-feedback--error">
              No pudimos agregar la pieza al carrito. Intentá de nuevo.
            </p>
          )}
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
