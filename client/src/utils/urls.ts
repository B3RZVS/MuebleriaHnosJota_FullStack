// URL del backend: se cambia con la variable VITE_API_URL en un archivo client/.env
// (ej: VITE_API_URL=https://mi-api.com, sin "/" al final). Si no está definida, se usa el servidor local
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const API_PRODUCTOS = `${API_URL}/api/productos`;
