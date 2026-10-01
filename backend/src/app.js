import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productos.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import loggerMiddleware from './middlewares/logger.middleware.js';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';
import sessionMiddleware from './middlewares/session.middleware.js';

const app = express();
const clientOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(loggerMiddleware);
app.use(
  cors({
    origin: clientOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(sessionMiddleware);

app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
