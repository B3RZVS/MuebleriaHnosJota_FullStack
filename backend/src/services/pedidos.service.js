import createError from 'http-errors';
import pedidosRepository from '../repositories/pedidos.repository.js';

const serializarPedido = (pedido) => {
  const { _id, ...datosPedido } = pedido;

  return {
    ...datosPedido,
    id: _id.toString(),
    usuario: pedido.usuario.toString(),
    productos: pedido.productos.map((item) => ({
      ...item,
      producto: item.producto.toString(),
    })),
  };
};

const crear = async (usuarioId, productosSolicitados) => {
  const productos = await pedidosRepository.obtenerProductos(
    productosSolicitados.map((item) => item.productoId)
  );
  const productosPorId = new Map(
    productos.map((producto) => [producto._id.toString(), producto])
  );

  const productosPedido = productosSolicitados.map((item) => {
    const producto = productosPorId.get(item.productoId);

    if (!producto) {
      throw createError(404, 'Uno o más productos no fueron encontrados.');
    }

    if (producto.stock != null && item.cantidad > producto.stock) {
      throw createError(409, `No hay stock suficiente de ${producto.nombre}.`);
    }

    const subtotal = producto.precio * item.cantidad;

    return {
      producto: producto._id,
      nombre: producto.nombre,
      cantidad: item.cantidad,
      precio: producto.precio,
      subtotal,
    };
  });

  const stockDescontado = [];
  let pedido;

  try {
    for (const item of productosPedido) {
      const producto = productosPorId.get(item.producto.toString());

      if (producto.stock == null) {
        continue;
      }

      const actualizado = await pedidosRepository.descontarStock(
        producto._id,
        item.cantidad
      );

      if (!actualizado) {
        throw createError(
          409,
          `El stock de ${producto.nombre} cambió. Revisá la disponibilidad e intentá nuevamente.`
        );
      }

      stockDescontado.push({
        id: producto._id,
        cantidad: item.cantidad,
      });
    }

    pedido = await pedidosRepository.crear({
      usuario: usuarioId,
      productos: productosPedido,
      total: productosPedido.reduce((total, item) => total + item.subtotal, 0),
    });
  } catch (error) {
    const resultadosReversion = await Promise.allSettled(
      stockDescontado.map(async ({ id, cantidad }) => {
        const resultado = await pedidosRepository.restaurarStock(id, cantidad);

        if (resultado.matchedCount !== 1) {
          throw new Error('No se pudo restaurar el stock del producto.');
        }
      })
    );
    const erroresReversion = resultadosReversion
      .filter((resultado) => resultado.status === 'rejected')
      .map((resultado) => resultado.reason);

    if (erroresReversion.length > 0) {
      throw new AggregateError(
        erroresReversion,
        'No se pudo completar o revertir la operación del pedido.',
        { cause: error }
      );
    }

    throw error;
  }

  return serializarPedido(pedido.toObject());
};

const obtenerMisPedidos = async (usuarioId) => {
  const pedidos = await pedidosRepository.obtenerPorUsuario(usuarioId);
  return pedidos.map(serializarPedido);
};

export default {
  crear,
  obtenerMisPedidos,
};
