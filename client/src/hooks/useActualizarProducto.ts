import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/context/useAuth';
import {
  actualizarProducto,
  type NuevoProducto,
} from '../services/producto.api';

type ActualizarVariables = {
  id: string;
  cambios: NuevoProducto;
};

export const useActualizarProducto = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ id, cambios }: ActualizarVariables) =>
      actualizarProducto(id, cambios, token),
    onSuccess: (producto) => {
      // el detalle ya muestra lo que devolvió el PUT, sin volver a pedirlo
      queryClient.setQueryData(['producto', producto.id], producto);
      void queryClient.invalidateQueries({ queryKey: ['productos'] });
      // el carrito también muestra el nombre y el precio
      void queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
};
