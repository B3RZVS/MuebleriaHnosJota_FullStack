import mongoose from 'mongoose';
import createError from 'http-errors';
import Product from '../models/product.model.js';

const serializarProducto = (producto) => {
  const { _id, ...datosProducto } = producto;

  return {
    ...datosProducto,
    id: _id.toString(),
  };
};

const obtenerTodos = async () => {
  const productos = await Product.find().lean();
  return productos.map(serializarProducto);
};

const crear = async (datosProducto) => {
  const producto = await Product.create(datosProducto);
  return serializarProducto(producto.toObject());
};

const obtenerPorId = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, 'El id del producto no es válido');
  }

  const producto = await Product.findById(id).lean();
  return producto ? serializarProducto(producto) : null;
};

export default {
  crear,
  obtenerTodos,
  obtenerPorId,
};
