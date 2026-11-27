import createError from 'http-errors';

// Tiene que ejecutarse después de authMiddleware, que deja el usuario en req.usuario
const adminGuard = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return next(
      createError(
        403,
        'Necesitás permisos de administrador para realizar esta acción.'
      )
    );
  }

  return next();
};

export default adminGuard;
