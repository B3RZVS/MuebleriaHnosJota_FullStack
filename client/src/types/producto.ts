// Estructura de cada producto que devuelve la API (backend/src/data/productos.js)
export type Producto = {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  precio: number
  destacado: boolean
  especificaciones: Record<string, string>
}
