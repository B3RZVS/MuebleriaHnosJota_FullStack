import type { Producto } from '../types/producto.ts'
import './ProductCard.css'

type ProductCardProps = {
  producto: Producto
}

// Da formato de moneda argentina al precio: 185000 -> "$ 185.000"
const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

function ProductCard({ producto }: ProductCardProps) {
  return (
    <article className="producto-card">
      <img
        className="producto-card-imagen"
        src={producto.imagen}
        alt={producto.nombre}
        width="1024"
        height="1024"
        loading="lazy"
      />
      <div className="producto-card-info">
        <h2 className="producto-card-nombre">{producto.nombre}</h2>
        <p className="producto-card-precio">{formatoPrecio.format(producto.precio)}</p>
      </div>
    </article>
  )
}

export default ProductCard
