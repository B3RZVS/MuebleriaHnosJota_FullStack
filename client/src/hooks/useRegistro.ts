import { useMutation } from '@tanstack/react-query';
import { registrarUsuario } from '../services/auth.api';
import type { RegistroPayload } from '../types/auth';

export const useRegistro = () => {
  return useMutation({
    mutationFn: (datos: RegistroPayload) => registrarUsuario(datos),
  });
};
