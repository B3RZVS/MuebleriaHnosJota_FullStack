import productosRepository from '../repositories/productos.repository.js';

const obtenerTodos = () => productosRepository.obtenerTodos();

const obtenerPorId = (id) => productosRepository.obtenerPorId(id);

export default {
  obtenerTodos,
  obtenerPorId,
};
