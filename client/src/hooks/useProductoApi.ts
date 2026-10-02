import { useQuery } from "@tanstack/react-query";
import { obtenerProductoId } from "../services/producto.api";

export const useProductoApi = (id: string) => {
  return useQuery({
    queryKey: ["producto", id],
    queryFn: () => obtenerProductoId(id),
    enabled: !!id,
  });
};
