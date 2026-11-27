import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';
import { obtenerPerfil } from '../../services/auth.api';
import './PerfilView.css';

export function PerfilView() {
  const { usuario, token, logout } = useAuth();
  const navigate = useNavigate();
  const perfil = useQuery({
    queryKey: ['auth', 'perfil', token],
    queryFn: () => obtenerPerfil(token ?? undefined),
    enabled: Boolean(token),
    initialData: usuario ?? undefined,
  });

  const datos = perfil.data ?? usuario;

  if (!datos) return null;

  const cerrarSesion = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <section className="cuenta" aria-labelledby="perfil-title">
      <div className="cuenta__intro">
        <p className="cuenta__eyebrow">Tu cuenta</p>
        <h1 id="perfil-title">Mi perfil</h1>
        <p className="cuenta__description">
          Estos son los datos con los que iniciaste sesión en Hermanos Jota.
        </p>
      </div>

      <div className="cuenta__card">
        <dl className="cuenta__datos">
          <div className="cuenta__dato">
            <dt>Nombre</dt>
            <dd>{datos.nombre}</dd>
          </div>
          <div className="cuenta__dato">
            <dt>Correo electrónico</dt>
            <dd>{datos.email}</dd>
          </div>
        </dl>

        <div className="cuenta__acciones">
          <Link className="cuenta__boton" to="/productos">
            Seguir comprando
          </Link>
          <button
            className="cuenta__boton cuenta__boton--secundario"
            type="button"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </section>
  );
}
