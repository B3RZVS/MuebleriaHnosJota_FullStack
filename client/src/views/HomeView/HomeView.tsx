import { useEffect } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../../components/ProductCard/ProductCard";
import { useProductosApi } from "../../hooks/useProductosApi";
import "./HomeView.css";

const compromisos = [
  {
    titulo: "Madera con origen",
    texto:
      "Algarrobo, quebracho y caldén certificados FSC®, provenientes de bosques responsables argentinos.",
  },
  {
    titulo: "Herencia viva",
    texto:
      "Diez años de garantía en estructura y cinco en acabados. Restauramos piezas para extender su historia.",
  },
  {
    titulo: "Hecho en el taller",
    texto:
      "Cada mueble se tornea, arma y embala en San Cristóbal, con acabados naturales de bajo impacto.",
  },
];

function HomeView() {
  const { data: productos = [], isLoading, error } = useProductosApi();
  // React Router no vuelve arriba al cambiar de página: sin esto se abre a mitad del scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const destacados = productos
    .filter((producto) => producto.destacado)
    .slice(0, 4);
  const productoHero =
    productos.find((producto) => producto.id === "sillon-copacabana") ??
    destacados[0];

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-contenedor home-hero__inner">
          <div className="home-hero__texto">
            <p className="home-eyebrow">
              Casa Taller · San Cristóbal, Buenos Aires
            </p>
            <h1>Cada pieza cuenta una historia</h1>
            <p className="home-hero__bajada">
              Trabajamos maderas de bosques argentinos certificados y las
              terminamos con aceite de lino y cera de abejas. Muebles que
              recuerdan el optimismo de los años 60, hechos con la conciencia
              de hoy.
            </p>
            <div className="home-acciones">
              <Link
                className="home-boton home-boton--principal"
                to="/productos"
              >
                Ver el catálogo
              </Link>
              <Link
                className="home-boton home-boton--secundario"
                to="/contacto"
              >
                Visitar el taller
              </Link>
            </div>
          </div>

          <figure className="home-hero__figura">
            <div className="home-hero__imagen">
              {productoHero ? (
                <img
                  src={productoHero.imagen}
                  alt={productoHero.nombre}
                  width="1024"
                  height="1024"
                  fetchPriority="high"
                />
              ) : (
                isLoading && (
                  <div className="home-hero__skeleton" aria-hidden="true" />
                )
              )}
            </div>
            {productoHero && (
              <figcaption>
                <Link to={`/productos/${productoHero.id}`}>
                  {productoHero.nombre} <span aria-hidden="true">→</span>
                </Link>
              </figcaption>
            )}
          </figure>
        </div>
      </section>

      <section
        className="home-compromiso"
        aria-labelledby="compromiso-titulo"
      >
        <div className="home-contenedor">
          <div className="home-monograma" aria-hidden="true">
            HJ
          </div>
          <h2 id="compromiso-titulo">Nuestro compromiso</h2>
          <ul className="home-compromiso__lista">
            {compromisos.map((compromiso) => (
              <li key={compromiso.titulo}>
                <h3>{compromiso.titulo}</h3>
                <p>{compromiso.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="home-destacados"
        aria-labelledby="destacados-titulo"
      >
        <div className="home-contenedor">
          <header className="home-destacados__encabezado">
            <p className="home-eyebrow">Selección de la casa</p>
            <h2 id="destacados-titulo">Piezas destacadas</h2>
            <p>
              Cuatro muebles que resumen cómo trabajamos: madera noble a la
              vista, herrajes discretos y proporciones que envejecen bien.
            </p>
          </header>

          {isLoading && (
            <div
              className="home-destacados__grilla"
              aria-label="Cargando piezas"
            >
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  className="home-card-skeleton"
                  key={index}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}

          {error && (
            <p className="home-destacados__estado" role="alert">
              No pudimos cargar la selección en este momento.
            </p>
          )}

          {!isLoading && !error && (
            <ul className="home-destacados__grilla">
              {destacados.map((producto) => (
                <li key={producto.id}>
                  <ProductCard producto={producto} />
                </li>
              ))}
            </ul>
          )}

          <div className="home-destacados__pie">
            <Link
              className="home-boton home-boton--secundario"
              to="/productos"
            >
              Ver todas las piezas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeView;
