const obtenerItems = (sesion) => sesion.carrito ?? [];

const guardarItems = (sesion, items) => {
  sesion.carrito = items;
  return items;
};

export default {
  obtenerItems,
  guardarItems,
};
