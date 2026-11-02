import createError from 'http-errors';
import carritoRepository from '../repositories/carrito.repository.js';
import productosRepository from '../repositories/productos.repository.js';

const CANTIDAD_MAXIMA = 99;

const validarDisponible = (producto, cantidad) => {
  if (cantidad > CANTIDAD_MAXIMA) {
    throw createError(
      400,
      `Podés llevar hasta ${CANTIDAD_MAXIMA} unidades por producto.`
    );
  }

  if (producto.stock === 0) {
    throw createError(400, `${producto.nombre} está sin stock.`);
  }

  if (producto.stock != null && cantidad > producto.stock) {
    const unidades =
      producto.stock === 1 ? '1 unidad' : `${producto.stock} unidades`;
    throw createError(400, `Solo hay ${unidades} de ${producto.nombre}.`);
  }
};

const buscarProducto = async (productoId) => {
  const producto = await productosRepository.obtenerPorId(productoId);

  if (!producto) {
    throw createError(404, 'Producto no encontrado');
  }

  return producto;
};

const obtener = async (sesion) => {
  const guardados = carritoRepository.obtenerItems(sesion);
  const productos = await Promise.all(
    guardados.map((item) => productosRepository.obtenerPorId(item.productoId))
  );

  // si un producto se borró del catálogo lo saco del carrito, no tiene que romper todo :v
  const vigentes = guardados.filter((item, indice) => productos[indice]);
  if (vigentes.length !== guardados.length) {
    carritoRepository.guardarItems(sesion, vigentes);
  }

  const items = productos.filter(Boolean).map((producto, indice) => ({
    productoId: producto.id,
    nombre: producto.nombre,
    imagen: producto.imagenUrl ?? '',
    precio: producto.precio,
    stock: producto.stock ?? null,
    cantidad: vigentes[indice].cantidad,
    subtotal: producto.precio * vigentes[indice].cantidad,
  }));

  return {
    items,
    totalItems: items.reduce((total, item) => total + item.cantidad, 0),
    total: items.reduce((total, item) => total + item.subtotal, 0),
  };
};

const agregar = async (sesion, productoId, cantidad) => {
  const producto = await buscarProducto(productoId);

  const items = carritoRepository.obtenerItems(sesion);
  const itemExistente = items.find((item) => item.productoId === producto.id);

  validarDisponible(producto, (itemExistente?.cantidad ?? 0) + cantidad);

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    items.push({ productoId: producto.id, cantidad });
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

  // bajar la cantidad siempre se puede, aunque el stock haya bajado
  if (cantidad > itemExistente.cantidad) {
    validarDisponible(await buscarProducto(productoId), cantidad);
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
    items.filter((item) => item.productoId !== productoId)
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
