import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImagenProducto from '../../components/ImagenProducto/ImagenProducto';
import { useAuth } from '../../auth/context/useAuth';
import { crearPedido } from '../../services/pedidos.api';
import { formatoPrecio } from '../../utils/formatoPrecio';
import { useCart } from '../context/useCart';
import '../cart.css';

interface CartModalProps {
  abierto: boolean;
  onCerrar: () => void;
}

function CartModal({ abierto, onCerrar }: CartModalProps) {
  const queryClient = useQueryClient();
  const { estaAutenticado, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [comprando, setComprando] = useState(false);
  const [mensajeCompra, setMensajeCompra] = useState<{
    tipo: 'exito' | 'error';
    texto: string;
  } | null>(null);

  useEffect(() => {
    if (!abierto) return;

    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onCerrar();
    };

    document.addEventListener('keydown', cerrarConEscape);
    return () => document.removeEventListener('keydown', cerrarConEscape);
  }, [abierto, onCerrar]);

  const finalizarCompra = async () => {
    if (!estaAutenticado || !token) {
      onCerrar();
      navigate('/login', {
        state: {
          from: `${location.pathname}${location.search}${location.hash}`,
        },
      });
      return;
    }

    setMensajeCompra(null);
    limpiarError();
    setComprando(true);

    try {
      await crearPedido(
        token,
        carrito.items.map(({ productoId, cantidad }) => ({
          productoId,
          cantidad,
        }))
      );

      await queryClient.invalidateQueries({
        queryKey: ['pedidos', 'mis-pedidos'],
      });

      const carritoVaciado = await vaciar();
      setMensajeCompra({
        tipo: 'exito',
        texto: carritoVaciado
          ? 'Tu pedido se registró correctamente.'
          : 'Tu pedido se registró, pero no se pudo vaciar el carrito. Revisá el carrito antes de volver a comprar.',
      });
    } catch (error) {
      setMensajeCompra({
        tipo: 'error',
        texto:
          error instanceof Error
            ? error.message
            : 'No se pudo registrar el pedido. Intentá nuevamente.',
      });
    } finally {
      setComprando(false);
    }
  };

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

        {mensajeCompra && (
          <p
            className={`mensaje-compra mensaje-compra--${mensajeCompra.tipo}`}
            role={mensajeCompra.tipo === 'error' ? 'alert' : 'status'}
          >
            {mensajeCompra.texto}
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
                  <ImagenProducto
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
                        disabled={actualizando || comprando}
                        onClick={() =>
                          item.cantidad === 1
                            ? void quitar(item.productoId)
                            : void cambiarCantidad(
                                item.productoId,
                                item.cantidad - 1
                              )
                        }
                        type="button"
                      >
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        aria-label={`Sumar una unidad de ${item.nombre}`}
                        disabled={
                          actualizando ||
                          comprando ||
                          item.cantidad >= Math.min(99, item.stock ?? 99)
                        }
                        onClick={() =>
                          void cambiarCantidad(
                            item.productoId,
                            item.cantidad + 1
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
                      disabled={actualizando || comprando}
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
                disabled={actualizando || comprando}
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
                disabled={actualizando || comprando}
                onClick={() => void finalizarCompra()}
              >
                {comprando ? 'Registrando pedido…' : 'Finalizar compra'}
              </button>
              <p className="resumen-carrito__nota" id="nota-pago">
                Se registrará tu pedido. El pago online todavía no está
                disponible.
              </p>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}

export default CartModal;
