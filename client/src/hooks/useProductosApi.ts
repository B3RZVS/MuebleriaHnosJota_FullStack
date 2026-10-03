import { useQuery } from "@tanstack/react-query";
import { obtenerProductos } from "../services/producto.api";

export const useProductosApi = () => {
  return useQuery({
    queryKey: ["productos"],
    queryFn: () => obtenerProductos(),
  });
};
