import mongoose from 'mongoose';

import { EMAIL_VALIDO } from '../utils/auth.utils.js';

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres.'],
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_VALIDO, 'El correo electrónico no es válido.'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria.'],
      select: false,
    },
    rol: {
      type: String,
      enum: {
        values: ['cliente', 'admin'],
        message: 'El rol debe ser cliente o admin.',
      },
      default: 'cliente',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
