import type { UsuarioAuth } from '../types/auth';

const TOKEN_KEY = 'muebleria.auth.token';
const USUARIO_KEY = 'muebleria.auth.usuario';

export type SesionGuardada = {
  token: string;
  usuario: UsuarioAuth;
};

const esUsuario = (valor: unknown): valor is UsuarioAuth => {
  if (typeof valor !== 'object' || valor === null) return false;

  const usuario = valor as Record<string, unknown>;

  return (
    typeof usuario.id === 'string' &&
    typeof usuario.nombre === 'string' &&
    typeof usuario.email === 'string' &&
    (usuario.rol === 'cliente' || usuario.rol === 'admin')
  );
};

export const leerToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const leerUsuario = (): UsuarioAuth | null => {
  try {
    const crudo = localStorage.getItem(USUARIO_KEY);
    if (!crudo) return null;

    const usuario: unknown = JSON.parse(crudo);
    return esUsuario(usuario) ? usuario : null;
  } catch {
    return null;
  }
};

export const leerSesion = (): SesionGuardada | null => {
  const token = leerToken();
  const usuario = leerUsuario();

  if (!token || !usuario) return null;

  return { token, usuario };
};

export const guardarSesion = (token: string, usuario: UsuarioAuth) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  } catch {
    // Si el navegador bloquea localStorage no se puede persistir, pero
    // AuthProvider mantiene la sesión en memoria durante esta pestaña.
  }
};

export const limpiarSesion = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
  } catch {
    // No hay nada más que limpiar si el navegador bloquea localStorage.
  }
};
