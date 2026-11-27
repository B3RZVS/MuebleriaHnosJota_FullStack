import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import User from '../models/user.model.js';

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error('Uso: npm run promote:admin -- correo@ejemplo.com');
  process.exit(1);
}

try {
  await connectDatabase();

  const usuario = await User.findOneAndUpdate(
    { email },
    { rol: 'admin' },
    { new: true }
  );

  if (!usuario) {
    throw new Error(`No existe un usuario con el correo ${email}.`);
  }

  console.log(`${usuario.email} ahora tiene el rol admin.`);
} catch (error) {
  console.error('No se pudo asignar el rol admin:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
