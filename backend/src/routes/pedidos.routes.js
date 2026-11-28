import { Router } from 'express';
import pedidosController from '../controllers/pedidos.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, pedidosController.crearPedido);
router.get('/mis-pedidos', authMiddleware, pedidosController.obtenerMisPedidos);

export default router;
