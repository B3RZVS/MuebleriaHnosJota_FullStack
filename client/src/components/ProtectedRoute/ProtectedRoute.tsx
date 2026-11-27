import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';
import './ProtectedRoute.css';

type ProtectedRouteProps = {
  children: ReactNode;
  soloAdmin?: boolean;
};

export function ProtectedRoute({
  children,
  soloAdmin = false,
}: ProtectedRouteProps) {
  const { usuario, estaAutenticado, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <p className="ruta-protegida" role="status">
        Verificando sesión…
      </p>
    );
  }

  if (!estaAutenticado) {
    const destino = `${location.pathname}${location.search}${location.hash}`;

    return <Navigate to="/login" replace state={{ from: destino }} />;
  }

  if (soloAdmin && usuario?.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
