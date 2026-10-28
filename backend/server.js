// Tiene que ir primero: carga las variables del archivo .env antes de que app.js las lea
import 'dotenv/config';
import { connectDatabase } from './src/config/database.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

try {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('No se pudo iniciar el servidor por un error de conexión con MongoDB:', error);
  process.exitCode = 1;
}
