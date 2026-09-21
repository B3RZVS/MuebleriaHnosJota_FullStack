import productos from '../data/productos.js';

const obtenerTodos = () => productos;

const obtenerPorId = (id) => productos.find((producto) => producto.id === id);

export default {
  obtenerTodos,
  obtenerPorId,
};
