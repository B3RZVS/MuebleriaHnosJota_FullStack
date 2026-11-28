import Product from '../models/product.model.js';
import Order from '../models/order.model.js';

const obtenerProductos = (ids) => Product.find({ _id: { $in: ids } }).lean();

const descontarStock = (id, cantidad) =>
  Product.findOneAndUpdate(
    { _id: id, stock: { $gte: cantidad } },
    { $inc: { stock: -cantidad } },
    { returnDocument: 'before' }
  );

const restaurarStock = (id, cantidad) =>
  Product.updateOne({ _id: id }, { $inc: { stock: cantidad } });

const crear = (datos) => Order.create(datos);

const obtenerPorUsuario = (usuarioId) =>
  Order.find({ usuario: usuarioId }).sort({ fechaPedido: -1, _id: -1 }).lean();

export default {
  obtenerProductos,
  descontarStock,
  restaurarStock,
  crear,
  obtenerPorUsuario,
};
