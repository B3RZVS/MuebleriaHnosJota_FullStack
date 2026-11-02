import { useEffect } from 'react';
import ProductList from '../../components/ProductList/ProductList';
import { useEstadoNavegacion } from '../../hooks/useEstadoNavegacion';
import { useProductosApi } from '../../hooks/useProductosApi';

export const ProductosView = () => {
  const { data: productos = [], isLoading, error } = useProductosApi();
  const estado = useEstadoNavegacion<{ productoEliminado?: boolean }>();
  const productoEliminado = estado?.productoEliminado === true;
  // React Router no vuelve arriba al cambiar de página: sin esto se abre a mitad del scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ProductList
      productos={productos}
      cargando={isLoading}
      error={error}
      aviso={productoEliminado ? 'El producto se eliminó correctamente.' : ''}
    />
  );
};
