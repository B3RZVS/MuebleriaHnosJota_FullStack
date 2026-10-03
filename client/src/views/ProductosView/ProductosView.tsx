import { useEffect } from "react";
import ProductList from "../../components/ProductList/ProductList";
import { useProductosApi } from "../../hooks/useProductosApi";

export const ProductosView = () => {
  const { data: productos = [], isLoading, error } = useProductosApi();
  // React Router no vuelve arriba al cambiar de página: sin esto se abre a mitad del scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ProductList productos={productos} cargando={isLoading} error={error} />
  );
};
