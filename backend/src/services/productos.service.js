import productosRepository from '../repositories/productos.repository.js';

const obtenerTodos = async () => productosRepository.obtenerTodos();

const obtenerPorId = async (id) => productosRepository.obtenerPorId(id);

const actualizar = async (id, datos) =>
  productosRepository.actualizar(id, datos);

const eliminar = async (id) => productosRepository.eliminar(id);

export default {
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar,
};
