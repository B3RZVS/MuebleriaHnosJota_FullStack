import type { Pedido, ProductoParaPedido } from '../types/pedido';
import { API_URL } from '../utils/urls';
import { fetchConAuth, leerJson, SIN_SERVIDOR } from './apiClient';

export const crearPedido = async (
  token: string,
  productos: ProductoParaPedido[]
): Promise<Pedido> => {
  const respuesta = await fetchConAuth(
    `${API_URL}/api/pedidos`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productos }),
    },
    token
  );

  return leerJson<Pedido>(respuesta, SIN_SERVIDOR);
};

export const obtenerMisPedidos = async (token: string): Promise<Pedido[]> => {
  const respuesta = await fetchConAuth(
    `${API_URL}/api/pedidos/mis-pedidos`,
    {},
    token
  );
  return leerJson<Pedido[]>(respuesta, SIN_SERVIDOR);
};
