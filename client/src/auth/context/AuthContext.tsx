import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { obtenerPerfil } from '../../services/auth.api';
import {
  ErrorApi,
  EVENTO_SESION_INVALIDA,
  type DetalleSesionInvalida,
} from '../../services/apiClient';
import {
  guardarSesion,
  leerSesion,
  leerToken,
  limpiarSesion,
} from '../../utils/authStorage';
import type { UsuarioAuth } from '../../types/auth';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState(() => leerSesion());
  const [verificando, setVerificando] = useState(() => Boolean(leerToken()));

  // Si una petición privada recibe 401, se cierra la sesión actual.
  // Solo se limpia si el token del evento sigue siendo el token vigente.
  useEffect(() => {
    const tokenActual = sesion?.token ?? null;

    const manejarSesionInvalida = (evento: Event) => {
      const detalle = (evento as CustomEvent<DetalleSesionInvalida>).detail;

      if (!tokenActual || detalle?.token !== tokenActual) return;

      limpiarSesion();
      setSesion(null);
      setVerificando(false);
    };

    window.addEventListener(EVENTO_SESION_INVALIDA, manejarSesionInvalida);

    return () => {
      window.removeEventListener(EVENTO_SESION_INVALIDA, manejarSesionInvalida);
    };
  }, [sesion?.token]);

  // Al recargar, el token guardado se valida contra el backend antes de confiar en él.
  useEffect(() => {
    const token = leerToken();

    if (!token) return;

    let activo = true;

    const verificarSesion = async () => {
      try {
        const usuario = await obtenerPerfil(token);
        if (!activo) return;

        guardarSesion(token, usuario);
        setSesion({ token, usuario });
      } catch (error) {
        if (!activo) return;

        // Solo cierro la sesión si el backend dice que el token no sirve.
        // Si el servidor no responde, mantengo la sesión guardada.
        // Además, no piso una sesión nueva si el usuario ya volvió a loguearse.
        if (
          error instanceof ErrorApi &&
          error.status === 401 &&
          leerToken() === token
        ) {
          limpiarSesion();
          setSesion(null);
        }
      } finally {
        if (activo) setVerificando(false);
      }
    };

    void verificarSesion();

    return () => {
      activo = false;
    };
  }, []);

  const login = useCallback((token: string, usuario: UsuarioAuth) => {
    guardarSesion(token, usuario);
    setSesion({ token, usuario });
    setVerificando(false);
  }, []);

  const logout = useCallback(() => {
    limpiarSesion();
    setSesion(null);
    setVerificando(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario: sesion?.usuario ?? null,
      token: sesion?.token ?? null,
      estaAutenticado: Boolean(sesion?.usuario),
      cargando: verificando,
      login,
      logout,
    }),
    [sesion, verificando, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
