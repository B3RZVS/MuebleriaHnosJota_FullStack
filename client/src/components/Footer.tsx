function Footer() {
  return (
    <footer className="site-footer">
      <div className="contenedor site-footer__inner">
        <div className="site-footer__marca">
          <a className="marca" href="#inicio" aria-label="Mueblería Hnos. Jota, inicio">
            <span className="marca__simbolo" aria-hidden="true">JH</span>
            <span className="marca__nombre">Mueblería<br />Hnos. Jota</span>
          </a>
          <p className="site-footer__lema">Muebles para hacer hogar.</p>
        </div>
        <div className="site-footer__bloque">
          <h2>Explorá</h2>
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
        <div className="site-footer__bloque">
          <h2>¿Tenés una consulta?</h2>
          <p>Estamos para ayudarte a elegir los muebles que buscás.</p>
          <a href="#contacto">Escribinos</a>
        </div>
      </div>
      <div className="site-footer__creditos">
        <div className="contenedor">
          <p>© {new Date().getFullYear()} Mueblería Hnos. Jota</p>
          <p>Hecho para acompañar tu hogar.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer