const notFoundMiddleware = (req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
};

export default notFoundMiddleware;
