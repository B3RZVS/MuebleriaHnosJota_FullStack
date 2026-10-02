import ProductList from "../../components/ProductList/ProductList";
import { useProductosApi } from "../../hooks/useProductosApi";

export const ProductosView = () => {
  const { data: productos = [], isLoading, error } = useProductosApi();

  return (
    <ProductList productos={productos} cargando={isLoading} error={error} />
  );
};
