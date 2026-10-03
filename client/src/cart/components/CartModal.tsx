import { useEffect } from "react";
import { formatoPrecio } from "../../utils/formatoPrecio";
import { useCart } from "../context/useCart";
import "../cart.css";

interface CartModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

function CartModal({ abierto, onCerrar }: CartModalProps) {
  const {
    carrito,
    cargando,
    actualizando,
    cambiarCantidad,
    quitar,
    vaciar,
    error,
    limpiarError,
  } = useCart();

  useEffect(() => {
    if (!abierto) return;

    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onCerrar();
    };

    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="modal-carrito">
      <button
        aria-label="Cerrar carrito"
        className="modal-carrito__fondo"
        onClick={onCerrar}
        tabIndex={-1}
        type="button"
      />
      <section
        aria-labelledby="titulo-carrito"
        aria-modal="true"
        className="panel-carrito"
        role="dialog"
      >
        <header className="panel-carrito__encabezado">
          <div>
            <p className="panel-carrito__etiqueta">Tu selección</p>
            <h2 id="titulo-carrito">Carrito ({carrito.totalItems})</h2>
          </div>
          <button
            aria-label="Cerrar carrito"
            className="boton-cerrar"
            onClick={onCerrar}
            type="button"
          >
            ×
          </button>
        </header>

        {error && (
          <p className="mensaje-error" role="alert">
            {error}
            <button
              aria-label="Cerrar mensaje"
              className="mensaje-error__cerrar"
              onClick={limpiarError}
              type="button"
            >
              ×
            </button>
          </p>
        )}

        {cargando ? (
          <p className="carrito-vacio">Cargando carrito…</p>
        ) : carrito.items.length === 0 ? (
          <div className="carrito-vacio">
            <p>Tu carrito está vacío.</p>
            <button
              className="boton boton--secundario"
              onClick={onCerrar}
              type="button"
            >
              Seguir mirando
            </button>
          </div>
        ) : (
          <>
            <ul className="lista-carrito">
              {carrito.items.map((item) => (
                <li className="item-carrito" key={item.productoId}>
                  <img
                    alt=""
                    className="item-carrito__imagen"
                    src={item.imagen}
                  />
                  <div className="item-carrito__detalle">
                    <h3>{item.nombre}</h3>
                    <p>{formatoPrecio.format(item.precio)}</p>
                    <div
                      aria-label={`Cantidad de ${item.nombre}`}
                      className="control-cantidad"
                    >
                      <button
                        aria-label={`Restar una unidad de ${item.nombre}`}
                        disabled={actualizando}
                        onClick={() =>
                          item.cantidad === 1
                            ? void quitar(item.productoId)
                            : void cambiarCantidad(
                                item.productoId,
                                item.cantidad - 1,
                              )
                        }
                        type="button"
                      >
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        aria-label={`Sumar una unidad de ${item.nombre}`}
                        disabled={actualizando}
                        onClick={() =>
                          void cambiarCantidad(
                            item.productoId,
                            item.cantidad + 1,
                          )
                        }
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="item-carrito__acciones">
                    <strong>{formatoPrecio.format(item.subtotal)}</strong>
                    <button
                      className="enlace-quitar"
                      disabled={actualizando}
                      onClick={() => void quitar(item.productoId)}
                      type="button"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="resumen-carrito">
              <button
                className="enlace-quitar"
                disabled={actualizando}
                onClick={() => void vaciar()}
                type="button"
              >
                Vaciar carrito
              </button>
              <div className="resumen-carrito__total">
                <span>Total</span>
                <strong>{formatoPrecio.format(carrito.total)}</strong>
              </div>
              <button
                className="boton boton--principal boton--ancho"
                type="button"
                disabled
                aria-describedby="nota-pago"
              >
                Ir a pagar
              </button>
              <p className="resumen-carrito__nota" id="nota-pago">
                El pago online todavía no está disponible.
              </p>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}

export default CartModal;
