import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__marca">
          <Link className="site-footer__logo" to="/" aria-label="Hermanos Jota, inicio">
            <span aria-hidden="true">HJ</span>
            Hermanos Jota
          </Link>
          <p>Muebles que no sólo cumplen una función: alimentan el alma.</p>
        </div>

        <div className="site-footer__bloque">
          <h2>Showroom y taller</h2>
          <p>Av. San Juan 2847<br />San Cristóbal, CABA</p>
          <p>Lunes a viernes, 10 a 19 h<br />Sábados, 10 a 14 h</p>
        </div>

        <div className="site-footer__bloque">
          <h2>Explorá</h2>
          <ul>
            <li><Link to="/productos">Catálogo</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="site-footer__bloque">
          <h2>Contacto</h2>
          <ul>
            <li><a href="mailto:info@hermanosjota.com.ar">info@hermanosjota.com.ar</a></li>
            <li>
              <a href="https://wa.me/541145678900" target="_blank" rel="noreferrer">
                WhatsApp +54 11 4567-8900
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer__creditos">
        <p>© {new Date().getFullYear()} Hermanos Jota · Hecho en Buenos Aires</p>
        <p>Diseño argentino, madera con origen.</p>
      </div>
    </footer>
  );
}

export default Footer;
