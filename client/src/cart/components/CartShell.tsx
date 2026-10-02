import { useState, type ReactNode } from "react";
import CartModal from "./CartModal";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

interface CartShellProps {
  children: ReactNode;
}

function CartShell({ children }: CartShellProps) {
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <>
      <Navbar onAbrirCarrito={() => setCarritoAbierto(true)} />
      {children}
      <CartModal
        abierto={carritoAbierto}
        onCerrar={() => setCarritoAbierto(false)}
      />
      <Footer />
    </>
  );
}

export default CartShell;
