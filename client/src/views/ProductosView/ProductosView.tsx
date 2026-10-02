import { useEffect, useState } from "react";
import type { Producto } from "../../types/producto";
import ProductList from "../../components/ProductList";
// URL del backend: se puede cambiar con la variable VITE_API_URL en un archivo client/.env
// (ej: VITE_API_URL=https://mi-api.com, sin "/" al final).
// Si no está definida o está vacía, se usa el servidor local
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; // TODO: LLEVAR A UN ARCHIVO DE CONFIGURACION
const API_PRODUCTOS = `${API_URL}/api/productos`; // TODO: LLEVAR A UN ARCHIVO DE CONFIGURACION

export const ProductosView = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pide los productos una sola vez
  // En desarrollo StrictMode ejecuta el efecto dos veces: es normal ver 2 GET en la consola del backend :p
  useEffect(() => {
    // Se pone en true al desmontar: así la respuesta de una petición vieja no pisa el estado actual
    let cancelado = false;

    const obtenerProductos = async () => {
      try {
        // Si el servidor no responde en 10 segundos se corta la petición y se muestra el error
        const respuesta = await fetch(API_PRODUCTOS, {
          signal: AbortSignal.timeout(10000),
        });

        // fetch solo falla si la respuesta no llega (sin conexión, CORS, timeout);
        // un 404 o 500 sí llega, por eso se revisa respuesta.ok
        if (!respuesta.ok) {
          throw new Error(`El servidor respondió ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        // Si la respuesta no es una lista, se trata como error para no dejar la página en blanco
        if (!Array.isArray(datos)) {
          throw new Error("La respuesta no es una lista de productos");
        }

        if (!cancelado) {
          setProductos(datos);
        }
      } catch (err) {
        if (!cancelado) {
          console.error(err);
          setError(
            "No pudimos cargar los productos en este momento. Intentá de nuevo.",
          );
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    obtenerProductos();

    // Función de limpieza: React la ejecuta cuando el componente se desmonta
    return () => {
      cancelado = true;
    };
  }, []);
  return (
    <ProductList productos={productos} cargando={cargando} error={error} />
  );
};
