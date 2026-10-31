import createError from 'http-errors';
import mongoose from 'mongoose';
import productosService from '../services/productos.service.js';

const crearProducto = async (req, res, next) => {
  const cuerpo = req.body;

  if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
    return next(createError(400, 'El cuerpo debe ser un objeto JSON'));
  }

  try {
    const producto = await productosService.crear(cuerpo);

    return res.status(201).json(producto);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(createError(400, error.message));
    }

    return next(error);
  }
};

const obtenerProductos = async (req, res, next) => {
  try {
    const productos = await productosService.obtenerTodos();

    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};

const obtenerProductoPorId = async (req, res, next) => {
  try {
    const producto = await productosService.obtenerPorId(req.params.id);

    if (!producto) {
      return next(createError(404, "Producto no encontrado"));
    }

    return res.status(200).json(producto);
  } catch (error) {
    return next(error);
  }
};

export default {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
};
