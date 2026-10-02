import consultasRepository from '../repositories/consultas.repository.js';

const recibirConsulta = async (req, res) => {
  await consultasRepository.guardar(req.body);
  res.status(202).json({ mensaje: 'Recibimos tu consulta. ¡Gracias por escribirnos!' });
};

export default { recibirConsulta };