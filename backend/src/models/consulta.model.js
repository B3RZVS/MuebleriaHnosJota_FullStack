import mongoose from 'mongoose';

const consultaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    mensaje: {
      type: String,
      required: true,
      trim: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model('Consulta', consultaSchema);
