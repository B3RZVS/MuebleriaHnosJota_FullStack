import createError from 'http-errors';
import mongoose from 'mongoose';
import pedidosService from '../services/pedidos.service.js';

const validarProductos = (productos) => {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw createError(400, 'El pedido debe incluir al menos un producto.');
  }

  const cantidadesPorProducto = new Map();

  productos.forEach((item) => {
    if (
      !item ||
      typeof item !== 'object' ||
      Array.isArray(item) ||
      typeof item.productoId !== 'string' ||
      !mongoose.isValidObjectId(item.productoId)
    ) {
      throw createError(400, 'Cada producto debe tener un productoId válido.');
    }

    if (!Number.isSafeInteger(item.cantidad) || item.cantidad < 1) {
      throw createError(400, 'La cantidad debe ser un entero mayor que cero.');
    }

    const productoId = new mongoose.Types.ObjectId(item.productoId).toString();
    const cantidad =
      (cantidadesPorProducto.get(productoId) ?? 0) + item.cantidad;

    if (!Number.isSafeInteger(cantidad)) {
      throw createError(400, 'La cantidad solicitada no es válida.');
    }

    cantidadesPorProducto.set(productoId, cantidad);
  });

  return Array.from(cantidadesPorProducto, ([productoId, cantidad]) => ({
    productoId,
    cantidad,
  }));
};

const crearPedido = async (req, res, next) => {
  try {
    const cuerpo = req.body;

    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      throw createError(400, 'El cuerpo debe ser un objeto JSON.');
    }

    const productos = validarProductos(cuerpo.productos);
    const pedido = await pedidosService.crear(req.usuario.id, productos);

    return res.status(201).json(pedido);
  } catch (error) {
    return next(error);
  }
};

const obtenerMisPedidos = async (req, res, next) => {
  try {
    const pedidos = await pedidosService.obtenerMisPedidos(req.usuario.id);
    return res.status(200).json(pedidos);
  } catch (error) {
    return next(error);
  }
};

export default {
  crearPedido,
  obtenerMisPedidos,
};
