import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import mongoose from 'mongoose';
import usuariosRepository from '../repositories/usuarios.repository.js';
import { usuarioPublico } from '../utils/auth.utils.js';

// El token viaja como "Authorization: Bearer <token>"
const extraerToken = (encabezado) => {
  if (typeof encabezado !== 'string') return null;

  const [esquema, token] = encabezado.trim().split(/\s+/);

  if (esquema?.toLowerCase() !== 'bearer' || !token) return null;

  return token;
};

const authMiddleware = async (req, res, next) => {
  const token = extraerToken(req.headers.authorization);

  if (!token) {
    return next(
      createError(401, 'Necesitás iniciar sesión para acceder a este recurso.')
    );
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('Falta configurar la variable de entorno JWT_SECRET.');
    return next(createError(500, 'Error interno del servidor'));
  }

  let payload;

  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (error) {
    const mensaje =
      error.name === 'TokenExpiredError'
        ? 'La sesión expiró. Iniciá sesión nuevamente.'
        : 'El token de autenticación no es válido.';

    return next(createError(401, mensaje));
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    !mongoose.isValidObjectId(payload.id)
  ) {
    return next(createError(401, 'El token de autenticación no es válido.'));
  }

  const usuario = await usuariosRepository.buscarPorId(payload.id);

  if (!usuario) {
    return next(createError(401, 'El usuario de la sesión ya no existe.'));
  }

  // El controlador protegido puede leer al usuario autenticado desde acá
  req.usuario = usuarioPublico(usuario);

  return next();
};

export default authMiddleware;
