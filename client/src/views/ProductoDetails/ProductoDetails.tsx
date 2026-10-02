import { useParams } from "react-router-dom";

export const ProductoDetails = () => {
  const { id } = useParams();

  return (
    <>
      <a className="saltar-al-contenido" href="#contenido">
        Saltar al contenido
      </a>

      <header className="site-header">
        <div className="site-header__inner contenedor">
          <a className="marca" href="index.html">
            <img
              className="marca__simbolo"
              src="assets/logo/logo.svg"
              alt="Logo de Hermanos Jota"
              width="500"
              height="500"
            />
            <span className="marca__nombre">Hermanos Jota</span>
          </a>

          <nav className="nav-principal" aria-label="Navegación principal">
            <ul className="nav-principal__lista">
              <li>
                <a href="index.html">Inicio</a>
              </li>
              <li>
                <a href="productos.html">Catálogo</a>
              </li>
              <li>
                <a href="contacto.html">Contacto</a>
              </li>
            </ul>
          </nav>

          <button
            className="boton-carrito"
            id="boton-carrito"
            type="button"
            disabled
          >
            Carrito
            <span className="boton-carrito__contador" id="contador-carrito">
              0
            </span>
          </button>
        </div>
      </header>

      <main id="contenido" className="product-page contenedor">
        <nav className="migas" aria-label="Ruta de navegación">
          <a href="productos.html">&larr; Volver al catálogo</a>
        </nav>

        <div id="product-detail" className="product-detail" aria-live="polite">
          <p className="product-status">Buscando la pieza…</p>
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner contenedor">
          <div className="site-footer__marca">
            <img
              className="marca__simbolo"
              src="assets/logo/logo.svg"
              alt=""
              width="500"
              height="500"
              loading="lazy"
              decoding="async"
            ></img>
            <p className="site-footer__lema">
              Muebles que no solo cumplen una función: alimentan el alma.
            </p>
          </div>

          <div className="site-footer__bloque">
            <h2>Showroom y taller</h2>
            <p>
              Av. San Juan 2847
              <br />
              C1232AAB · San Cristóbal, CABA
            </p>
            <p>
              Lunes a viernes, 10:00 a 19:00
              <br />
              Sábados, 10:00 a 14:00
            </p>
          </div>

          <div className="site-footer__bloque">
            <h2>Contacto</h2>
            <ul>
              <li>
                <a href="mailto:info@hermanosjota.com.ar">
                  info@hermanosjota.com.ar
                </a>
              </li>
              <li>
                <a href="mailto:ventas@hermanosjota.com.ar">
                  ventas@hermanosjota.com.ar
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/541145678900"
                  target="_blank"
                  rel="noopener"
                >
                  WhatsApp +54 11 4567-8900
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__bloque">
            <h2>Seguinos</h2>
            <ul>
              <li>
                <a
                  href="https://www.instagram.com/hermanosjota_ba"
                  target="_blank"
                  rel="noopener"
                >
                  Instagram @hermanosjota_ba
                </a>
              </li>
              <li>
                <a
                  href="https://www.hermanosjota.com.ar"
                  target="_blank"
                  rel="noopener"
                >
                  www.hermanosjota.com.ar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__creditos">
          <div className="contenedor">
            <p>
              © 2026 Hermanos Jota. Todas las piezas se fabrican en Buenos
              Aires.
            </p>
            <p>
              Sitio desarrollado como trabajo práctico — Curso Full-Stack, ITBA.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
