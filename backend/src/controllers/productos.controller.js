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

const camposEditables = [
  'nombre',
  'descripcion',
  'precio',
  'stock',
  'imagenUrl',
  'destacado',
  'especificaciones',
];

// solo pasan los campos del producto, nada de _id ni cosas raras
const tomarCamposEditables = (cuerpo) => {
  const datos = {};

  camposEditables.forEach((campo) => {
    if (cuerpo[campo] !== undefined) {
      datos[campo] = cuerpo[campo];
    }
  });

  return datos;
};

const actualizarProducto = async (req, res, next) => {
  try {
    const datos = tomarCamposEditables(req.body ?? {});

    if (Object.keys(datos).length === 0) {
      return next(createError(400, 'No hay datos para actualizar'));
    }

    const producto = await productosService.actualizar(req.params.id, datos);

    if (!producto) {
      return next(createError(404, 'Producto no encontrado'));
    }

    return res.status(200).json(producto);
  } catch (error) {
    return next(error);
  }
};

const eliminarProducto = async (req, res, next) => {
  try {
    const producto = await productosService.eliminar(req.params.id);

    if (!producto) {
      return next(createError(404, 'Producto no encontrado'));
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
  actualizarProducto,
  eliminarProducto,
};
