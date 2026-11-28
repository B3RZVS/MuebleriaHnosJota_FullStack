import mongoose from 'mongoose';

const orderProductSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser mayor que cero.'],
      validate: {
        validator: Number.isInteger,
        message: 'La cantidad debe ser un número entero.',
      },
    },
    precio: {
      type: Number,
      required: true,
      min: [0, 'El precio no puede ser negativo.'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'El subtotal no puede ser negativo.'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productos: {
      type: [orderProductSchema],
      required: true,
      validate: {
        validator: (productos) => productos.length > 0,
        message: 'El pedido debe contener al menos un producto.',
      },
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo.'],
    },
    fechaPedido: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model('Order', orderSchema);
