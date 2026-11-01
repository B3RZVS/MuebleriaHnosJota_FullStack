import { Router } from 'express';
import productosController from '../controllers/productos.controller.js';

const router = Router();

router.post('/', productosController.crearProducto);
router.get('/', productosController.obtenerProductos);
router.get('/:id', productosController.obtenerProductoPorId);
router.put('/:id', productosController.actualizarProducto);
router.delete('/:id', productosController.eliminarProducto);

export default router;
