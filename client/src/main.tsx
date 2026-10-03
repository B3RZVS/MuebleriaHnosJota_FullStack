import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import CartShell from "./cart/components/CartShell";
import { CartProvider } from "./cart/context/CartContext";

// Por defecto React Query reintenta 3 veces y el error tarda varios segundos en aparecer
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>
          <CartShell>
            <App />
          </CartShell>
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
