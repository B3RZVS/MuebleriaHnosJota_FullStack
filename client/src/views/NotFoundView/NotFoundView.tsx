import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NotFoundView.css';

export const NotFoundView = () => {
  // React Router no vuelve arriba al cambiar de página: sin esto se abre a mitad del scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="no-encontrada">
      <p className="no-encontrada__etiqueta">Error 404</p>
      <h1>No encontramos esta página</h1>
      <p>Puede que el enlace esté mal escrito o que la página ya no exista.</p>
      <Link className="no-encontrada__enlace" to="/">
        Volver al inicio
      </Link>
    </section>
  );
};
