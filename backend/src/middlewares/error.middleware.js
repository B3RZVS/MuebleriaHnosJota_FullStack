const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  const status = error.status || 500;

  // En un error 500 no se manda el mensaje real: puede mostrar datos internos, como rutas de archivos
  res.status(status).json({
    mensaje: status < 500 ? error.message : 'Error interno del servidor',
  });
};

export default errorMiddleware;
