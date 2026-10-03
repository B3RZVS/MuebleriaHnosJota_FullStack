import type { Producto } from "../../types/producto.ts";
import ProductCard from "../ProductCard/ProductCard.tsx";
import "./ProductList.css";

type ProductListProps = {
  productos: Producto[];
  cargando: boolean;
  error: Error | null;
};

function ProductList({ productos, cargando, error }: ProductListProps) {
  const sinProductos = !cargando && !error && productos.length === 0;
  const hayProductos = !cargando && !error && productos.length > 0;

  return (
    <section
      id="catalogo"
      className="catalogo"
      aria-labelledby="catalogo-titulo"
    >
      <h1 id="catalogo-titulo" className="catalogo-titulo">
        Nuestro catálogo
      </h1>
      <p className="catalogo-bajada">
        Cada pieza cuenta la historia de manos expertas y materiales nobles.
      </p>

      {cargando && (
        <p className="catalogo-mensaje" role="status">
          Cargando productos…
        </p>
      )}

      {error && (
        <div className="catalogo-error">
          <p className="catalogo-error-texto" role="alert">
            No pudimos cargar los productos en este momento. Intentá de nuevo.
          </p>
          {/* Recargar la página vuelve a montar la vista y repite el pedido */}
          <button
            type="button"
            className="catalogo-boton"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      )}

      {sinProductos && (
        <p className="catalogo-mensaje">
          Por ahora no hay productos para mostrar.
        </p>
      )}

      {hayProductos && (
        <ul className="catalogo-grilla">
          {productos.map((producto) => (
            // La key va en el elemento que devuelve el map (el <li>), no dentro de ProductCard
            <li key={producto.id}>
              <ProductCard producto={producto} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ProductList;
