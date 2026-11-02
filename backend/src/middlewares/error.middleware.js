import mongoose from 'mongoose';

// los errores de mongoose son culpa de los datos que llegaron, no del server :v
const traducirError = (error) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const mensajes = Object.values(error.errors).map((campo) =>
      campo instanceof mongoose.Error.CastError
        ? `El campo ${campo.path} no es válido.`
        : campo.message
    );
    return { status: 400, mensaje: mensajes.join(' ') };
  }

  if (error instanceof mongoose.Error.CastError) {
    return { status: 400, mensaje: `El campo ${error.path} no es válido.` };
  }

  if (error.code === 11000) {
    return { status: 409, mensaje: 'Ya existe un registro con esos datos.' };
  }

  if (error.type === 'entity.parse.failed') {
    return { status: 400, mensaje: 'El cuerpo no es un JSON válido.' };
  }

  const status = error.status || 500;

  // En un error 500 no se manda el mensaje real: puede mostrar datos internos, como rutas de archivos
  return {
    status,
    mensaje: status < 500 ? error.message : 'Error interno del servidor',
  };
};

const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  // si ya se empezó a responder no se puede mandar otra cosa, se lo dejo a express
  if (res.headersSent) {
    return next(error);
  }

  const { status, mensaje } = traducirError(error);

  return res.status(status).json({ mensaje });
};

export default errorMiddleware;
