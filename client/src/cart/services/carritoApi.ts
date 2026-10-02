import type { Carrito } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function esCarrito(datos: unknown): datos is Carrito {
  if (typeof datos !== 'object' || datos === null) return false

  const carrito = datos as Record<string, unknown>

  return (
    Array.isArray(carrito.items) &&
    Number.isInteger(carrito.totalItems) &&
    typeof carrito.total === 'number' &&
    carrito.items.every(
      (item: unknown) =>
        typeof item === 'object' &&
        item !== null &&
        'productoId' in item &&
        typeof item.productoId === 'string' &&
        'nombre' in item &&
        typeof item.nombre === 'string' &&
        'imagen' in item &&
        typeof item.imagen === 'string' &&
        'precio' in item &&
        typeof item.precio === 'number' &&
        'cantidad' in item &&
        Number.isInteger(item.cantidad) &&
        'subtotal' in item &&
        typeof item.subtotal === 'number',
    )
  )
}

async function solicitarCarrito(
  ruta: string,
  opciones: RequestInit = {},
): Promise<Carrito> {
  const respuesta = await fetch(`${API_URL}/api/carrito${ruta}`, {
    ...opciones,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers,
    },
  })

  let datos: unknown

  try {
    datos = await respuesta.json()
  } catch {
    throw new Error('El servidor respondió con datos que no son JSON.')
  }

  if (!respuesta.ok) {
    const mensaje =
      typeof datos === 'object' &&
      datos !== null &&
      'mensaje' in datos &&
      typeof datos.mensaje === 'string'
        ? datos.mensaje
        : 'No se pudo actualizar el carrito.'

    throw new Error(mensaje)
  }

  if (!esCarrito(datos)) {
    throw new Error('El servidor respondió con un formato de carrito inválido.')
  }

  return datos
}

export const carritoApi = {
  obtener: () => solicitarCarrito(''),

  agregar: (productoId: string, cantidad = 1) =>
    solicitarCarrito('/items', {
      method: 'POST',
      body: JSON.stringify({ productoId, cantidad }),
    }),

  cambiarCantidad: (productoId: string, cantidad: number) =>
    solicitarCarrito(`/items/${encodeURIComponent(productoId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ cantidad }),
    }),

  quitar: (productoId: string) =>
    solicitarCarrito(`/items/${encodeURIComponent(productoId)}`, {
      method: 'DELETE',
    }),

  vaciar: () =>
    solicitarCarrito('', {
      method: 'DELETE',
    }),
}
