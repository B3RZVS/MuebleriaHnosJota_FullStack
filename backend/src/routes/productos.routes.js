import { Router } from 'express';
import productosController from '../controllers/productos.controller.js';

const router = Router();

router.get('/', productosController.obtenerProductos);
router.get('/:id', productosController.obtenerProductoPorId);

export default router;
