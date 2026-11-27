import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/context/useAuth';
import { eliminarProducto } from '../services/producto.api';

export const useEliminarProducto = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (id: string) => eliminarProducto(id, token),
    onSuccess: (_respuesta, id) => {
      // el producto ya no existe, lo saco de la cache y el catálogo se vuelve a pedir :v
      queryClient.removeQueries({ queryKey: ['producto', id] });
      void queryClient.invalidateQueries({ queryKey: ['productos'] });
      void queryClient.invalidateQueries({ queryKey: ['carrito'] });
    },
  });
};
