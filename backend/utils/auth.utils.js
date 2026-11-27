const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 6;

const normalizarEmail = (email) =>
  typeof email === 'string' ? email.trim().toLowerCase() : '';

const usuarioPublico = (usuario) => ({
  id: usuario._id.toString(),
  nombre: usuario.nombre,
  email: usuario.email,
});

export { EMAIL_VALIDO, PASSWORD_MIN, normalizarEmail, usuarioPublico };
