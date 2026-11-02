import mongoose from 'mongoose';

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
    },
    destacado: {
      type: Boolean,
    },
    especificaciones: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model('Product', productSchema);
