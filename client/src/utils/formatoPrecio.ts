// Da formato a la moneda del precio: 185000 -> "$ 185.000"
export const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  // Hay que indicar los dos: si solo se pone el máximo, navegadores viejos tiran error
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
