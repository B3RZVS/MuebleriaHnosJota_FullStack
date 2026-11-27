import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/useAuth';
import './Navbar.css';

interface NavbarProps {
  cantidadCarrito: number;
  onAbrirCarrito: () => void;
}

function Navbar({ cantidadCarrito, onAbrirCarrito }: NavbarProps) {
  const { usuario, estaAutenticado, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const etiquetaCantidad =
    cantidadCarrito === 1 ? '1 producto' : `${cantidadCarrito} productos`;

  useEffect(() => {
    if (!menuAbierto) return;

    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setMenuAbierto(false);
    };

    document.addEventListener('keydown', cerrarConEscape);
    return () => document.removeEventListener('keydown', cerrarConEscape);
  }, [menuAbierto]);

  const cerrarMenu = () => setMenuAbierto(false);

  const cerrarSesion = () => {
    cerrarMenu();
    logout();
    navigate('/', { replace: true });
  };

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
        className={`barra__links${menuAbierto ? ' barra__links--abierto' : ''}`}
        aria-label="Navegación principal"
      >
        <NavLink className="link" to="/" onClick={cerrarMenu}>
          Inicio
        </NavLink>
        <NavLink className="link" to="/productos" onClick={cerrarMenu}>
          Catálogo
        </NavLink>
        {usuario?.rol === 'admin' && (
          <NavLink
            className="link"
            to="/admin/crear-producto"
            onClick={cerrarMenu}
          >
            Crear producto
          </NavLink>
        )}
        <NavLink className="link" to="/contacto" onClick={cerrarMenu}>
          Contacto
        </NavLink>

        {estaAutenticado ? (
          <>
            <NavLink className="link" to="/mis-pedidos" onClick={cerrarMenu}>
              Mis pedidos
            </NavLink>
            <NavLink
              className="link link--sesion"
              to="/perfil"
              onClick={cerrarMenu}
            >
              Mi perfil
            </NavLink>
            <button
              className="link link--sesion link--boton"
              type="button"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink
              className="link link--sesion"
              to="/login"
              onClick={cerrarMenu}
            >
              Iniciar sesión
            </NavLink>
            <NavLink
              className="link link--sesion"
              to="/registro"
              onClick={cerrarMenu}
            >
              Registrarse
            </NavLink>
          </>
        )}
      </nav>

      <div className="barra__acciones">
        {estaAutenticado ? (
          <>
            <NavLink className="barra__usuario" to="/perfil">
              Hola, {usuario?.nombre}
            </NavLink>
            <button
              className="boton-sesion boton-sesion--salir"
              type="button"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink
              className="boton-sesion boton-sesion--secundario"
              to="/registro"
            >
              Registrarse
            </NavLink>
            <NavLink
              className="boton-sesion"
              to="/login"
              aria-label="Iniciar sesión"
            >
              Iniciar sesión
            </NavLink>
          </>
        )}
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
            {cantidadCarrito}
          </span>
        </button>

        <button
          className={`boton-menu${menuAbierto ? ' boton-menu--abierto' : ''}`}
          type="button"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
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
