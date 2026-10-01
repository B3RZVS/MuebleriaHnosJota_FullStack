export interface ItemCarrito {
  productoId: string
  nombre: string
  imagen: string
  precio: number
  cantidad: number
  subtotal: number
}

export interface Carrito {
  items: ItemCarrito[]
  totalItems: number
  total: number
}
