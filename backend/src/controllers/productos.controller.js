import productosService from '../services/productos.service.js';

const obtenerProductos = (req, res, next) => {
  try {
    const productos = productosService.obtenerTodos();

    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};

const obtenerProductoPorId = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ mensaje: 'El ID debe ser un número entero positivo' });
    }

    const producto = productosService.obtenerPorId(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.status(200).json(producto);
  } catch (error) {
    return next(error);
  }
};

export default {
  obtenerProductos,
  obtenerProductoPorId,
};
