import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import usuariosRepository from '../repositories/usuarios.repository.js';
import {
  EMAIL_VALIDO,
  normalizarEmail,
  usuarioPublico,
} from '../../utils/auth.utils.js';

const validarDatos = ({ email, password }) => {
  if (
    typeof email !== 'string' ||
    !email.trim() ||
    typeof password !== 'string' ||
    !password
  ) {
    throw createError(400, 'Completá el correo electrónico y la contraseña.');
  }

  if (!EMAIL_VALIDO.test(email.trim())) {
    throw createError(400, 'El correo electrónico no es válido.');
  }
};

const iniciarSesion = async ({ email, password }) => {
  validarDatos({ email, password });

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('Falta configurar la variable de entorno JWT_SECRET.');
    throw createError(500, 'Error interno del servidor');
  }

  const emailNormalizado = normalizarEmail(email);
  const usuario =
    await usuariosRepository.buscarPorEmailConPassword(emailNormalizado);

  if (!usuario) {
    throw createError(401, 'Correo electrónico o contraseña incorrectos');
  }

  const passwordOk = await bcrypt.compare(password, usuario.password);

  if (!passwordOk) {
    throw createError(401, 'Correo electrónico o contraseña incorrectos');
  }

  const token = jwt.sign({ id: usuario._id.toString() }, jwtSecret, {
    expiresIn: '24h',
  });

  return {
    mensaje: 'Inicio de sesión exitoso.',
    token,
    usuario: usuarioPublico(usuario),
  };
};

export default { iniciarSesion };
