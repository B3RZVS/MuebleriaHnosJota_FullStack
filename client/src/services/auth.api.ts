import type {
  LoginPayload,
  LoginRespuesta,
  PerfilRespuesta,
  RegistroPayload,
  RegistroRespuesta,
  UsuarioAuth,
} from '../types/auth';
import { API_AUTH } from '../utils/urls';
import { ErrorApi, SIN_SERVIDOR, fetchConAuth, leerJson } from './apiClient';

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
    throw new ErrorApi(SIN_SERVIDOR, 0);
  }

  return leerJson<T>(respuesta, SIN_SERVIDOR);
};

export const registrarUsuario = (datos: RegistroPayload) =>
  postAuth<RegistroRespuesta>('/registro', datos);

export const iniciarSesion = (datos: LoginPayload) =>
  postAuth<LoginRespuesta>('/login', datos);

export const obtenerPerfil = async (token?: string): Promise<UsuarioAuth> => {
  const respuesta = await fetchConAuth(`${API_AUTH}/perfil`, {}, token);
  const datos = await leerJson<PerfilRespuesta>(
    respuesta,
    'No pudimos validar la sesión.'
  );

  return datos.usuario;
};
