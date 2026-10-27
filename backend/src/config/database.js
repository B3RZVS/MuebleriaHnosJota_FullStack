import mongoose from 'mongoose';

export const connectDatabase = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error('Falta configurar la variable de entorno MONGODB_URI.');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Conexión con MongoDB establecida.');
};
