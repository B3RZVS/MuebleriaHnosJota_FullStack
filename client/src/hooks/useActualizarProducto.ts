import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  actualizarProducto,
  type CambiosProducto,
} from "../services/producto.api";

type ActualizarVariables = {
  id: string;
  cambios: CambiosProducto;
};

export const useActualizarProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cambios }: ActualizarVariables) =>
      actualizarProducto(id, cambios),
    onSuccess: (producto) => {
      // el detalle ya muestra lo que devolvió el PUT, sin volver a pedirlo
      queryClient.setQueryData(["producto", producto.id], producto);
      void queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};
