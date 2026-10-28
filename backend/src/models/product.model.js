import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      min: 0,
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
  },
);

export default mongoose.model('Product', productSchema);
