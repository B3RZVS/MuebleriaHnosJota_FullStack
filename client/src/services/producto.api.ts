import type { Producto } from "../types/producto";
import { API_PRODUCTOS } from "../utils/urls";

// Si el producto no existe (404) devuelve null, para mostrar "no encontramos esta pieza"
export const obtenerProductoId = async (id: string): Promise<Producto | null> => {
  const respuesta = await fetch(`${API_PRODUCTOS}/${id}`);

  if (respuesta.status === 404) {
    return null;
  }

  // fetch no lanza error automáticamente ante 4xx o 5xx
  if (!respuesta.ok) {
    throw new Error(`El servidor respondió ${respuesta.status}`);
  }

  const datos: Producto = await respuesta.json();
  return datos;
};

export const obtenerProductos = async (): Promise<Producto[]> => {
  const respuesta = await fetch(API_PRODUCTOS);

  // fetch solo falla si la respuesta no llega (sin conexión, CORS);
  // un 404 o 500 sí llega, por eso se revisa respuesta.ok
  if (!respuesta.ok) {
    throw new Error(`El servidor respondió ${respuesta.status}`);
  }

  const datos = await respuesta.json();

  // Si la respuesta no es una lista, se trata como error para no dejar la página en blanco
  if (!Array.isArray(datos)) {
    throw new Error("La respuesta no es una lista de productos");
  }
  return datos as Producto[];
};
