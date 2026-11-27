import type {
  LoginPayload,
  LoginRespuesta,
  RegistroPayload,
  RegistroRespuesta,
} from '../types/auth';
import { API_AUTH } from '../utils/urls';

const SIN_SERVIDOR =
  'No pudimos conectar con el servidor. Intentá de nuevo en unos segundos.';

const leerMensajeError = (datos: unknown, fallback: string) => {
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

const postAuth = async <T>(
  ruta: string,
  cuerpo: RegistroPayload | LoginPayload
): Promise<T> => {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${API_AUTH}${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    throw new Error(SIN_SERVIDOR);
  }

  const datos: unknown = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(leerMensajeError(datos, SIN_SERVIDOR));
  }

  return datos as T;
};

export const registrarUsuario = (datos: RegistroPayload) =>
  postAuth<RegistroRespuesta>('/registro', datos);

export const iniciarSesion = (datos: LoginPayload) =>
  postAuth<LoginRespuesta>('/login', datos);
