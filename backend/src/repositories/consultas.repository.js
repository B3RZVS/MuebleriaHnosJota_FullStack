import Consulta from '../models/consulta.model.js';

const guardar = (consulta) => Consulta.create(consulta);

export default { guardar };