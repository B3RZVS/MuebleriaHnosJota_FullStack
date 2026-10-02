import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app-shell" id="inicio">
      <a className="saltar-al-contenido" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <div className="contenedor site-header__inner">
          <a className="marca" href="#inicio" aria-label="Mueblería Hnos. Jota, inicio">
            <span className="marca__simbolo" aria-hidden="true">JH</span>
            <span className="marca__nombre">Mueblería<br />Hnos. Jota</span>
          </a>
          <nav className="nav-principal" aria-label="Navegación principal">
            <ul className="nav-principal__lista">
              <li><a className="is-activa" href="#contacto">Contacto</a></li>
            </ul>
          </nav>
          <a className="boton boton--secundario app-header__cta" href="#contacto">Hacer una consulta</a>
        </div>
      </header>
      <main id="contenido">
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}

export default App
