import createError from 'http-errors';
import carritoRepository from '../repositories/carrito.repository.js';
import productosRepository from '../repositories/productos.repository.js';

const buscarProducto = async (productoId) => {
  const producto = await productosRepository.obtenerPorId(productoId);

  if (!producto) {
    throw createError(404, 'Producto no encontrado');
  }

  return producto;
};

const obtener = async (sesion) => {
  const items = await Promise.all(
    carritoRepository.obtenerItems(sesion).map(async (item) => {
      const producto = await buscarProducto(item.productoId);

      return {
        productoId: producto.id,
        nombre: producto.nombre,
        imagen: producto.imagenUrl ?? '',
        precio: producto.precio,
        cantidad: item.cantidad,
        subtotal: producto.precio * item.cantidad,
      };
    }),
  );

  return {
    items,
    totalItems: items.reduce((total, item) => total + item.cantidad, 0),
    total: items.reduce((total, item) => total + item.subtotal, 0),
  };
};

const agregar = async (sesion, productoId, cantidad) => {
  await buscarProducto(productoId);

  const items = carritoRepository.obtenerItems(sesion);
  const itemExistente = items.find((item) => item.productoId === productoId);

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    items.push({ productoId, cantidad });
  }

  carritoRepository.guardarItems(sesion, items);
  return obtener(sesion);
};

const actualizarCantidad = async (sesion, productoId, cantidad) => {
  const items = carritoRepository.obtenerItems(sesion);
  const itemExistente = items.find((item) => item.productoId === productoId);

  if (!itemExistente) {
    throw createError(404, 'El producto no está en el carrito');
  }

  itemExistente.cantidad = cantidad;
  carritoRepository.guardarItems(sesion, items);
  return obtener(sesion);
};

const eliminar = async (sesion, productoId) => {
  const items = carritoRepository.obtenerItems(sesion);

  if (!items.some((item) => item.productoId === productoId)) {
    throw createError(404, 'El producto no está en el carrito');
  }

  carritoRepository.guardarItems(
    sesion,
    items.filter((item) => item.productoId !== productoId),
  );
  return obtener(sesion);
};

const vaciar = async (sesion) => {
  carritoRepository.guardarItems(sesion, []);
  return obtener(sesion);
};

export default {
  obtener,
  agregar,
  actualizarCantidad,
  eliminar,
  vaciar,
};
