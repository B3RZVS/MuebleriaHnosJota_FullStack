import bcrypt from 'bcrypt';
import createError from 'http-errors';
import usuariosRepository from '../repositories/usuarios.repository.js';
import {
  EMAIL_VALIDO,
  PASSWORD_MIN,
  normalizarEmail,
  usuarioPublico,
} from '../utils/auth.utils.js';

const SALT_ROUNDS = 10;

const validarDatos = ({ nombre, email, password }) => {
  if (
    typeof nombre !== 'string' ||
    !nombre.trim() ||
    typeof email !== 'string' ||
    !email.trim() ||
    typeof password !== 'string' ||
    !password
  ) {
    throw createError(400, 'Completá nombre, correo electrónico y contraseña.');
  }

  if (!EMAIL_VALIDO.test(email.trim())) {
    throw createError(400, 'El correo electrónico no es válido.');
  }

  if (password.length < PASSWORD_MIN) {
    throw createError(
      400,
      `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`
    );
  }
};

const registrar = async ({ nombre, email, password }) => {
  validarDatos({ nombre, email, password });

  const emailNormalizado = normalizarEmail(email);
  const existente = await usuariosRepository.buscarPorEmail(emailNormalizado);

  if (existente) {
    throw createError(409, 'Ya existe un usuario con ese correo electrónico.');
  }

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const usuario = await usuariosRepository.crear({
      nombre: nombre.trim(),
      email: emailNormalizado,
      password: passwordHash,
    });

    return {
      mensaje: 'Usuario registrado correctamente.',
      usuario: usuarioPublico(usuario),
    };
  } catch (error) {
    if (error.code === 11000) {
      throw createError(
        409,
        'Ya existe un usuario con ese correo electrónico.'
      );
    }

    throw error;
  }
};

export default { registrar };
