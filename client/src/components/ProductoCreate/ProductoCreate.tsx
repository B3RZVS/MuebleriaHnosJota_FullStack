import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { crearProducto } from "../../services/producto.api";
import type { Producto } from "../../types/producto";
import "./ProductoCreate.css";

export type ValoresFormulario = {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  imagenUrl: string;
  destacado: boolean;
  especificaciones: string;
};

type CampoFormulario = keyof ValoresFormulario;
type ErroresFormulario = Partial<Record<CampoFormulario, string>>;

const valoresVacios: ValoresFormulario = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagenUrl: "",
  destacado: false,
  especificaciones: "",
};

// con estas props el mismo form sirve para editar :D
type ProductoCreateProps = {
  valoresIniciales?: ValoresFormulario;
  titulo?: string;
  textoBoton?: string;
  onGuardar?: (producto: Omit<Producto, "id">) => Promise<void>;
};

function ProductoCreate({
  valoresIniciales = valoresVacios,
  titulo = "Agregar un producto",
  textoBoton = "Crear producto",
  onGuardar,
}: ProductoCreateProps) {
  const navigate = useNavigate();
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [errorEnvio, setErrorEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const actualizarCampo = <Campo extends CampoFormulario>(
    campo: Campo,
    valor: ValoresFormulario[Campo],
  ) => {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
    setErrorEnvio("");
  };

  const validar = () => {
    const siguientesErrores: ErroresFormulario = {};
    let especificaciones: Record<string, string> | undefined;
    const nombre = valores.nombre.trim();
    const precio = Number(valores.precio);
    const stock = Number(valores.stock);

    if (!nombre) siguientesErrores.nombre = "Ingresá el nombre del producto.";
    if (!valores.precio.trim()) {
      siguientesErrores.precio = "Ingresá el precio.";
    } else if (!Number.isFinite(precio) || precio < 0) {
      siguientesErrores.precio = "El precio debe ser un número igual o mayor que cero.";
    }
    if (
      valores.stock.trim() &&
      (!Number.isFinite(stock) || stock < 0)
    ) {
      siguientesErrores.stock = "El stock debe ser un número igual o mayor que cero.";
    }

    if (valores.especificaciones.trim()) {
      try {
        const datos: unknown = JSON.parse(valores.especificaciones);
        if (
          typeof datos !== "object" ||
          datos === null ||
          Array.isArray(datos) ||
          Object.values(datos).some((valor) => typeof valor !== "string")
        ) {
          siguientesErrores.especificaciones =
            "Las especificaciones deben ser un objeto JSON con valores de texto.";
        } else {
          especificaciones = datos as Record<string, string>;
        }
      } catch {
        siguientesErrores.especificaciones =
          "Ingresá un objeto JSON válido para las especificaciones.";
      }
    }

    return { errores: siguientesErrores, especificaciones };
  };

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setErrorEnvio("");

    const { errores: siguientesErrores, especificaciones } = validar();
    setErrores(siguientesErrores);
    if (Object.keys(siguientesErrores).length > 0) return;

    const nuevoProducto: Omit<Producto, "id"> = {
      nombre: valores.nombre.trim(),
      precio: Number(valores.precio),
      destacado: valores.destacado,
    };
    const descripcion = valores.descripcion.trim();
    const stock = valores.stock.trim();
    const imagenUrl = valores.imagenUrl.trim();

    if (descripcion) nuevoProducto.descripcion = descripcion;
    if (stock) nuevoProducto.stock = Number(stock);
    if (imagenUrl) nuevoProducto.imagenUrl = imagenUrl;
    if (especificaciones) nuevoProducto.especificaciones = especificaciones;

    setEnviando(true);
    try {
      if (onGuardar) {
        await onGuardar(nuevoProducto);
      } else {
        const producto = await crearProducto(nuevoProducto);
        navigate(`/productos/${producto.id}`, {
          state: { productoCreado: true },
        });
      }
    } catch (error) {
      setErrorEnvio(
        error instanceof Error
          ? error.message
          : "No pudimos guardar el producto. Intentá nuevamente.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="producto-create" aria-labelledby="producto-create-title">
      <div className="producto-create__intro">
        <p className="producto-create__eyebrow">Administración del catálogo</p>
        <h1 id="producto-create-title">{titulo}</h1>
        <p>
          Completá los datos de la pieza. El nombre y el precio son obligatorios.
        </p>
        <Link className="producto-create__back" to="/productos">
          ← Volver al catálogo
        </Link>
      </div>

      <form className="producto-create__form" onSubmit={enviarFormulario} noValidate>
        <div className="producto-create__field">
          <label htmlFor="producto-nombre">Nombre *</label>
          <input
            id="producto-nombre"
            name="nombre"
            value={valores.nombre}
            onChange={(evento) => actualizarCampo("nombre", evento.target.value)}
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={errores.nombre ? "producto-nombre-error" : undefined}
            required
          />
          {errores.nombre && (
            <span className="producto-create__error" id="producto-nombre-error">
              {errores.nombre}
            </span>
          )}
        </div>

        <div className="producto-create__field">
          <label htmlFor="producto-descripcion">Descripción</label>
          <textarea
            id="producto-descripcion"
            name="descripcion"
            rows={4}
            value={valores.descripcion}
            onChange={(evento) =>
              actualizarCampo("descripcion", evento.target.value)
            }
          />
        </div>

        <div className="producto-create__row">
          <div className="producto-create__field">
            <label htmlFor="producto-precio">Precio *</label>
            <input
              id="producto-precio"
              name="precio"
              type="number"
              min="0"
              step="any"
              value={valores.precio}
              onChange={(evento) => actualizarCampo("precio", evento.target.value)}
              aria-invalid={Boolean(errores.precio)}
              aria-describedby={errores.precio ? "producto-precio-error" : undefined}
              required
            />
            {errores.precio && (
              <span className="producto-create__error" id="producto-precio-error">
                {errores.precio}
              </span>
            )}
          </div>

          <div className="producto-create__field">
            <label htmlFor="producto-stock">Stock</label>
            <input
              id="producto-stock"
              name="stock"
              type="number"
              min="0"
              step="any"
              value={valores.stock}
              onChange={(evento) => actualizarCampo("stock", evento.target.value)}
              aria-invalid={Boolean(errores.stock)}
              aria-describedby={errores.stock ? "producto-stock-error" : undefined}
            />
            {errores.stock && (
              <span className="producto-create__error" id="producto-stock-error">
                {errores.stock}
              </span>
            )}
          </div>
        </div>

        <div className="producto-create__field">
          <label htmlFor="producto-imagen">URL de imagen</label>
          <input
            id="producto-imagen"
            name="imagenUrl"
            type="url"
            value={valores.imagenUrl}
            onChange={(evento) => actualizarCampo("imagenUrl", evento.target.value)}
          />
        </div>

        <div className="producto-create__field">
          <label htmlFor="producto-especificaciones">Especificaciones (JSON)</label>
          <textarea
            id="producto-especificaciones"
            name="especificaciones"
            rows={5}
            placeholder={'{\n  "medidas": "120 × 60 × 75 cm"\n}'}
            value={valores.especificaciones}
            onChange={(evento) =>
              actualizarCampo("especificaciones", evento.target.value)
            }
            aria-invalid={Boolean(errores.especificaciones)}
            aria-describedby={
              errores.especificaciones
                ? "producto-especificaciones-error"
                : "producto-especificaciones-ayuda"
            }
          />
          <span
            className="producto-create__help"
            id="producto-especificaciones-ayuda"
          >
            Opcional. Usá un objeto JSON con valores de texto.
          </span>
          {errores.especificaciones && (
            <span
              className="producto-create__error"
              id="producto-especificaciones-error"
            >
              {errores.especificaciones}
            </span>
          )}
        </div>

        <label className="producto-create__checkbox">
          <input
            name="destacado"
            type="checkbox"
            checked={valores.destacado}
            onChange={(evento) =>
              actualizarCampo("destacado", evento.target.checked)
            }
          />
          <span>Destacar este producto</span>
        </label>

        {errorEnvio && (
          <p className="producto-create__feedback producto-create__feedback--error" role="alert">
            {errorEnvio}
          </p>
        )}

        <button
          className="producto-create__submit"
          type="submit"
          disabled={enviando}
        >
          {enviando ? "Guardando…" : textoBoton}
        </button>
      </form>
    </section>
  );
}

export default ProductoCreate;