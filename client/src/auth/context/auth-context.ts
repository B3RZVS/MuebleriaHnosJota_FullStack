import { createContext } from 'react';
import type { UsuarioAuth } from '../../types/auth';

export interface AuthContextValue {
  usuario: UsuarioAuth | null;
  token: string | null;
  estaAutenticado: boolean;
  cargando: boolean;
  login: (token: string, usuario: UsuarioAuth) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
