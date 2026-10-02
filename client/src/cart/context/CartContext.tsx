import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import { carritoApi } from "../services/carritoApi";
import type { Carrito } from "../types";
import { CartContext, type CartContextValue } from "./cart-context";

const CARRITO_QUERY_KEY = ["carrito"] as const;
const AGREGAR_MUTATION_KEY = ["carrito", "agregar"] as const;

const carritoVacio: Carrito = {
  items: [],
  totalItems: 0,
  total: 0,
};

type AgregarVariables = {
  productoId: string;
  cantidad: number;
};

type CantidadVariables = {
  productoId: string;
  cantidad: number;
};

const mensajeError = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Ocurrió un error al comunicarse con el servidor.";

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const consultaCarrito = useQuery({
    queryKey: CARRITO_QUERY_KEY,
    queryFn: carritoApi.obtener,
  });

  const guardarCarrito = (carrito: Carrito) => {
    queryClient.setQueryData(CARRITO_QUERY_KEY, carrito);
  };

  const agregarMutation = useMutation({
    mutationKey: AGREGAR_MUTATION_KEY,
    mutationFn: ({ productoId, cantidad }: AgregarVariables) =>
      carritoApi.agregar(productoId, cantidad),
    onSuccess: guardarCarrito,
  });

  const cambiarCantidadMutation = useMutation({
    mutationKey: ["carrito", "cambiar-cantidad"],
    mutationFn: ({ productoId, cantidad }: CantidadVariables) =>
      carritoApi.cambiarCantidad(productoId, cantidad),
    onSuccess: guardarCarrito,
  });

  const quitarMutation = useMutation({
    mutationKey: ["carrito", "quitar"],
    mutationFn: (productoId: string) => carritoApi.quitar(productoId),
    onSuccess: guardarCarrito,
  });

  const vaciarMutation = useMutation({
    mutationKey: ["carrito", "vaciar"],
    mutationFn: carritoApi.vaciar,
    onSuccess: guardarCarrito,
  });

  const productosAgregando = useMutationState<string>({
    filters: {
      mutationKey: AGREGAR_MUTATION_KEY,
      status: "pending",
    },
    select: (mutation) =>
      (mutation.state.variables as AgregarVariables).productoId,
  });

  const mutaciones = [
    agregarMutation,
    cambiarCantidadMutation,
    quitarMutation,
    vaciarMutation,
  ];
  const errorMutation = mutaciones.find((mutation) => mutation.error)?.error;
  const actualizando = mutaciones.some((mutation) => mutation.isPending);
  const error = consultaCarrito.error ?? errorMutation;

  const value = useMemo<CartContextValue>(
    () => ({
      carrito: consultaCarrito.data ?? carritoVacio,
      cargando: consultaCarrito.isPending,
      actualizando,
      productosAgregando,
      error: error ? mensajeError(error) : "",
      agregar: async (productoId, cantidad = 1) => {
        try {
          await agregarMutation.mutateAsync({ productoId, cantidad });
          return true;
        } catch {
          // React Query conserva el error de la mutación para mostrarlo en el carrito.
          return false;
        }
      },
      cambiarCantidad: async (productoId, cantidad) => {
        try {
          await cambiarCantidadMutation.mutateAsync({ productoId, cantidad });
        } catch {
          // El error se expone mediante el contexto.
        }
      },
      quitar: async (productoId) => {
        try {
          await quitarMutation.mutateAsync(productoId);
        } catch {
          // El error se expone mediante el contexto.
        }
      },
      vaciar: async () => {
        try {
          await vaciarMutation.mutateAsync();
        } catch {
          // El error se expone mediante el contexto.
        }
      },
      limpiarError: () => {
        agregarMutation.reset();
        cambiarCantidadMutation.reset();
        quitarMutation.reset();
        vaciarMutation.reset();

        if (consultaCarrito.isError) {
          void consultaCarrito.refetch();
        }
      },
    }),
    [
      actualizando,
      agregarMutation,
      cambiarCantidadMutation,
      consultaCarrito,
      error,
      productosAgregando,
      quitarMutation,
      vaciarMutation,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
