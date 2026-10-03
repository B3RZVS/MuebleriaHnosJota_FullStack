import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useCart } from "../../cart/context/useCart";
import "./Navbar.css";

interface NavbarProps {
  onAbrirCarrito: () => void;
}

function Navbar({ onAbrirCarrito }: NavbarProps) {
  const { carrito } = useCart();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const etiquetaCantidad =
    carrito.totalItems === 1 ? "1 producto" : `${carrito.totalItems} productos`;

  useEffect(() => {
    if (!menuAbierto) return;

    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setMenuAbierto(false);
    };

    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [menuAbierto]);

  return (
    <header className="barra">
      <NavLink className="marca" to="/" aria-label="Hermanos Jota, inicio">
        <img
          className="marca__simbolo"
          src="/logo.svg"
          alt=""
          width="40"
          height="40"
        />
        <span className="barra__marca">Hermanos Jota</span>
      </NavLink>

      <nav
        id="navegacion-principal"
        className={`barra__links${menuAbierto ? " barra__links--abierto" : ""}`}
        aria-label="Navegación principal"
      >
        <NavLink className="link" to="/" onClick={() => setMenuAbierto(false)}>
          Inicio
        </NavLink>
        <NavLink
          className="link"
          to="/productos"
          onClick={() => setMenuAbierto(false)}
        >
          Catálogo
        </NavLink>
        <NavLink
          className="link"
          to="/contacto"
          onClick={() => setMenuAbierto(false)}
        >
          Contacto
        </NavLink>
      </nav>

      <div className="barra__acciones">
        <button
          aria-label={`Abrir carrito, ${etiquetaCantidad}`}
          className="boton-carrito"
          onClick={onAbrirCarrito}
          type="button"
        >
          <span className="boton-carrito__texto" aria-hidden="true">
            Carrito
          </span>
          <span
            aria-label={etiquetaCantidad}
            className="boton-carrito__cantidad"
          >
            {carrito.totalItems}
          </span>
        </button>

        <button
          className={`boton-menu${menuAbierto ? " boton-menu--abierto" : ""}`}
          type="button"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          aria-controls="navegacion-principal"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
