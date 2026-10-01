import carritoService from '../services/carrito.service.js';

const crearErrorSolicitud = (mensaje) => {
  const error = new Error(mensaje);
  error.statusCode = 400;
  return error;
};

const validarProductoId = (productoId) => {
  if (typeof productoId !== 'string' || productoId.trim() === '') {
    throw crearErrorSolicitud('productoId debe ser un texto no vacío');
  }

  return productoId.trim();
};

const validarCantidad = (cantidad) => {
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw crearErrorSolicitud('La cantidad debe ser un entero mayor que cero');
  }

  return cantidad;
};

const responderConCarrito = (res, next, operacion) => {
  try {
    return res.status(200).json(operacion());
  } catch (error) {
    return next(error);
  }
};

const obtenerCarrito = (req, res, next) =>
  responderConCarrito(res, next, () =>
    carritoService.obtener(req.session),
  );

const agregarItem = (req, res, next) =>
  responderConCarrito(res, next, () => {
    const cuerpo = req.body ?? {};
    const productoId = validarProductoId(cuerpo.productoId);
    const cantidad = validarCantidad(cuerpo.cantidad ?? 1);

    return carritoService.agregar(req.session, productoId, cantidad);
  });

const actualizarCantidad = (req, res, next) =>
  responderConCarrito(res, next, () => {
    const productoId = validarProductoId(req.params.productoId);
    const cantidad = validarCantidad(req.body?.cantidad);

    return carritoService.actualizarCantidad(
      req.session,
      productoId,
      cantidad,
    );
  });

const eliminarItem = (req, res, next) =>
  responderConCarrito(res, next, () =>
    carritoService.eliminar(
      req.session,
      validarProductoId(req.params.productoId),
    ),
  );

const vaciarCarrito = (req, res, next) =>
  responderConCarrito(res, next, () =>
    carritoService.vaciar(req.session),
  );

export default {
  obtenerCarrito,
  agregarItem,
  actualizarCantidad,
  eliminarItem,
  vaciarCarrito,
};
