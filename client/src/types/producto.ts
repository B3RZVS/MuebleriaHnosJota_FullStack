// Estructura de cada producto que devuelve la API
export type Producto = {
  id: string;
  nombre: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  precio: number;
  stock?: number | null;
  destacado?: boolean | null;
  especificaciones?: Record<string, string> | null;
};
