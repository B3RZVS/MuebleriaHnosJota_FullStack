import type { Producto } from '../types/producto';
import { API_PRODUCTOS } from '../utils/urls';

export type NuevoProducto = Omit<Producto, 'id'>;

const esProducto = (datos: unknown): datos is Producto =>
  typeof datos === 'object' &&
  datos !== null &&
  'id' in datos &&
  typeof datos.id === 'string' &&
  'nombre' in datos &&
  typeof datos.nombre === 'string' &&
  'precio' in datos &&
  typeof datos.precio === 'number';

const SIN_SERVIDOR =
  'No pudimos conectar con el servidor. Intentá de nuevo en unos segundos.';

// crear y editar responden igual: el producto, o un { mensaje } con el error
const guardarProducto = async (
  url: string,
  metodo: 'POST' | 'PUT',
  producto: NuevoProducto
): Promise<Producto> => {
  let respuesta: Response;

  try {
    respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
  } catch {
    // sin conexión el error de fetch es técnico y en inglés
    throw new Error(SIN_SERVIDOR);
  }

  // si Render está caído no llega JSON y queda en null
  const datos: unknown = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje =
      typeof datos === 'object' &&
      datos !== null &&
      'mensaje' in datos &&
      typeof datos.mensaje === 'string'
        ? datos.mensaje
        : SIN_SERVIDOR;
    throw new Error(mensaje);
  }

  if (!esProducto(datos)) {
    throw new Error(SIN_SERVIDOR);
  }

  return datos;
};

export const crearProducto = (nuevoProducto: NuevoProducto) =>
  guardarProducto(API_PRODUCTOS, 'POST', nuevoProducto);

// Si el id está mal escrito (400) o el producto no existe (404) devuelve null, para mostrar "no encontramos esta pieza"
export const obtenerProductoId = async (
  id: string
): Promise<Producto | null> => {
  const respuesta = await fetch(`${API_PRODUCTOS}/${id}`);

  if (respuesta.status === 400 || respuesta.status === 404) {
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
    throw new Error('La respuesta no es una lista de productos');
  }
  return datos as Producto[];
};

export const eliminarProducto = async (id: string): Promise<void> => {
  const respuesta = await fetch(`${API_PRODUCTOS}/${id}`, { method: 'DELETE' });

  if (!respuesta.ok) {
    throw new Error(`El servidor respondió ${respuesta.status}`);
  }
};

export const actualizarProducto = (id: string, cambios: NuevoProducto) =>
  guardarProducto(`${API_PRODUCTOS}/${id}`, 'PUT', cambios);
