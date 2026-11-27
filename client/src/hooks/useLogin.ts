import { useMutation } from '@tanstack/react-query';
import { iniciarSesion } from '../services/auth.api';
import type { LoginPayload } from '../types/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: (datos: LoginPayload) => iniciarSesion(datos),
  });
};
