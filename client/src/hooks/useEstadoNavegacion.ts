import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// guardo el aviso acá y lo borro del historial, si no vuelve a aparecer al recargar :v
export const useEstadoNavegacion = <Estado>() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [estado] = useState(location.state as Estado | null);

  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  return estado;
};
