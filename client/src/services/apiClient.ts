import { leerToken } from '../utils/authStorage';

export const SIN_SERVIDOR =
  'No pudimos conectar con el servidor. Intentá de nuevo en unos segundos.';

export const EVENTO_SESION_INVALIDA = 'muebleria:sesion-invalida';

export type DetalleSesionInvalida = {
  token: string;
};

export class ErrorApi extends Error {
  readonly status: number;

  constructor(mensaje: string, status: number) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.status = status;
  }
}

export const leerMensajeError = (datos: unknown, fallback: string) => {
  if (
    typeof datos === 'object' &&
    datos !== null &&
    'mensaje' in datos &&
    typeof datos.mensaje === 'string'
  ) {
    return datos.mensaje;
  }

  return fallback;
};

export const leerJson = async <T>(
  respuesta: Response,
  fallback: string
): Promise<T> => {
  const datos: unknown = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new ErrorApi(leerMensajeError(datos, fallback), respuesta.status);
  }

  return datos as T;
};

// Punto único para las peticiones privadas: agrega el header Authorization.
// El token se puede pasar desde el AuthContext; si no, se usa el persistido.
export const fetchConAuth = async (
  url: string,
  opciones: RequestInit = {},
  token: string | null = leerToken()
): Promise<Response> => {
  if (!token) {
    throw new ErrorApi('Necesitás iniciar sesión para continuar.', 401);
  }

  const headers = new Headers(opciones.headers);
  headers.set('Authorization', `Bearer ${token}`);

  let respuesta: Response;

  try {
    respuesta = await fetch(url, { ...opciones, headers });
  } catch {
    throw new ErrorApi(SIN_SERVIDOR, 0);
  }

  // Cualquier request privado que reciba 401 avisa al AuthContext.
  if (respuesta.status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<DetalleSesionInvalida>(EVENTO_SESION_INVALIDA, {
        detail: { token },
      })
    );
  }

  return respuesta;
};
