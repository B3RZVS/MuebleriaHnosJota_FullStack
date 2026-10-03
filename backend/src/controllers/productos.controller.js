import createError from "http-errors";
import productosService from "../services/productos.service.js";

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
    const producto = productosService.obtenerPorId(req.params.id);

    if (!producto) {
      return next(createError(404, "Producto no encontrado"));
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
