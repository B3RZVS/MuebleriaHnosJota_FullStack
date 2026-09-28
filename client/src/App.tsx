import { useEffect, useState } from 'react'
import ProductList from './components/ProductList.tsx'
import type { Producto } from './types/producto.ts'

// URL del backend: se puede cambiar con la variable VITE_API_URL en un archivo client/.env
// (ej: VITE_API_URL=https://mi-api.com, sin "/" al final).
// Si no está definida o está vacía, se usa el servidor local (el puerto está en backend/server.js)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_PRODUCTOS = `${API_URL}/api/productos`

function App() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pide los productos una sola vez, al montar la app ([] = sin dependencias).
  // En desarrollo StrictMode ejecuta el efecto dos veces: es normal ver 2 GET en la consola del backend.
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch(API_PRODUCTOS)

        // fetch solo falla si no hay conexión; un 404 o 500 se detecta con respuesta.ok
        if (!respuesta.ok) {
          throw new Error(`El servidor respondió ${respuesta.status}`)
        }

        const datos = await respuesta.json()

        // Si la respuesta no es una lista, se trata como error para no dejar la página en blanco
        if (!Array.isArray(datos)) {
          throw new Error('La respuesta no es una lista de productos')
        }

        setProductos(datos)
      } catch (err) {
        console.error(err)
        setError('No pudimos cargar los productos. Revisá tu conexión e intentá de nuevo.')
      } finally {
        setCargando(false)
      }
    }

    obtenerProductos()
  }, [])

  return (
    <main>
      <ProductList productos={productos} cargando={cargando} error={error} />
    </main>
  )
}

export default App
