import mongoose from 'mongoose';

// medidas, materiales, etc: un objeto donde todos los valores son texto
const sonEspecificaciones = (valor) =>
  valor == null ||
  (typeof valor === 'object' &&
    !Array.isArray(valor) &&
    Object.entries(valor).every(
      ([clave, texto]) => !clave.startsWith('$') && typeof texto === 'string'
    ));

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio.'],
      min: [0, 'El precio no puede ser negativo.'],
      max: [999999999, 'El precio es demasiado alto.'],
    },
    stock: {
      type: Number,
      min: [0, 'El stock no puede ser negativo.'],
      validate: {
        validator: (valor) => valor == null || Number.isInteger(valor),
        message: 'El stock debe ser un número entero.',
      },
    },
    imagenUrl: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/\S+$/,
        'La imagen debe ser una URL que empiece con http o https.',
      ],
    },
    destacado: {
      type: Boolean,
    },
    especificaciones: {
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: sonEspecificaciones,
        message:
          'Las especificaciones deben ser un objeto con valores de texto.',
      },
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model('Product', productSchema);
