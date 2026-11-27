import mongoose from 'mongoose';

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      match: [emailValido, 'El correo electrónico no es válido.'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria.'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'],
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
