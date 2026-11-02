import { useState, type ComponentProps } from 'react';
import './ImagenProducto.css';

type ImagenProductoProps = Omit<ComponentProps<'img'>, 'src'> & {
  src?: string | null;
};

// sin foto o con el link roto muestro el logo de la marca :D
function ImagenProducto({
  src,
  className = '',
  ...resto
}: ImagenProductoProps) {
  const [fallo, setFallo] = useState(false);

  if (!src || fallo) {
    return (
      <img
        {...resto}
        className={`${className} imagen-reemplazo`}
        src="/logo.svg"
      />
    );
  }

  return (
    <img
      {...resto}
      className={className}
      src={src}
      onError={() => setFallo(true)}
    />
  );
}

export default ImagenProducto;
