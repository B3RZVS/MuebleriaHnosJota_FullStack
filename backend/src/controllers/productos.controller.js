import createError from 'http-errors';
import productosService from '../services/productos.service.js';

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

const crearProducto = async (req, res, next) => {
  const cuerpo = req.body;

  if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
    return next(createError(400, 'El cuerpo debe ser un objeto JSON'));
  }

  try {
    const producto = await productosService.crear(tomarCamposEditables(cuerpo));

    return res.status(201).json(producto);
  } catch (error) {
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
      return next(createError(404, 'Producto no encontrado'));
    }

    return res.status(200).json(producto);
  } catch (error) {
    return next(error);
  }
};

const actualizarProducto = async (req, res, next) => {
  try {
    const cuerpo = req.body ?? {};
    const datos = {};

    // PUT reemplaza el producto completo: lo que no viene queda vacío
    camposEditables.forEach((campo) => {
      datos[campo] = cuerpo[campo] ?? null;
    });

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
