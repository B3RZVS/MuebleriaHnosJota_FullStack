import productosRepository from '../repositories/productos.repository.js';

const obtenerTodos = async () => productosRepository.obtenerTodos();

const obtenerPorId = async (id) => productosRepository.obtenerPorId(id);

export default {
  obtenerTodos,
  obtenerPorId,
};
