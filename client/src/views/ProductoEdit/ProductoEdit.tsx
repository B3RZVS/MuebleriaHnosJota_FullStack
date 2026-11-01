import { Link, useNavigate, useParams } from "react-router-dom";
import ProductoCreate, {
  type ValoresFormulario,
} from "../../components/ProductoCreate/ProductoCreate";
import { useActualizarProducto } from "../../hooks/useActualizarProducto";
import { useProductoApi } from "../../hooks/useProductoApi";
import type { Producto } from "../../types/producto";
import "./ProductoEdit.css";

// el form trabaja con texto, por eso precio y stock van como string
const aValoresFormulario = (producto: Producto): ValoresFormulario => ({
  nombre: producto.nombre,
  descripcion: producto.descripcion ?? "",
  precio: String(producto.precio),
  stock: String(producto.stock ?? ""),
  imagenUrl: producto.imagenUrl ?? "",
  destacado: producto.destacado ?? false,
  especificaciones:
    producto.especificaciones &&
    Object.keys(producto.especificaciones).length > 0
      ? JSON.stringify(producto.especificaciones, null, 2)
      : "",
});

export const ProductoEdit = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: producto, isLoading, error } = useProductoApi(id);
  const actualizacion = useActualizarProducto();

  const guardar = async (datos: Omit<Producto, "id">) => {
    // si se vació un campo opcional va en null, si no el PUT deja el valor viejo :v
    await actualizacion.mutateAsync({
      id,
      cambios: {
        descripcion: null,
        stock: null,
        imagenUrl: null,
        especificaciones: null,
        ...datos,
      },
    });
    navigate(`/productos/${id}`, { state: { productoEditado: true } });
  };

  if (isLoading) {
    return (
      <p className="producto-edit" role="status">
        Cargando el producto…
      </p>
    );
  }

  if (error) {
    return (
      <div className="producto-edit" role="alert">
        <p>
          No pudimos cargar el producto. Revisá que el servidor esté disponible.
        </p>
        <Link to="/productos">← Volver al catálogo</Link>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="producto-edit" role="alert">
        <p>
          No encontramos este producto. Puede que ya no esté en el catálogo.
        </p>
        <Link to="/productos">← Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <ProductoCreate
      key={producto.id}
      valoresIniciales={aValoresFormulario(producto)}
      titulo="Editar producto"
      textoBoton="Guardar cambios"
      onGuardar={guardar}
    />
  );
};
