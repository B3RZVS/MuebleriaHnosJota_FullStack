import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';
import { obtenerMisPedidos } from '../../services/pedidos.api';
import type { Pedido } from '../../types/pedido';
import { formatoPrecio } from '../../utils/formatoPrecio';
import './MisPedidosView.css';
import '../PerfilView/PerfilView.css';

const fechaLegible = (fecha: string) =>
  new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(fecha));

function PedidoCard({ pedido }: { pedido: Pedido }) {
  return (
    <article className="cuenta__card pedido">
      <header className="pedido__encabezado">
        <div>
          <h2>Pedido</h2>
          <time dateTime={pedido.fechaPedido}>
            {fechaLegible(pedido.fechaPedido)}
          </time>
        </div>
        <p className="pedido__total">
          Total <strong>{formatoPrecio.format(pedido.total)}</strong>
        </p>
      </header>

      <ul className="pedido__productos">
        {pedido.productos.map((producto) => (
          <li
            className="pedido__producto"
            key={`${pedido.id}-${producto.producto}`}
          >
            <div>
              <h3>{producto.nombre}</h3>
              <p>
                {producto.cantidad} × {formatoPrecio.format(producto.precio)}
              </p>
            </div>
            <strong>{formatoPrecio.format(producto.subtotal)}</strong>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function MisPedidosView() {
  const { token, usuario } = useAuth();
  const consulta = useQuery({
    queryKey: ['pedidos', 'mis-pedidos', usuario?.id],
    queryFn: () => {
      if (!token) {
        throw new Error('Necesitás iniciar sesión para consultar tus pedidos.');
      }

      return obtenerMisPedidos(token);
    },
    enabled: Boolean(token),
  });
  const pedidos = consulta.data ?? [];

  return (
    <section className="cuenta cuenta--pedidos" aria-labelledby="pedidos-title">
      <div className="cuenta__intro">
        <p className="cuenta__eyebrow">Tu cuenta</p>
        <h1 id="pedidos-title">Mis pedidos</h1>
        <p className="cuenta__description">
          Consultá el historial de tus compras.
        </p>
      </div>

      <div className="historial-pedidos">
        {consulta.isPending ? (
          <p className="cuenta__card" role="status">
            Cargando tus pedidos…
          </p>
        ) : consulta.isError ? (
          <div className="cuenta__card cuenta__card--vacia">
            <p className="historial-pedidos__error" role="alert">
              {consulta.error instanceof Error
                ? consulta.error.message
                : 'No se pudieron cargar tus pedidos.'}
            </p>
            <button
              className="cuenta__boton"
              disabled={consulta.isFetching}
              onClick={() => void consulta.refetch()}
              type="button"
            >
              {consulta.isFetching ? 'Reintentando…' : 'Reintentar'}
            </button>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="cuenta__card cuenta__card--vacia">
            <p>Todavía no tenés pedidos.</p>
            <Link className="cuenta__boton" to="/productos">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            {consulta.isFetching && (
              <p className="historial-pedidos__actualizando" role="status">
                Actualizando tus pedidos…
              </p>
            )}
            {pedidos.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
