import { Router } from 'express';
import contactoController from '../controllers/contacto.controller.js';
import contactFormMiddleware from '../middlewares/contactForm.middleware.js';

const router = Router();

router.post('/', contactFormMiddleware, contactoController.recibirConsulta);

export default router;