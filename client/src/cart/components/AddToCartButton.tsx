import { useEffect, useState } from 'react';
import { BsCartPlus, BsCheck2 } from 'react-icons/bs';
import { useCart } from '../context/useCart';

interface AddToCartButtonProps {
  productoId: string;
  nombre: string;
  etiqueta?: string;
  sinStock?: boolean;
}

function AddToCartButton({
  productoId,
  nombre,
  etiqueta = 'Agregar al carrito',
  sinStock = false,
}: AddToCartButtonProps) {
  const { agregar, productosAgregando, cargando } = useCart();
  const agregando = productosAgregando.includes(productoId);
  // El resultado se muestra un momento en el mismo botón, justo donde se hizo clic
  const [resultado, setResultado] = useState<'' | 'agregado' | 'error'>('');

  useEffect(() => {
    if (!resultado) return;

    const temporizador = setTimeout(() => setResultado(''), 2500);
    return () => clearTimeout(temporizador);
  }, [resultado]);

  const agregarAlCarrito = async () => {
    setResultado('');
    const agregado = await agregar(productoId);
    setResultado(agregado ? 'agregado' : 'error');
  };

  // texto: lo que se ve; descripcion: lo que lee el lector de pantalla (incluye el nombre,
  // porque en el catálogo hay un botón igual por producto)
  let texto = etiqueta;
  let descripcion = `${etiqueta}: ${nombre}`;

  if (sinStock) {
    texto = 'Sin stock';
    descripcion = `${nombre} está sin stock`;
  } else if (agregando) {
    texto = 'Agregando…';
    descripcion = `Agregando ${nombre}`;
  } else if (resultado === 'agregado') {
    texto = 'Agregado';
    descripcion = `${nombre} agregado al carrito`;
  } else if (resultado === 'error') {
    texto = 'No se pudo agregar';
    descripcion = `No se pudo agregar ${nombre}. Intentá de nuevo`;
  }

  return (
    <button
      className={`producto-card-boton producto-card-boton--principal${resultado === 'agregado' ? ' producto-card-boton--agregado' : ''}`}
      disabled={sinStock || agregando || cargando}
      onClick={() => void agregarAlCarrito()}
      type="button"
      aria-label={descripcion}
    >
      {!sinStock && !agregando && resultado === '' && (
        <BsCartPlus aria-hidden="true" />
      )}
      {!agregando && resultado === 'agregado' && (
        <BsCheck2 aria-hidden="true" />
      )}
      <span>{texto}</span>
    </button>
  );
}

export default AddToCartButton;
