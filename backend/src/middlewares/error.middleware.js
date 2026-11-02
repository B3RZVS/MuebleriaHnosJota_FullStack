const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  // si ya se empezó a responder no se puede mandar otra cosa, se lo dejo a express
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || 500;

  // En un error 500 no se manda el mensaje real: puede mostrar datos internos, como rutas de archivos
  return res.status(status).json({
    mensaje: status < 500 ? error.message : 'Error interno del servidor',
  });
};

export default errorMiddleware;
