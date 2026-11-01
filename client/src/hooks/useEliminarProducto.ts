import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarProducto } from "../services/producto.api";

export const useEliminarProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eliminarProducto(id),
    onSuccess: (_respuesta, id) => {
      // el producto ya no existe, lo saco de la cache y el catálogo se vuelve a pedir :v
      queryClient.removeQueries({ queryKey: ["producto", id] });
      void queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};
