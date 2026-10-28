// Estructura de cada producto que devuelve la API
export type Producto = {
  id: string
  nombre: string
  descripcion?: string
  imagenUrl?: string
  precio: number
  stock?: number
  destacado?: boolean
  especificaciones?: Record<string, string>
}
