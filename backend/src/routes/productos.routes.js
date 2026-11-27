import { Router } from 'express';
import productosController from '../controllers/productos.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import adminGuard from '../middlewares/admin.middleware.js';

const router = Router();

router.get('/', productosController.obtenerProductos);
router.get('/:id', productosController.obtenerProductoPorId);

router.post('/', authMiddleware, adminGuard, productosController.crearProducto);
router.put(
  '/:id',
  authMiddleware,
  adminGuard,
  productosController.actualizarProducto
);
router.delete(
  '/:id',
  authMiddleware,
  adminGuard,
  productosController.eliminarProducto
);

export default router;
