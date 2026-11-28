export type PedidoProducto = {
  producto: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
};

export type Pedido = {
  id: string;
  usuario: string;
  productos: PedidoProducto[];
  total: number;
  fechaPedido: string;
};

export type ProductoParaPedido = {
  productoId: string;
  cantidad: number;
};
