export type UsuarioAuth = {
  id: string;
  nombre: string;
  email: string;
};

export type RegistroPayload = {
  nombre: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegistroRespuesta = {
  mensaje: string;
  usuario: UsuarioAuth;
};

export type LoginRespuesta = {
  mensaje: string;
  token: string;
  usuario: UsuarioAuth;
};
