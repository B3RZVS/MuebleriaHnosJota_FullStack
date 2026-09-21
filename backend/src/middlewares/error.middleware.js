const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  res.status(error.statusCode || 500).json({
    mensaje: error.message || 'Error interno del servidor',
  });
};

export default errorMiddleware;
