import { Router } from 'express';
import carritoController from '../controllers/carrito.controller.js';

const router = Router();

router.get('/', carritoController.obtenerCarrito);
router.post('/items', carritoController.agregarItem);
router.patch('/items/:productoId', carritoController.actualizarCantidad);
router.delete('/items/:productoId', carritoController.eliminarItem);
router.delete('/', carritoController.vaciarCarrito);

export default router;
