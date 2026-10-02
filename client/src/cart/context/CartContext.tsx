import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { carritoApi } from '../services/carritoApi'
import type { Carrito } from '../types'
import { CartContext, type CartContextValue } from './cart-context'

const carritoVacio: Carrito = {
  items: [],
  totalItems: 0,
  total: 0,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<Carrito>(carritoVacio)
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(false)
  const [error, setError] = useState('')

  const ejecutarOperacion = useCallback(
    async (operacion: () => Promise<Carrito>) => {
      setActualizando(true)
      setError('')

      try {
        setCarrito(await operacion())
      } catch (errorDesconocido) {
        setError(
          errorDesconocido instanceof Error
            ? errorDesconocido.message
            : 'Ocurrió un error al comunicarse con el servidor.',
        )
      } finally {
        setActualizando(false)
      }
    },
    [],
  )

  useEffect(() => {
    let activo = true

    carritoApi
      .obtener()
      .then((carritoInicial) => {
        if (activo) setCarrito(carritoInicial)
      })
      .catch((errorDesconocido: unknown) => {
        if (activo) {
          setError(
            errorDesconocido instanceof Error
              ? errorDesconocido.message
              : 'No se pudo cargar el carrito.',
          )
        }
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      carrito,
      cargando,
      actualizando,
      error,
      agregar: (productoId) =>
        ejecutarOperacion(() => carritoApi.agregar(productoId)),
      cambiarCantidad: (productoId, cantidad) =>
        ejecutarOperacion(() =>
          carritoApi.cambiarCantidad(productoId, cantidad),
        ),
      quitar: (productoId) =>
        ejecutarOperacion(() => carritoApi.quitar(productoId)),
      vaciar: () => ejecutarOperacion(() => carritoApi.vaciar()),
      limpiarError: () => setError(''),
    }),
    [actualizando, carrito, cargando, error, ejecutarOperacion],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
