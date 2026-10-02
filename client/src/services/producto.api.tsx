const API_PRODUCTOS = "http://localhost:3000/api/productos"; // TODO: LLEVAR A UN ARCHIVO DE CONFIGURACION

export const obtenerProductoId = async (id: string) => {
  const respuesta = await fetch(`${API_PRODUCTOS}/${id}`, {
    signal: AbortSignal.timeout(10000),
  });

  // fetch no lanza error automáticamente ante 4xx o 5xx
  if (!respuesta.ok) {
    throw new Error(`El servidor respondió ${respuesta.status}`);
  }

  const datos = await respuesta.json();

  if (!Array.isArray(datos)) {
    throw new Error("La respuesta no es una lista de productos");
  }

  return datos;
};
