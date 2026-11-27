import { Link } from 'react-router-dom';
import '../PerfilView/PerfilView.css';

export function MisPedidosView() {
  return (
    <section className="cuenta" aria-labelledby="pedidos-title">
      <div className="cuenta__intro">
        <p className="cuenta__eyebrow">Tu cuenta</p>
        <h1 id="pedidos-title">Mis pedidos</h1>
        <p className="cuenta__description">
          Acá vas a poder consultar el estado de tus compras.
        </p>
      </div>

      <div className="cuenta__card cuenta__card--vacia">
        <p>El historial de pedidos va a estar disponible próximamente.</p>
        <Link className="cuenta__boton" to="/productos">
          Ver catálogo
        </Link>
      </div>
    </section>
  );
}
