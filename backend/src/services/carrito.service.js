import carritoRepository from '../repositories/carrito.repository.js';
import productosRepository from '../repositories/productos.repository.js';

const crearError = (mensaje, statusCode) => {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  return error;
};

const buscarProducto = (productoId) => {
  const producto = productosRepository.obtenerPorId(productoId);

  if (!producto) {
    throw crearError('Producto no encontrado', 404);
  }

  return producto;
};

const obtener = (sesion) => {
  const items = carritoRepository.obtenerItems(sesion).map((item) => {
    const producto = buscarProducto(item.productoId);

    return {
      productoId: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: producto.precio,
      cantidad: item.cantidad,
      subtotal: producto.precio * item.cantidad,
    };
  });

  return {
    items,
    totalItems: items.reduce((total, item) => total + item.cantidad, 0),
    total: items.reduce((total, item) => total + item.subtotal, 0),
  };
};

const agregar = (sesion, productoId, cantidad) => {
  buscarProducto(productoId);

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

const actualizarCantidad = (sesion, productoId, cantidad) => {
  const items = carritoRepository.obtenerItems(sesion);
  const itemExistente = items.find((item) => item.productoId === productoId);

  if (!itemExistente) {
    throw crearError('El producto no está en el carrito', 404);
  }

  itemExistente.cantidad = cantidad;
  carritoRepository.guardarItems(sesion, items);
  return obtener(sesion);
};

const eliminar = (sesion, productoId) => {
  const items = carritoRepository.obtenerItems(sesion);

  if (!items.some((item) => item.productoId === productoId)) {
    throw crearError('El producto no está en el carrito', 404);
  }

  carritoRepository.guardarItems(
    sesion,
    items.filter((item) => item.productoId !== productoId),
  );
  return obtener(sesion);
};

const vaciar = (sesion) => {
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
