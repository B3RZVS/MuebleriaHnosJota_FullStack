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

const obtenerPorId = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, 'El id del producto no es válido');
  }

  const producto = await Product.findById(id).lean();
  return producto ? serializarProducto(producto) : null;
};

const actualizar = async (id, datos) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, 'El id del producto no es válido');
  }

  try {
    const producto = await Product.findByIdAndUpdate(id, datos, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();

    return producto ? serializarProducto(producto) : null;
  } catch (error) {
    // si mongoose rechaza los datos es un 400, no un error del server :v
    if (
      error instanceof mongoose.Error.ValidationError ||
      error instanceof mongoose.Error.CastError
    ) {
      throw createError(400, 'Los datos del producto no son válidos');
    }

    throw error;
  }
};

const eliminar = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, 'El id del producto no es válido');
  }

  const producto = await Product.findByIdAndDelete(id).lean();
  return producto ? serializarProducto(producto) : null;
};

export default {
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar,
};
