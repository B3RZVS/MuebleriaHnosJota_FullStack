import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productos.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import loggerMiddleware from './middlewares/logger.middleware.js';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';
import sessionMiddleware from './middlewares/session.middleware.js';

const app = express();

app.use(loggerMiddleware);
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
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
