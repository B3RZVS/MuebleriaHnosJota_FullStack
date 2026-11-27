import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iniciarSesion } from '../services/auth.api';
import type { LoginPayload, LoginRespuesta } from '../types/auth';

// Clave de cache para la sesión. La Tarea 2 (AuthContext) puede reutilizarla.
export const AUTH_SESION_KEY = ['auth', 'sesion'] as const;

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (datos: LoginPayload) => iniciarSesion(datos),
    onSuccess: (resultado: LoginRespuesta) => {
      // TODO Tarea 2 — AuthContext:
      // Mover la gestión de sesión al contexto (persistir token/usuario,
      // exponer login()/logout() y leer esta misma query key desde ahí).
      // Por ahora dejamos el resultado en la cache de React Query como base.
      queryClient.setQueryData(AUTH_SESION_KEY, {
        token: resultado.token,
        usuario: resultado.usuario,
      });
    },
  });
};
