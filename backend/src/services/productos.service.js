import productosRepository from '../repositories/productos.repository.js';

const crear = async (datosProducto) =>
  productosRepository.crear(datosProducto);

const obtenerTodos = async () => productosRepository.obtenerTodos();

const obtenerPorId = async (id) => productosRepository.obtenerPorId(id);

export default {
  crear,
  obtenerTodos,
  obtenerPorId,
};
