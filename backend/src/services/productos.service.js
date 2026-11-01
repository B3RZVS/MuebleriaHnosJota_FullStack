import productosRepository from '../repositories/productos.repository.js';

const crear = async (datosProducto) =>
  productosRepository.crear(datosProducto);

const obtenerTodos = async () => productosRepository.obtenerTodos();

const obtenerPorId = async (id) => productosRepository.obtenerPorId(id);

const actualizar = async (id, datos) =>
  productosRepository.actualizar(id, datos);

const eliminar = async (id) => productosRepository.eliminar(id);

export default {
  crear,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar,
};
