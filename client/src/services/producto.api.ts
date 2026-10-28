import type { Producto } from "../types/producto";
import { API_PRODUCTOS } from "../utils/urls";

type NuevoProducto = Omit<Producto, "id">;

const esProducto = (datos: unknown): datos is Producto =>
  typeof datos === "object" &&
  datos !== null &&
  "id" in datos &&
  typeof datos.id === "string" &&
  "nombre" in datos &&
  typeof datos.nombre === "string" &&
  "precio" in datos &&
  typeof datos.precio === "number";

export const crearProducto = async (
  nuevoProducto: NuevoProducto,
): Promise<Producto> => {
  const respuesta = await fetch(API_PRODUCTOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoProducto),
  });
  const datos: unknown = await respuesta.json();

  if (!respuesta.ok) {
    const mensaje =
      typeof datos === "object" &&
      datos !== null &&
      "mensaje" in datos &&
      typeof datos.mensaje === "string"
        ? datos.mensaje
        : `El servidor respondió ${respuesta.status}`;
    throw new Error(mensaje);
  }

  if (!esProducto(datos)) {
    throw new Error("La respuesta no contiene un producto válido");
  }

  return datos;
};

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
