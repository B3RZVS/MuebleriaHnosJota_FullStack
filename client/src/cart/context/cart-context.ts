import { createContext } from 'react'
import type { Carrito } from '../types'

export interface CartContextValue {
  carrito: Carrito
  cargando: boolean
  actualizando: boolean
  error: string
  agregar: (productoId: string) => Promise<void>
  cambiarCantidad: (productoId: string, cantidad: number) => Promise<void>
  quitar: (productoId: string) => Promise<void>
  vaciar: () => Promise<void>
  limpiarError: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
