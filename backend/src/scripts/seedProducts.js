import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Product from '../models/product.model.js';
import productos from '../data/productos.js';

try {
  await connectDatabase();

  const cantidadExistente = await Product.countDocuments();

  if (cantidadExistente > 0) {
    throw new Error(
      `La colección ya contiene ${cantidadExistente} productos; no se modificaron datos.`
    );
  }

  await Product.insertMany(productos);
  console.log(`Se cargaron ${productos.length} productos iniciales.`);
} catch (error) {
  console.error('No se pudo cargar el catálogo inicial:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
