import consultasRepository from '../repositories/consultas.repository.js';

const recibirConsulta = async (req, res, next) => {
  try {
    await consultasRepository.guardar(req.body);
    res.status(202).json({ mensaje: 'Recibimos tu consulta. ¡Gracias por escribirnos!' });
  } catch (error) {
    next(error);
  }
};

export default { recibirConsulta };
