import express from 'express';
import productosRoutes from './routes/productos.routes.js';
import loggerMiddleware from './middlewares/logger.middleware.js';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use('/api/productos', productosRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
