// Estructura de cada producto que devuelve la API
export type Producto = {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  precio: number
  destacado: boolean
  especificaciones: Record<string, string>
}
