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

// El middleware de autenticación ya dejó al usuario en req.usuario
const perfil = (req, res) => res.status(200).json({ usuario: req.usuario });

export default { registro, login, perfil };
