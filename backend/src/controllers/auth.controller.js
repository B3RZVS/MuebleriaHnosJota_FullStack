import registroService from '../services/registro.service.js';
import loginService from '../services/login.service.js';

const registro = async (req, res, next) => {
  try {
    const resultado = await registroService.registrar(req.body ?? {});
    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const resultado = await loginService.iniciarSesion(req.body ?? {});
    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export default { registro, login };
